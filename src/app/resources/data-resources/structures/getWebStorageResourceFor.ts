import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { errorHandlerOnTypeMismatch, mapWhen } from '../../utils/helpers-streams'

interface WebStorage<T> {
        data$: Observable<T>,
        setItem: Subject<T>,
        deleteItem: Subject<undefined>
}

class WebStorageResource implements WebStorage<any> {
    public data$;
    public setItem = new Subject();
    public deleteItem = new Subject();

    constructor(storage: Storage, name) {
        this.data$ = Observable
            .of(getValueFromStorage(storage, name))
            .merge(
                this
                    .setItem
                    .do(item => storage.setItem(name, JSON.stringify(item))),
                this
                    .deleteItem
                    .do(() => storage.removeItem(name))
                    .map(() => null)
            )

    }
}

export interface WebStorageConstructor {
    new (typeOfStorage: Storage, name): WebStorageResource;
}


export function getWebStorageResourceFor(typeOfStorage: Storage, name) {
    class ProducedWebStorageResource extends WebStorageResource {
        constructor() {
            super(typeOfStorage, name);
        }
    }

    return ProducedWebStorageResource as WebStorageConstructor;
}


function getValueFromStorage(storage: Storage, name) {
    const value = storage.getItem(name);
    if(typeof value === 'undefined') return null;
    try {
        JSON.parse(name);
    } catch (e) {
        return name;
    }
}
