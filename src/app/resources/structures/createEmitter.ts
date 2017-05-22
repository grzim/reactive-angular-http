import { EventEmitter } from '@angular/core'
import { ObservableFunctionObject } from '../utils/helpers-interfaces'

export function createEmitter<T>() {
    const ee = new EventEmitter();
    const fun = ee.emit.bind(ee);
    fun.__proto__ = ee;
    return fun as ObservableFunctionObject<T>;
}
