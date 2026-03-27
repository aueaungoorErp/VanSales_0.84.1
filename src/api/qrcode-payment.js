import Request from '../utils/RequestQRPayment'

export const authForGetAccessTokenApi = (data) => {
    return new Promise((resolve, reject) => {
        Request.instance.post(`/Auth/Login`, data)
        .then(v => {
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

