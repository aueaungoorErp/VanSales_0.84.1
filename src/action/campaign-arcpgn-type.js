import { campaignARCPGNTypeSearchListApi } from '../api/campaign-arcpgn-type'
import * as types from '../constant/campaign-arcpgn-type'

export const setInitialState = () => dispatch => {
    dispatch({ type: types.CAMPAIGN_ARCPGN_TYPE_INITIAL_STATE})
}

export const setItem = (item) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.CAMPAIGN_ARCPGN_TYPE_SET_ITEM, payload: item })
        resolve()
    })
}

export const campaignARCPGNTypeSearchList = (id) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.CAMPAIGN_ARCPGN_TYPE_SEARCH_LIST })

        campaignARCPGNTypeSearchListApi(id).then((v) => {
            const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v
            const { RESULT } = RESULT_DATA
            if (STATUS === '00') {
                
                if(RESULT_DATA && (RESULT && RESULT.length > 0)) {
                    dispatch({ type: types.CAMPAIGN_ARCPGN_TYPE_SEARCH_LIST_SUCCESS, payload: RESULT })
                } else {
                    dispatch({ type: types.CAMPAIGN_ARCPGN_TYPE_SEARCH_LIST_FAIL, payload: 'Data not found' })
                    // reject('Data not found')
                }
            } else if ( STATUS === '10') {
                dispatch({ type: types.CAMPAIGN_ARCPGN_TYPE_SEARCH_LIST_FAIL, payload: ERROR_MESSAGES })
                // reject(ERROR_MESSAGES[0])
            } 

            // resolve(v)
        }).catch((err) => {
            dispatch({ type: types.CAMPAIGN_ARCPGN_TYPE_SEARCH_LIST_FAIL, payload: err.message })
            // reject(err.message)
        })

    })
}