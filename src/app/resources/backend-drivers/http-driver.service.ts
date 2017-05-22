import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import configs from '../configs/configs'
import { d, filterOnInstanceType, log, replayShare, toJson } from '../utils/helpers-streams'
import { g } from '../utils/helpers-debug'
import { cleanUrl, getJsonHeader, isInstanceOf } from '../utils/helpers-misc'
import { isSynchronizing } from '../utils/is-synchronizing'
import { ServerErrorData } from '../structures/ServerErrorData'
import { ServerResponseData } from '../structures/ServerResponseData'
import { HttpCallData } from '../structures/HttpCallData'
import { HttpGetData } from '../structures/HttpGetData'

const serverUrl = configs.serverUrl

@Injectable()
export class HttpDriver {

    /*outputs*/
    public data$: Observable<any>
    public errors$: Observable<any>
    public isSynchronizing$: Observable<boolean>

    /*inputs*/
    public get = new Subject<HttpGetData>()
    public patch = new Subject<any>()
    public put = new Subject<any>()
    public post = new Subject<any>()
    public delete = new Subject<any>()

    constructor(http: Http) {

        const replicateOutput = Symbol();
        Observable.prototype[replicateOutput] = handleOutput$;

        const httpResponseGet$ = this
            .get
            .flatMap(({url, success$, failure$}: HttpGetData) =>
                    http
                        .get((serverUrl + url)[cleanUrl]())
                         [replicateOutput](
                            failure$,
                            success$))
                         [replayShare]()


        const httpResponsePatch$ = this
            .patch
            .flatMap(({url, success$, failure$, payload}: HttpCallData) =>
                    http
                        .patch(
                            url,
                            JSON.stringify(payload),
                            {headers: getJsonHeader()})
                        [replicateOutput](
                            failure$,
                            success$))
                        [replayShare]()

        const serverResponses$ = Observable
            .merge(httpResponseGet$, httpResponsePatch$)

        const serverOK$ = serverResponses$[filterOnInstanceType](ServerResponseData)

        const serverErrors$ = serverResponses$[filterOnInstanceType](ServerErrorData)

        // replicate onto success$, failure$ streams
        serverOK$
            .filter(({streamToReplicate}) => isInstanceOf(Observable)(streamToReplicate))
            .subscribe(({streamToReplicate, data}) => streamToReplicate.next(data))

        serverErrors$
            .filter(({streamToReplicate}) => isInstanceOf(Observable)(streamToReplicate))
            .subscribe(({streamToReplicate, errorResponse}) => {
                streamToReplicate.next(errorResponse)
            })

        this.data$ = serverOK$.pluck('data')

        this.errors$ = serverErrors$.pluck('errorResponse')

        this.isSynchronizing$ = isSynchronizing(
            [this.get, this.patch],
            [this.data$, this.errors$]
        )


    }
}


function handleOutput$(failure$, success$) {
    return this
        [toJson]()
        .map((respone) => new ServerResponseData(respone, success$))
        .catch((errorResponse) =>
            Observable.of(new ServerErrorData(
                errorResponse,
                failure$)))
}

