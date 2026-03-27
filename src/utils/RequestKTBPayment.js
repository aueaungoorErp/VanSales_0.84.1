import axios from 'axios';
import * as appConfig from '../../appConfig';

const instance = axios.create({
  baseURL: appConfig.KTB_ENDPOINT,
  timeout: appConfig.REQUEST_TIMEOUT_MS,
  headers: {'Content-Type': 'application/json'},
});

export default {instance};
