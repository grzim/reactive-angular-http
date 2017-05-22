import { CombinedResource, CombinedResourceConstructor } from './structures/CombinedResource'
import { getWebsocketResource } from './structures/getWebsocketResource'
import { getSimpleResource } from './structures/getSimpleResource'
import { getFrozenResource } from './structures/getFrozeResource'
import { Inject, Injectable } from '@angular/core'
import { HttpDriver } from '../backend-drivers/http-driver.service'
import { ServerResourceConstructor } from './app-resources'


export function serverResourceFactory(url, type) {
    class DefaultClass extends CombinedResource {
        constructor(@Inject(HttpDriver) httpDriver) {
            super(httpDriver, url)
        }
    }
    const typeToResourceClassMap = {
        websocket: getWebsocketResource(DefaultClass, url),
        simple: getSimpleResource(DefaultClass),
        combined: DefaultClass,
        frozen: getFrozenResource(DefaultClass)
    }
    return typeToResourceClassMap[type] as ServerResourceConstructor;
}