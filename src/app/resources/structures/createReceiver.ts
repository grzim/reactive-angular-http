import { Subject } from 'rxjs/Subject'
import { replicate, replicateArray } from '../utils/replications'
import { ObservableFunctionObject } from '../utils/helpers-interfaces'

class Receiver<T> extends Subject<T> {
    private replicas = [];
    replicate(...input) {
        // should be commented out for production - possible memory leaks
        // #no-prod
        this.replicas.push(input);
        // #!
        (input.length > 1) ?
            replicateArray(input, this) :
            replicate(input[0], this)

        return () => this.replicas;
    }
    constructor() {
        super();
        this.subscribe = this.asObservable().subscribe
    }
    getAllReplicas() {
        return this.replicas;
    }
}

export function createReceiver<T>() {
    const receiver = new Receiver();
    const fun = receiver.replicate.bind(receiver);
    fun.__proto__ = receiver.asObservable();
    fun.constructor = Receiver;
    return fun as ObservableFunctionObject<T>;
}


