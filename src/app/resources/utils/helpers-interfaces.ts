import { Observable } from 'rxjs/Observable'

export interface Id {
    id: number;
}

export interface ObservableFunctionObject<T> extends Observable<T>, Function {

}