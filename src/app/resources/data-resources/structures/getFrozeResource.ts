import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { Inject } from '@angular/core'
import { HttpDriver } from '../../backend-drivers/http-driver.service'


export function getFrozenResource(DefaultClass) {
    class FrozenResource {
        /*outputs*/
        public data$: Observable<any>
        public isSynchronizing$: Observable<boolean>

        /*inputs*/
        public get: Subject<any>

        constructor(@Inject(HttpDriver) httpDriver) {
            const resource = new DefaultClass(httpDriver)
            this.data$ = resource.data$
            this.isSynchronizing$ = resource.isSynchronized$
            this.get = resource.get
        }
    }

    return FrozenResource;
}