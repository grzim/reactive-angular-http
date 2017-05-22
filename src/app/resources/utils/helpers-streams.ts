import { EventEmitter, Inject, ReflectiveInjector } from '@angular/core'
import { debug as debugHelper } from './helpers-debug'
import { Observable } from 'rxjs/Observable'
import { Http } from '@angular/http'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { Subject } from 'rxjs/Subject'
import { inject } from '@angular/core/testing'
import { DataAndErrorOutput } from '../data-and-error-output/data-and-error-output.service'
import { replicateArray, replicate } from './replications'
import * as R from 'ramda'
import { logger$ } from './logger'
import { identity } from './helpers-misc'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable'

export const log = Symbol()
export const catchUIErrorAndReplicate = Symbol()
export const d = Symbol()
export const debug = Symbol()
export const push = Symbol()
export const slice = Symbol()
export const toJson = Symbol()
export const replayShare = Symbol()
export const errorHandlerOnTypeMismatch = Symbol()
export const errorHandlerOnTypeMismatchDeep = Symbol()
export const filterOnType = Symbol()
export const filterOnInstanceType = Symbol()
export const filterOnInstanceTypeDifferentThan = Symbol()
export const mapWhen = Symbol()
export const errorWhen = Symbol()
export const catchAndResume = Symbol()

Observable.prototype[log] = logOperator
Observable.prototype[debug] = debugOperator
Observable.prototype[d] = debuggerOperator
Observable.prototype[toJson] = toJsonOperator
Observable.prototype[push] = pushOperator
Observable.prototype[slice] = sliceOperator
Observable.prototype[catchUIErrorAndReplicate] = catchErrorAndReplicateOperator
Observable.prototype[replayShare] = replayShareOperator
Observable.prototype[mapWhen] = mapWhenOperator
Observable.prototype[errorWhen] = errorWhenOperator
Observable.prototype[catchAndResume] = catchAndResumeOperator
Observable.prototype[filterOnType] = filterOnTypeOperator
Observable.prototype[filterOnInstanceType] = filterOnInstanceTypeOperator
Observable.prototype[filterOnInstanceTypeDifferentThan] = filterOnInstanceTypeDifferentThanOperator
Observable.prototype[errorHandlerOnTypeMismatch] = errorHandlerOnTypeMismatchFunction
Observable.prototype[errorHandlerOnTypeMismatchDeep] = errorHandlerOnTypeMismatchDeepFunction

export function fromEventEmitter<T>(emitter: EventEmitter<T>) {
    return emitter.asObservable()
}


function logOperator(indicator = '->') {
    const prefix = (indicator + ' ')
    return Observable.create(observer => {
        this.subscribe(
            (...values) => {
                console.log(prefix, values)
                observer.next(...values)
            },
            error => {
                console.log(prefix, 'error in logger:')
                console.error(error)
            },
            complete => console.log(prefix, 'log complete')
        )
    })
}

function mapWhenOperator(condition: Function | Boolean, mapperFunction: Function) {
   return Observable.create(observer => {
        this.subscribe(
            (...values) => {
                (conditionFunction(condition)(...values)) ?
                    observer.next(mapperFunction(...values)) :
                    observer.next(...values)
            },
            error => {
                console.log('error in logger:')
                console.error(error)
            },
            complete => console.log('log complete')
        )
    })

}

function errorWhenOperator(condition: Function | Boolean, errorMsg, output: Subject<any> = logger$) {
    return this
        .map(x => conditionFunction(condition)(x) ? Observable.throw(errorMsg) : Observable.of(x))
        .flatMap(identity)

}


function catchAndResumeOperator(output: Subject<any> = logger$) {
    return this
        .catch((err, cought) => {
            output.next(err.toString());
            return cought;
        })
}


function debugOperator(name) {
    return this.do((...values) => debugHelper(name, values))
}

function debuggerOperator(name) {
    return this.do((...values) => {
        debugger
    })
}

function catchErrorAndReplicateOperator() {
    return this.catch((err, cought) => {
        logger$.next(err.toString())
        return cought;
    })
}

function replayShareOperator(replayCount = 1) {
    return this.multicast(() => new ReplaySubject(replayCount)).refCount()
}


function filterOnTypeOperator(type) {
    return this.filter((item) => typeof item === type)
}

function filterOnInstanceTypeOperator(type) {
    return this.filter((item) => item instanceof type)
}

function filterOnInstanceTypeDifferentThanOperator(type) {
    return this.filter((item) => !(item instanceof type))
}

function toJsonOperator() {
    return this
        .map((res) => res.json())
}

function errorHandlerOnTypeMismatchDeepFunction(typeToCompareWith: string,
                                                valueOnError = Observable.empty()) {
    return this.map((valuesToCheck) => {
        if (
            valuesToCheck.find((valueToCheck) => typeof valueToCheck !== typeToCompareWith)
        ) return valueOnError
        return valuesToCheck
    })
}


function errorHandlerOnTypeMismatchFunction(typeToCompareWith: string,
                                            valueOnError = Observable.empty()) {
    return this.map((valueToCheck) => {
        if (typeof valueToCheck !== typeToCompareWith)
            return valueOnError
        return valueToCheck
    })
}


function pushOperator(observable: Observable<any>) {
    return this.merge(observable.withLatestFrom(this, (items, arr: Array<any>) => arr.push(items)));
}
function sliceOperator(observable: Observable<any>) {
    return this.merge(observable.withLatestFrom(this, (index, arr: Array<any>) => arr.slice(index, 1)));
}

function conditionFunction(condition: Function | Boolean) {
    return typeof condition === 'function' ? condition : () => condition;
}