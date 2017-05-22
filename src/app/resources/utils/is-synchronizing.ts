import { Observable } from 'rxjs/Observable'
import * as R from 'ramda'

export function isSynchronizing(startingSynchronizationStreams, endingSynchronizationStreams, startsFrom = 0) {
    const synchronizationStarts$ = Observable
        .merge(...startingSynchronizationStreams)
        .mapTo(R.inc)

    const synchronizationEnds$ = Observable
        .merge(...endingSynchronizationStreams)
        .mapTo(R.dec)

    return Observable
        .merge(synchronizationStarts$, synchronizationEnds$)
        .scan((acc: number, fun: Function) => fun(acc), startsFrom)
        .map(Boolean)
}
