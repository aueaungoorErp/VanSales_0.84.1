
import * as types from '../constant/outstanding-balance'
import { searchListApi, customerPreProcessPaymentApi, customerProcessPaymentApi, customerCreatePaymentApi } from '../api/outstanding-balance'
import { generateHeaderOutStandingCreatePayment } from '../utils/Order'

export const setInitialState = () => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.OUTSTANDING_BALANCE_SET_INITIAL_STATE})
        resolve()
    })
}

export const setCreateInitialState = () => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.OUTSTANDING_BALANCE_CREATE_SET_INITIAL_STATE})
        resolve()
    })
}

export const setCriteria = (criteria) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.OUTSTANDING_BALANCE_SET_CRITERIA, payload: criteria})
        resolve()
    })
}

export const setCheckNumber = (number) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.OUTSTANDING_BALANCE_SET_CHECK_NUMBER, payload: number })
        resolve()
    })
}

export const setPrePocessHeader = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.OUTSTANDING_BALANCE_PRE_PROCESS_SET_HEADER, payload: data})
        resolve()
    })
}

export const setPrePocessListItems = (items) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.OUTSTANDING_BALANCE_PRE_PROCESS_SET_LIST_ITEMS, payload: items})
        resolve()
    })
}

export const setCreateCheckedItems = (items) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.OUTSTANDING_BALANCE_CREATE_SET_CHECKED_ITEMS, payload: items})
        resolve()
    })
}

export const setError = (bool) => dispatch => {
    dispatch({type: types.OUTSTANDING_BALANCE_SET_ERROR, payload: bool})
}

export const clearListItems = () => dispatch => {
    dispatch({ type: types.OUTSTANDING_BALANCE_CLEAR_LIST_ITEMS})
}

export const setListItems = (items) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.OUTSTANDING_BALANCE_SET_LIST_ITEMS, payload: items })
        resolve()
    })
}

export const searchList = (nextPage) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const customer = getState().customer
        const outstandingBalance = getState().outstandingBalance

        dispatch({ type: types.OUTSTANDING_BALANCE_SEARCH_LIST_ITEMS })

        const criteria = {
            FROM: outstandingBalance.criteria.dateFrom,
            TO: outstandingBalance.criteria.dateTo,
            AR_CODE: customer.item.INFO.AR_CODE,
            OFFSET: nextPage ? (outstandingBalance.criteria.OFFSET - 1) * outstandingBalance.criteria.LIMIT : (1 - 1) * outstandingBalance.criteria.LIMIT,
            LIMIT: outstandingBalance.criteria.LIMIT
        }

        searchListApi(criteria).then((v) => {
            const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v
            if (STATUS === '00') {
                const { RESULT } = RESULT_DATA

                if(RESULT_DATA && (RESULT && RESULT.length > 0)) {
                    dispatch(setCriteria({
                        ...outstandingBalance.criteria,
                        OFFSET: nextPage ? outstandingBalance.criteria.OFFSET + 1: 2
                    }))
        
                    dispatch({ type: types.OUTSTANDING_BALANCE_SEARCH_LIST_ITEMS_SUCCESS, payload: RESULT })
                } else {
                    dispatch({ type: types.OUTSTANDING_BALANCE_SEARCH_LIST_ITEMS_SUCCESS, payload: [] })
                }
                    
            } else if ( STATUS === '10') {
                dispatch({ type: types.OUTSTANDING_BALANCE_SEARCH_LIST_ITEMS_FAIL})
            } 

        }).catch((error) => {
            dispatch({ type: types.OUTSTANDING_BALANCE_SEARCH_LIST_ITEMS_FAIL})
        })

        resolve()
    })
}

export const  customerPreProcessPayment = () => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const customer = getState().customer
        const listItems = getState().outstandingBalance.origin.listItems

        const newListItems = listItems.filter(item => item.isChecked).map(item => item.DI_KEY)

        if (newListItems === null || newListItems.length <= 0 ) reject('ไม่มีรายการที่เลือก')

        const data = {
            AR_CODE: customer.item.INFO.AR_CODE,
            SELECT_DOC: newListItems
        }

        customerPreProcessPaymentApi(data).then((v) => {
            const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v
            console.log('customer pre-process payment', v)
            if (STATUS === '00') {
                const items = RESULT_DATA.ITEMS.map(item => ({ ...item, VPD_PAY: item.VPD_PAY.toFixed(2) }))
                console.log('golf', items)
                dispatch({ type: types.OUTSTANDING_BALANCE_PRE_PROCESS_SUCCESS, payload: { header: RESULT_DATA.HEADER, listItems: items } })
            } else if ( STATUS === '10') {
                reject(ERROR_MESSAGES[0])
            } 

            resolve()
        }).catch((error) => {
            reject(error.message)
        })
    })
}

export const  customerProcessPayment = () => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const { header, listItems } = getState().outstandingBalance.preProcess

        const data = {
            HEADER: header,
            ITEMS: listItems
        }

        customerProcessPaymentApi(data).then((v) => {
            const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v
            console.log("customer-process-payment", v)
            if (STATUS === '00') {
                dispatch({ type: types.OUTSTANDING_BALANCE_PROCESS_SUCCESS, payload: { header: RESULT_DATA.HEADER, listItems: RESULT_DATA.ITEMS } })
            } else if ( STATUS === '10') {
                reject(ERROR_MESSAGES[0])
            } 

            resolve()
        }).catch((error) => {
            reject(error.message)
        })
    })
}

export const  customerCreatePayment = (forceSubmit, TxUID) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const { header, listItems } = getState().outstandingBalance.process
        const create = getState().outstandingBalance.create

        header.VPH_TRANSFER_QR_REFER = TxUID
        const generateHeader = generateHeaderOutStandingCreatePayment(header, create.checkedItems)
        const data = {
            HEADER: generateHeader,
            ITEMS: listItems,
            FORCE_SUBMIT: forceSubmit
        }

        customerCreatePaymentApi(data).then((v) => {
            const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v
            console.log("customer-create-payment", v)
            if (STATUS === '00') {
                dispatch({ type: types.OUTSTANDING_BALANCE_CREATE_SUCCESS, payload: { header: RESULT_DATA.HEADER, listItems: RESULT_DATA.ITEMS } })
            } else if ( STATUS === '10') {
                reject(ERROR_MESSAGES[0])
            } 

            resolve()
        }).catch((error) => {
            reject(error.message)
        })
    })
}

