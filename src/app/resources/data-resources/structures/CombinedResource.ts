import { create, identity, mergeWithModifications, urlFrom } from '../../utils/helpers-misc'
import { Observable } from 'rxjs/Observable'
import { replicatePairs } from '../../utils/replications'
import { isSynchronizing } from '../../utils/is-synchronizing'
import { produceCombinedCallObject } from '../../utils/http-payloads-generators'
import { Subject } from 'rxjs/Subject'
import { Inject } from '@angular/core'
import { HttpDriver } from '../../backend-drivers/http-driver.service'
import { catchAndResume, errorWhen, mapWhen } from '../../utils/helpers-streams'
import * as R from 'ramda'

export interface CombinedResourceConstructor {
    new (h: HttpDriver, url: string): CombinedResource;
}

export class CombinedResource {

    /*outputs*/
    public data$: Observable<any>
    protected fromServerData$: Observable<boolean>
    public isSynchronized$: Observable<boolean>

    /*inputs*/
    public save = new Subject()
    public get = new Subject()
    public put = new Subject()
    public post = new Subject()
    public del = new Subject()
    protected fromServerErrors = new Subject()
    protected fromHttpGet = new Subject()


    constructor(@Inject(HttpDriver) httpDriver, url) {
        this.fromServerData$ = this.fromHttpGet

        const [toGet$, toPut$, toPost$, toDelete$, toPatch$] =
            [this.get, this.put, this.post, this.del, this.save]
                .map(stream$ => checkSynchronizationState(stream$, this.isSynchronized$))

        const fromPutUiUpdate$ = toPut$
            .withLatestFrom(this.fromServerData$, mergeWithModifications)

        const fromPostUiUpdate$ = toPost$
            .withLatestFrom(this.fromServerData$, (newElements, currentData) =>
                currentData.concat(Array[create](newElements)))

        const fromDeleteUiUpdate$ = toDelete$
            .withLatestFrom(this.fromServerData$, (elementToDelete, currentData) => {
                const cmp = (x, y) => x.id === y.id
                return R.differenceWith(cmp, currentData, elementToDelete)
            })

        const fromPathUiUpdate$ = toPatch$

        const fromHttpCallsStreams = [
            fromPutUiUpdate$,
            fromPostUiUpdate$,
            fromDeleteUiUpdate$,
            fromPathUiUpdate$]

        const restoredDataWhenError$ = this.fromServerErrors
            .withLatestFrom(this.fromServerData$, (error, fromServer) => fromServer)

        this.data$ = Observable.merge(
            ...fromHttpCallsStreams,
            restoredDataWhenError$,
            this.fromHttpGet)


        const [putWithData$, postWithData$, deleteWithData$] =
            [toPut$, toPost$, toDelete$]
                .map(this.getHttpCallWithAdditionalDataStreamFrom.bind(this))

        const getWithData$ = toGet$
            [mapWhen](identity, (params) => ({
            options: {
                params: {
                    paramsMap: Object.keys(params).reduce((acc, curr) =>
                            acc.set(curr, Array[create](params[curr]))
                        , new Map())
                }
            }
        }))
            .map((options = {}) => (
                {
                    url: url,
                    failure$: this.fromServerErrors,
                    success$: this.fromHttpGet,
                    ...options
                }))
            .share()

        const patchWithData$ = toPatch$
            .withLatestFrom(
                this.fromServerData$,
                R.flip(produceCombinedCallObject))
            .map((patchObject) => ({
                url: url,
                payload: patchObject,
                failure$: this.fromServerErrors
            }))
            .share()

        this.isSynchronized$ = isSynchronizing(
            fromHttpCallsStreams,
            [this.fromServerData$, this.fromServerErrors])

        replicatePairs([[getWithData$, httpDriver.get],
            [putWithData$, httpDriver.put],
            [postWithData$, httpDriver.post],
            [deleteWithData$, httpDriver.delete],
            [patchWithData$, httpDriver.patch]])
    }

    private defaultHttpMapper({payload, specificUrl}) {
        return {
            url: urlFrom(URL, specificUrl),
            payload,
            failure$: this.fromServerErrors
        }
    }

    private getHttpCallWithAdditionalDataStreamFrom(stream$: Observable<any>) {
        return stream$
            .map(this.defaultHttpMapper)
            .share()
    }
}

function checkSynchronizationState(stream$, isSynchronized$ = Observable.of(true)) {
    return stream$
        .withLatestFrom(isSynchronized$,
            (data, isSynchronized) => ({data, isSynchronized}))
        [errorWhen](({isSynchronized}) => !isSynchronized,
            'Resource is synchronizing with a server. Please wait.')
        [catchAndResume]()
        .pluck('data')
}