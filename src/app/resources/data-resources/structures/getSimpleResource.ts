import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { Inject } from '@angular/core'
import { HttpDriver } from '../../backend-drivers/http-driver.service'


export function getSimpleResource(DefaultClass) {
    class SimpleResource {
        /*outputs*/
        public data$: Observable<any>
        public isSynchronizing$: Observable<boolean>

        /*inputs*/
        public get: Subject<any>
        public put: Subject<any>
        public post: Subject<any>
        public del: Subject<any>

        constructor(@Inject(HttpDriver) httpDriver) {
            const resource = new DefaultClass(httpDriver)
            this.data$ = resource.data$
            this.isSynchronizing$ = resource.isSynchronized$
            this.put = resource.put
            this.post = resource.post
            this.del = resource.del
            this.get = resource.get
        }
    }
    return SimpleResource;
}