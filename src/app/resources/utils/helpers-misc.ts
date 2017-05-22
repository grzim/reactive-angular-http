import { Observable } from 'rxjs/Observable'
import { Headers, Http } from '@angular/http'


export const create = Symbol()
export const areArrays = Symbol()
export const areNotArrays = Symbol()
export const cleanUrl = Symbol()

Array[create] = arrayCreateFunction
Array[areArrays] = arraysAreArraysFunction
Array[areNotArrays] = arraysAreNotArraysFunction
String.prototype[cleanUrl] = cleanUrlFunction

function arrayCreateFunction(items) {
    if (Array.isArray(items)) return items
    return [items]
}

function cleanUrlFunction() {
    return this.replace(/([^:])(\/\/+)/g, '$1/')
}

function arraysAreArraysFunction(...arrays) {
    return arrays.every((array) => Array.isArray(array))
}

function arraysAreNotArraysFunction(...arrays) {
    return arrays.every((array) => !Array.isArray(array))
}

export function composeUrl(root, specificUrlArr) {
    return convertPartsToUrl(root, ...Array[create](specificUrlArr))
}

export function identity(x) {
    return x
}

export function getJsonHeader(): Headers {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return headers
}

export function convertPartsToUrl(...urlParts) {
    return urlParts
        .map((urlPart) => ('' + urlPart).slice(-1) === '/' ? urlPart : urlPart + '/')
        .join('')
}

export function isInstanceOf(type) {
    return (item) => item instanceof type
}

export function mergeWithModifications(currentData, modifications) {
    if (Array.isArray(currentData))
        return Object.assign([], currentData, Array[create](modifications))
    if (typeof currentData === 'object')
        return Object.assign({}, currentData, modifications)
    return modifications
}

export function urlFrom(...values) {
    return values
        .reduce((acc, piece) => acc + '/' + piece, '')
        [cleanUrl]();
}