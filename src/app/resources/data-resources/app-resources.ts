
import { paths } from '../constants/paths'
import { serverResourceFactory } from './serverResourceFactory'
import { Inject, Injectable } from '@angular/core'
import { CombinedResource, CombinedResourceConstructor } from './structures/CombinedResource'
import { HttpDriver } from '../backend-drivers/http-driver.service'
import { getWebStorageResourceFor } from './structures/getWebStorageResourceFor'

export interface ServerResourceConstructor {
    new (h: HttpDriver): CombinedResource;
}

@Injectable()
export class Users extends serverResourceFactory('/users', 'simple') {
    constructor(@Inject(HttpDriver) httpDriver) {
        super(httpDriver)
    }
}

@Injectable()
export class Session extends serverResourceFactory('/session', 'simple') {
    constructor(@Inject(HttpDriver) httpDriver) {
        super(httpDriver)
    }
}

@Injectable()
export class AaaResource extends getWebStorageResourceFor(localStorage, 'aaa') {
}