import * as R from 'ramda'
import { areArrays, areNotArrays } from './helpers-misc'
import { Id } from './helpers-interfaces'
import { l } from './helpers-debug'
import { logger$ } from './logger'

const errorOnTypeMismatch = 'datatype mismatch in ';

export function produceCombinedCallObject(currentData, modifiedData) {
    const putObject = {}
    const postObject = {}
    const deleteObject = {}

    Object.keys(modifiedData).forEach((key) => {
        const modifiedModel = modifiedData[key]
        const currentModel = currentData[key]
        putObject[key] = producePut(currentModel, modifiedModel)
        deleteObject[key] = produceDelete(currentModel, modifiedModel)
        postObject[key] = producePost(currentModel, modifiedModel)
    })

    const [notEmptyPutObject, notEmptyDeleteObject, notEmptyPostObject] =
        [putObject, deleteObject, postObject].map(clearFromEmptyProperties)

    const patchObject = clearFromEmptyProperties(
        {
            put: notEmptyPutObject,
            delete: notEmptyDeleteObject,
            post: notEmptyPostObject
        })

    console.log('patchObject', patchObject)
    l('currentData', currentData, 'modifiedData', modifiedData)
    return patchObject;
}

export function productOf(currentData, modifiedData, fun) {
    const product = {};

    Object.keys(modifiedData).forEach((key) => {
        const modifiedModel = modifiedData[key]
        const currentModel = currentData[key]
        product[key] = fun(currentModel, modifiedModel)
    })

    return clearFromEmptyProperties(product);
}



export function producePut(currentModel, modifiedModel) {
    const propertiesAreArray = Array[areArrays](modifiedModel, currentModel)
    const propertiesAreNotArray = Array[areNotArrays](modifiedModel, currentModel)
    if(!propertiesAreArray && !propertiesAreNotArray ) throw new Error(errorOnTypeMismatch + 'producePut')
    if(propertiesAreNotArray) return currentModel !== modifiedModel ? modifiedModel : undefined;
    return modifiedModel
        .filter((item) =>
            typeof item === 'object' &&
            currentModel
                .find(({id}) => id === item.id))

}

export function compareDifferences(firstModel, secondModel, functionName) {
    const propertiesAreArray = Array[areArrays](firstModel, secondModel)
    const propertiesAreNotArray = Array[areNotArrays](firstModel, secondModel)
    if(!propertiesAreArray && !propertiesAreNotArray ) throw new Error(errorOnTypeMismatch + functionName)
    if (propertiesAreNotArray) return []
    if (firstModel.every((model) => R.has('id')(model)))
        return R.differenceWith((x: Id, y: Id) => x.id === y.id, firstModel, secondModel)
    return R.difference(firstModel, secondModel)
}


export function produceDelete(currentModel, modifiedModel) {
    return compareDifferences(currentModel, modifiedModel, 'produceDelete')
}

export function producePost(currentModel, modifiedModel) {
    return compareDifferences(modifiedModel, currentModel, 'producePost')
}

export function clearFromEmptyProperties(object) {
    Object.keys(object)
        .filter((key) => R.isEmpty(object[key]))
        .forEach((key) => delete object[key])
    return object
}

