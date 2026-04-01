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
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.request?.data ||
                error?.message ||
                'QRCode authentication failed'

            reject(errorMessage)
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
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                'Request QRCode SCB failed'

            reject(errorMessage)
        })
    })
}

