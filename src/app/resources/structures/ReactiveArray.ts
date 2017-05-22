import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import * as R from 'ramda'

export class ReactiveArray {

    // output:
    public data$: Observable<any>;

    // inputs:
    public clear = new Subject();
    public apply = new Subject<Function>();
    public put = new Subject<Array<any>>();

    constructor() {
        this.data$ = Observable.merge(this.clear.mapTo(R.empty),
            this.put.map((items) => R.concat(items)),
            this.apply)
            .scan((items: Array<any>, method: Function) =>
                method(items), [])
    }
}