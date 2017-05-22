import { Subject } from 'rxjs/Subject'

export const logger$ = new Subject<string>();
logger$.subscribe(console.error)