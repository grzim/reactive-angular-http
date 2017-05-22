import { Injectable } from '@angular/core';
import 'rx-dom'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import * as R from 'ramda'
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject'
import { ReactiveArray } from '../structures/ReactiveArray'

const wsUrl = 'dafds';

@Injectable()
export class WebsocketDriver {
  private websocketNotifications$;
  public notifications$: Observable<any>;
  private websocketBus = new ReactiveArray();
  private websockets: Array<Observable<any>> = [];

  constructor() {
    this.websocketNotifications$ = Observable.webSocket(wsUrl);
  }
  private subscribeToNotification(eventName: string) {
  }

  public joinRoom(room: string) {

  }
  public leaveRoom(room: string) {

  }
  public clearAllNotifications() {
    return this;
  }
  public closeConnection() {
    this.websocketNotifications$.unsubscribe();
  }

}

