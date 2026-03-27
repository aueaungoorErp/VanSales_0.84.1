import { authForGetAccessTokenApi, requestQrCodeSCBApi } from '../api/qrcode-payment'
// import { QRCODE_PAYMENT_AUTH_USERNAME, QRCODE_PAYMENT_AUTH_PASSWORD } from '../../appConfig'

export const authForGetAccessToken = (auth) => dispatch => {
    return new Promise((resolve, reject) => {
        // dispatch({ type: types.QR_CODE_PAYMENT_AUTH_LOGIN})
        // const auth = {
        //     'userName': QRCODE_PAYMENT_AUTH_USERNAME,
        //     'userPassword': QRCODE_PAYMENT_AUTH_PASSWORD,
        // }

        authForGetAccessTokenApi(auth).then((v) => {
            resolve(v)
        }).catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                reject(error.response.data)
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              reject(error.request.data)
            } else {
                // Something happened in setting up the request that triggered an Error
                reject(error.message)
            }

            reject(error.config)
          })
    })
}

export const requestQrCodeSCB = (data, amount) => (dispatch) => {
    return new Promise((resolve, reject) => {

        const request = {
            billerId: data.paymentChannels[0].billerId,
            amount: amount,
            terminal: data.paymentChannels[0].terminalId
        }
        console.log('requestQrCodeSCBApi ', request)
        requestQrCodeSCBApi(request).then((v) => {
            resolve(v)
        }).catch((error) => {
            if (error.message !== null) {
                reject(error.message)
            }
        })
    })
}

