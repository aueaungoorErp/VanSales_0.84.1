import Request from '../utils/Request'

export const searchListApi = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Customer/Bill/Credit/Search`, data)
        .then(v => {
            resolve(v.data) 
        }).catch((error) => {
            reject(error);
        })
    })  
}

export const customerPreProcessPaymentApi  = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Customer/PreProcess/Payment`, data)
        .then(v => {
            resolve(v.data) 
        }).catch((error) => {
            reject(error);
        })
    })  
}

export const customerProcessPaymentApi  = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Customer/Process/Payment`, data)
        .then(v => {
            resolve(v.data) 
        }).catch((error) => {
            reject(error);
        })
    })  
}

export const customerCreatePaymentApi  = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Customer/Create/Payment`, data)
        .then(v => {
            resolve(v.data) 
        }).catch((error) => {
            reject(error);
        })
    })  
}