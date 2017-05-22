import { HttpDriver } from '../../backend-drivers/http-driver.service'
import { CombinedResource, CombinedResourceConstructor } from './CombinedResource'
import { Inject } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'

export function getWebsocketResource(CombinedResourceClass: CombinedResourceConstructor, url) {
    class WebsocketResource extends CombinedResourceClass {
        public webSocketMessage$

        constructor(@Inject(HttpDriver) httpDriver) {
            super(httpDriver, url)
            // ToDo: from websocket logic
            const websocketData$ = new Subject()
            this.fromServerData$ = Observable.merge(this.fromHttpGet, websocketData$)
        }
    }
    return WebsocketResource;
}