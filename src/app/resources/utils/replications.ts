import { Subject } from 'rxjs/Subject'
import { identity } from './helpers-misc'
import { logger$ } from './logger'
import { Observable } from 'rxjs/Observable'
import { Inject } from '@angular/core'
import { HttpDriver } from '../backend-drivers/http-driver.service'

export function replicate(input$, output: Subject<any>, errorOutput?) {
    return replicateOnMethod(input$, output, output.next, errorOutput)
}


export function replicateOnError(input$, output: Subject<any> = logger$) {
    input$.catch((err, cought) => {
        output.next(err.toString());
        return cought;
    }).subscribe(identity)
}

export function replicateOnMethod(input$, output, outputMethodForReplication, errorOutput?) {
    replicateOnError(input$, errorOutput);
    return input$
        .catch((error, cought) => cought)
        .subscribe((msg) => outputMethodForReplication.call(output, msg));
}

export function replicateArray(inStreamsArray, outStream, errorOutput?) {
    inStreamsArray.forEach((inStream) => replicate(inStream, outStream, errorOutput))
    return inStreamsArray
}

export function replicatePairs(array: Array<[Observable<any>, Subject<any>]>) {
    array.forEach(arr => replicate(arr[0], arr[1]));
}







