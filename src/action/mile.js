import * as types from '../constant/mile'
import { mileCheckinCreateApi, mileAttachImageApi } from '../api/mile'

export const setInitialState = () => dispatch => {
    dispatch({ type: types.MILE_SET_INITIAL_STATE})
}

export const addPhoto = (uri) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.MILE_ADD_PHOTO, payload: uri})
        resolve()
    })
}

export const setMileage = (value) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.MILE_SET_MILEAGE, payload: value})
        resolve()
    })
}

export const setIsSubmit = (bool) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.MILE_SET_IS_SUBMIT, payload: bool})
        resolve()
    })
}

export const mileCheckinCreate = (data) => async dispatch => {
    console.log('mileCheckinCreate data', data)
    return new Promise((resolve, reject) => {
        
        mileCheckinCreateApi(data).then((v) => {
            const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v
            if (STATUS === '00') {
                resolve(v)
            } else if ( STATUS === '10') {
                reject(ERROR_MESSAGES)
            } 
        }).catch((err) => {
            reject(err.message)
        })
    })
}


export const mileAttachImage = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        console.log('mileAttachImage', data)
        mileAttachImageApi(data).then((v) => {
            const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v
            if (STATUS === '00') {
                resolve(v)
            } else if ( STATUS === '10') {
                reject(ERROR_MESSAGES[0])
            } 
        }).catch((error) => {
            reject(error.message)
        })
    })
}