import axios from 'axios';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import * as appConfig from '../../appConfig';
import { normalizeWebServiceUrl } from './webService';

const instance = axios.create({
  baseURL: appConfig.API_ENDPOINT,
  timeout: appConfig.REQUEST_TIMEOUT_MS,
  headers: {'Content-Type': 'application/json'},
});

const instanceV3 = axios.create({
  baseURL: appConfig.API_ENDPOINT_V3,
  timeout: appConfig.REQUEST_TIMEOUT_MS,
  headers: {'Content-Type': 'application/json'},
});

let timeCutOff = moment().valueOf().toString();

const setTimeCutOff = () => {
  timeCutOff = moment().valueOf();
  // console.log('setTimeCutOff', timeCutOff)
};

const setBaseUrl = (baseURL) => {
  if (baseURL) {
    instance.defaults.baseURL = baseURL;
  }
};
const setBaseV3Url = (baseURL) => {
  if (baseURL) {
    instanceV3.defaults.baseURL = normalizeWebServiceUrl(baseURL);
  }
};

const setHeaders = (header) => {
  const {userToken, vanCNFMachine} = header;

  if (vanCNFMachine) {
    instance.defaults.headers.common['VANCNF_MACHINE'] = vanCNFMachine;
  }

  if (DeviceInfo.getUniqueId()) {
    instance.defaults.headers.common['DEVICE_ID'] = DeviceInfo.getUniqueId();
  }

  if (userToken) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  }
};

const setHeadersV3 = (header) => {
  const {userToken, vanCNFMachine} = header;

  if (vanCNFMachine) {
    instanceV3.defaults.headers.common['VANCNF_MACHINE'] = vanCNFMachine;
  }

  if (DeviceInfo.getUniqueId()) {
    instanceV3.defaults.headers.common['DEVICE_ID'] = DeviceInfo.getUniqueId();
  }

  if (userToken) {
    instanceV3.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  }
};

const removeAllHeaders = () => {
  delete instance.defaults.headers.common['VANCNF_MACHINE'];
  delete instance.defaults.headers.common['Authorization'];
  delete instance.defaults.headers.common['DEVICE_ID'];
};
const removeAllHeadersV3 = () => {
  delete instanceV3.defaults.headers.common['VANCNF_MACHINE'];
  delete instanceV3.defaults.headers.common['Authorization'];
  delete instanceV3.defaults.headers.common['DEVICE_ID'];
};
const interceptor = instance.interceptors.request.use(
  function (config) {
    // alert('configss:' + config.data)
    // console.log('config data', config.data)
    config['timeRequest'] = moment().valueOf();
    // console.log('request time',  moment().valueOf())
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

const interceptorV3 = instanceV3.interceptors.request.use(
  function (config) {
    // alert('configss:' + config.data)
    //console.log('config data', config.data);
    config['timeRequest'] = moment().valueOf();
    // console.log('request time',  moment().valueOf())
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

const removeInterceptors = () => {
  instance.interceptors.request.eject(interceptor);
};
const removeInterceptorsV3 = () => {
  instanceV3.interceptors.request.eject(interceptorV3);
};

instance.interceptors.request.use(interceptor);

instanceV3.interceptors.request.use(interceptorV3);

instance.interceptors.response.use(
  function (response) {
    // Do something with response data
    console.log(response.status);

    // console.log('response', response.config.timeRequest, timeCutOff, response.config)
    // console.log('response time',  moment().valueOf())

    if (timeCutOff > response.config.timeRequest) {
      throw new Error('cut off request');
    } else {
      return response;
    }

    console.log(response.status);
    // throw new Error("Error")
    return response;
  },
  function (error) {
    // alert('false')
    // Do something with response error
    return Promise.reject(error);
  },
);

instanceV3.interceptors.response.use(
  function (response) {
    // Do something with response data
    console.log(response.status);

    // console.log('response', response.config.timeRequest, timeCutOff, response.config)
    // console.log('response time',  moment().valueOf())

    if (timeCutOff > response.config.timeRequest) {
      throw new Error('cut off request');
    } else {
      return response;
    }

    console.log(response.status);
    // throw new Error("Error")
    return response;
  },
  function (error) {
    // alert('false')
    // Do something with response error
    return Promise.reject(error);
  },
);

export default {
  instance,
  instanceV3,
  setBaseUrl,
  setBaseV3Url,
  setHeaders,
  setHeadersV3,
  removeAllHeaders,
  removeAllHeadersV3,
  removeInterceptors,
  removeInterceptorsV3,
  setTimeCutOff,
};
