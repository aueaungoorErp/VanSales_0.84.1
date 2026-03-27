import Request from '../utils/Request'

export const billTodayGetListItemsApi = (code) => {
    return new Promise((resolve, reject) => {
        Request.instance.get(`/Customer/Bill/Today/${code}`)
        .then(v => {
            resolve(v.data) 
        }).catch((error) => {
            reject(error)
        })
    })  
}

export const billSearchListItemsApi = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Customer/Bill/Search`, data)
        .then(v => {
            resolve(v.data) 
        }).catch((error) => {
            reject(error)
        })
    })  
}