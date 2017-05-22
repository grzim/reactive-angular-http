import { Observable } from 'rxjs/Observable'

export interface HttpGetData {
    url: string,
    success$?: Observable<any>,
    failure$?: Observable<any>
}
