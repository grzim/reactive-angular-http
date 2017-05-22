import { Observable } from 'rxjs/Observable'

export interface HttpCallData {
    url: string,
    payload: object,
    success$?: Observable<any>,
    failure$?: Observable<any>
}
