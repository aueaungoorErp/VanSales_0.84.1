import Request from '../utils/Request'

export const mileCheckinCreateApi = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Checkin/Create`, data)
        .then(v => {
            resolve(v.data) 
        }).catch((error) => {
            reject(error)
        })
    })  
}

export const mileAttachImageApi = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Checkin/AttachImage`, data)
        .then(v => {
            resolve(v.data) 
        }).catch((error) => {
            reject(error)
        })
    })
}