import axios from 'axios'
import * as appConfig from '../../appConfig'

const instance = axios.create({
    baseURL: appConfig.API_ENDPOINT,
    timeout: appConfig.REQUEST_TIMEOUT_MS,
})

export default instance