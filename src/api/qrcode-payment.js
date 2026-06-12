import axios from 'axios'
import * as appConfig from '../../appConfig'
import Request from '../utils/RequestQRPayment'
import { normalizePaymentBaseUrl } from '../utils/webService'

export const authForGetAccessTokenApi = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Auth/Login`, data)
        .then(v => {
            console.log('vv',v)
            Request.setHeaders({ userToken: v.data.token })
            resolve(v.data) 
        }).catch((err) => {
            reject(err)
        })
    })  
}

export const requestQrCodeSCBApi = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Payments/RequestQrCode/SCB`, data)
        .then(v => {
            resolve(v.data) 
        }).catch((err) => {
            reject(err)
        })
    })  
}

export const requestBBLPaymentHealthApi = (baseUrl) => {
    return new Promise((resolve, reject) => {
        const normalizedBaseUrl = normalizePaymentBaseUrl(baseUrl)

        if (!normalizedBaseUrl) {
            reject(new Error('กรุณาระบุ Base URL'))
            return
        }

        axios.get(`${normalizedBaseUrl}/health`, {
            timeout: appConfig.REQUEST_TIMEOUT_MS,
            headers: { 'Content-Type': 'application/json' },
        })
        .then(v => {
            resolve(v.data)
        }).catch((err) => {
            reject(err)
        })
    })
}

