import axios from 'axios'
import * as appConfig from '../../appConfig'

const instance = axios.create({
    baseURL: appConfig.API_QR_PAYMENT_ENDPOINT,
    timeout: appConfig.REQUEST_TIMEOUT_MS,
    headers: { 'Content-Type': 'application/json' }
})

const setHeaders = (header) => {
    const { userToken } = header

    if (userToken) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
    }
    
}

const interceptor = instance.interceptors.request.use(function (config) {
        return config
    }, function (error) {
        return Promise.reject(error)
})

instance.interceptors.request.use(interceptor)

instance.interceptors.response.use(function (response) {
    return response
}, function (error) {
    return Promise.reject(error)
})

export default { instance, setHeaders }