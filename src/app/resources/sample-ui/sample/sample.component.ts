import { Component, EventEmitter, OnInit } from '@angular/core'
import { createEmitter } from '../../structures/createEmitter'
import { AaaResource, Users } from '../../data-resources/app-resources'
import { replicateArray, replicatePairs } from '../../utils/replications'
import { Observable } from 'rxjs/Observable'

@Component({
    selector: 'app-sample',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

    // Outputs
    private setAaaEmitter = createEmitter()
    private deleteAaaEmitter = createEmitter()
    private uiErrorEmitter = createEmitter()
    private getEmitter = createEmitter()
    private putEmitter = createEmitter()
    private deleteEmitter = createEmitter()
    private postEmitter = createEmitter()
    private patchEmitter = createEmitter()

    // Inputs
    private aaa$: Observable<any>
    private serverData$: Observable<any>

    constructor(aaa: AaaResource, users: Users) {

        this.aaa$ = aaa.data$
        this.serverData$ = users.data$

        replicatePairs([[this.setAaaEmitter, aaa.setItem],
            [this.deleteAaaEmitter, aaa.deleteItem],
            [this.uiErrorEmitter.map((a: { c: Function }) => a.c()), aaa.setItem],
            [this.getEmitter, users.get],
            [this.putEmitter, users.put],
            [this.deleteEmitter, users.del],
            [this.postEmitter, users.post]])
    }

    ngOnInit() {
    }

}
