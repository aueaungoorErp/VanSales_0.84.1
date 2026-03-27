import Request from '../utils/Request'

export const campaignFindByConditionApi = (request) => {
    return new Promise((resolve, reject) => {
        Request.instance.get(`/Campian/${request.ARCPGN_TYPE}/${request.ARCPGN_CODE}`)
        .then(v => {
            resolve(v.data) 
        }).catch((err) => {
            reject(err);
        })
    })  
}