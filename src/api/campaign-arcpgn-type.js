import Request from '../utils/Request'

export const campaignARCPGNTypeSearchListApi = (id) => {
    return new Promise((resolve, reject) => {
        Request.instance.get(`/Campian/${id}`)
        .then(v => {
            resolve(v.data) 
        }).catch((err) => {
            reject(err);
        })
    })  
}