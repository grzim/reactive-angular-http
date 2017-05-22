import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { isFunction } from 'rxjs/util/isFunction'
import { Subject } from 'rxjs/Subject'
import { isInstanceOf } from '../utils/helpers-misc'
import { logger$ } from '../utils/logger'
import { HttpDriver } from '../backend-drivers/http-driver.service'
import { WebsocketDriver } from '../backend-drivers/websocket-driver.service'

@Injectable()
export class DataAndErrorOutput {
    public serverErrors$: Observable<string>
    public uiErrors$ = logger$;

  constructor(httpDriver: HttpDriver, websocketDriver: WebsocketDriver) {
    const serverData$ = httpDriver.data$;
    const websocketNotifications = websocketDriver.notifications$;
    this.serverErrors$ = httpDriver.errors$;
  }

}