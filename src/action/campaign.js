import { campaignFindByConditionApi } from '../api/campaign'
import * as types from '../constant/campaign'

export const setInitialState = () => dispatch => {
    dispatch({ type: types.CAMPAIGN_SET_INITIAL_STATE })
}

export const setErrorMessage = (message) => dispatch => {
    dispatch({ type: types.CAMPAIGN_SET_ERROR_MESSAGE, payload: message })
}

export const campaignFindByCondition = (request) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.CAMPAIGN_FIND_BY_CONDITION })

        campaignFindByConditionApi(request).then((v) => {
            const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v
            console.log('campaignFindByCondition v', v)
            if (STATUS === '00') {
                    const { RESULT } = RESULT_DATA
                if (RESULT_DATA && (RESULT && RESULT.length > 0)) {
                    dispatch({ type: types.CAMPAIGN_FIND_BY_CONDITION_SUCCESS, payload: RESULT })
                    console.log('campaignFindByCondition STATUS', STATUS)
                    resolve(STATUS)
                }
            } else if ( STATUS === '10') {
                dispatch({ type: types.CAMPAIGN_FIND_BY_CONDITION_FAIL, payload: ERROR_MESSAGES })
                reject(ERROR_MESSAGES[0])
            } 
        }).catch((err) => {
            console.log('campaignFindByCondition error', err.message)
            dispatch({ type: types.CAMPAIGN_FIND_BY_CONDITION_FAIL, payload: err.message })
            reject(err.message)
        })
    })
}
