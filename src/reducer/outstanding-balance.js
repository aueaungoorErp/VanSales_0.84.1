import * as types from '../constant/outstanding-balance'
import moment from 'moment'
import { removeDuplicateArr } from '../utils/Array'

const initialState = {
    criteria: {
        FROM: null,
        TO: null,
        AR_CODE: null,
        OFFSET: 1,
        LIMIT: 10
    },
    item: {},
    listItems: [],
    origin: {
        item: {},
        listItems: [],
        checkNumber: 0,
        isNotFound: false,
        isLoading: false,
        errorMessage: null
    },
    preProcess: {
        header: {},
        item: {},
        listItems: [],
        checkNumber: 0,
        isNotFound: false,
        isLoading: false,
        errorMessage: null
    },
    process: {
        header: {},
        item: {},
        listItems: [],
        checkNumber: 0,
        isNotFound: false,
        isLoading: false,
        errorMessage: null
    },
    create: {
        header: {},
        item: {},
        listItems: [],
        checkNumber: 0,
        isNotFound: false,
        isLoading: false,
        errorMessage: null,
        checkedItems: {
            cash: {
                checked: false,
                pay: null
            },
            transfer: {
                checked: false,
                bankAccountItem: null,
                pay: null
            },
            qrcode: {
                checked: false,
                pay: null
            },
            cheques: [
                {
                    checked: false,
                    bankFileItem: null,
                    chequeDate: moment().format('DD/MM/YYYY'),
                    chequeNo: null,
                    bankFileItemEnabled: false,
                    chequeDateDisabled: true,
                    chequeNoEditable: false,
                    pay: null
                },
                {
                    checked: false,
                    bankFileItem: null,
                    chequeDate: moment().format('DD/MM/YYYY'),
                    chequeNo: null,
                    bankFileItemEnabled: false,
                    chequeDateDisabled: true,
                    chequeNoEditable: false,
                    pay: null
                },
                {
                    checked: false,
                    bankFileItem: null,
                    chequeDate: moment().format('DD/MM/YYYY'),
                    chequeNo: null,
                    bankFileItemEnabled: false,
                    chequeDateDisabled: true,
                    chequeNoEditable: false,
                    pay: null
                }
            ]
        }
    },
    checkNumber: 0,
    isNotFound: false,
    isLoading: false,
    errorMessage: null
}

export const outstandingBalance = (state = initialState, action) => {
    switch (action.type) {
        case types.OUTSTANDING_BALANCE_SET_INITIAL_STATE:
            return { ...initialState }
        case types.OUTSTANDING_BALANCE_SET_CRITERIA: 
            return { ...state, criteria: action.payload }
        case types.OUTSTANDING_BALANCE_CLEAR_LIST_ITEMS:
            return { 
                ...state, 
                origin: {
                    ...state.origin,
                    listItems: []
                }
            }
        case types.OUTSTANDING_BALANCE_SET_LIST_ITEMS:
            return { 
                ...state, 
                origin: {
                    ...state.origin, 
                    listItems: action.payload 
                }
            }
        case types.OUTSTANDING_BALANCE_SEARCH_LIST_ITEMS:
            return { 
                ...state, 
                origin: {
                    ...state.origin,
                    isLoading: true, 
                    isNotFound: false, 
                    isError: false 
                }
            }
        case types.OUTSTANDING_BALANCE_SEARCH_LIST_ITEMS_SUCCESS: 
            return { 
                ...state, 
                origin: {
                    ...state.origin,
                    listItems: action.payload && action.payload.length > 0 ? removeDuplicateArr(state.origin.listItems.concat(action.payload), 'DI_REF') : state.origin.listItems, 
                    isLoading: false, 
                    isNotFound: action.payload.length == 0
                }
        }
        case types.OUTSTANDING_BALANCE_SEARCH_LIST_ITEMS_FAIL:
            return { 
                ...state, 
                origin: { 
                    ...state.origin,
                    isLoading: false, 
                    isError: true 
                }
            }
        case types.OUTSTANDING_BALANCE_SET_ERROR: 
            return { ...state, isError: action.payload}
        case types.OUTSTANDING_BALANCE_SET_CHECK_NUMBER: 
            return { 
                ...state, 
                origin: { 
                    ...state.origin,
                    checkNumber: action.payload 
                }
            }
        case types.OUTSTANDING_BALANCE_PRE_PROCESS:
            return { 
                ...state, 
                preProcess: { 
                    ...state.preProcess, 
                    isLoading: true, 
                    isNotFound: false, 
                    isError: false 
                }
            }
        case types.OUTSTANDING_BALANCE_PRE_PROCESS_SUCCESS:
            return { 
                ...state, 
                preProcess: { 
                    ...state.preProcess, 
                    header: action.payload.header, 
                    listItems: action.payload.listItems, 
                    isLoading: false, 
                    isNotFound: false,
                    isError: false 
                }
            }
        case types.OUTSTANDING_BALANCE_PRE_PROCESS_FAIL:
            return { 
                ...state, 
                preProcess: { 
                    ...state.preProcess, 
                    isLoading: false, 
                    isError: true 
                }
            }
        case types.OUTSTANDING_BALANCE_PRE_PROCESS_SET_HEADER:
            return { 
                ...state, 
                preProcess: {
                    ...state.preProcess, 
                    header: action.payload 
                }
            }
        case types.OUTSTANDING_BALANCE_PRE_PROCESS_SET_LIST_ITEMS:
            return { 
                ...state, 
                preProcess: {
                    ...state.preProcess, 
                    listItems: action.payload 
                }
            }
        case types.OUTSTANDING_BALANCE_PROCESS:
            return { 
                ...state, 
                process: { 
                    ...state.preProcess, 
                    isLoading: true, 
                    isNotFound: false, 
                    isError: false 
                }
            }
        case types.OUTSTANDING_BALANCE_PROCESS_SUCCESS:
            return { 
                ...state, 
                process: { 
                    ...state.preProcess, 
                    header: action.payload.header, 
                    listItems: action.payload.listItems, 
                    isLoading: false, 
                    isNotFound: false,
                    isError: false 
                }
            }
        case types.OUTSTANDING_BALANCE_PROCESS_FAIL:
            return { 
                ...state, 
                process: { 
                    ...state.preProcess, 
                    isLoading: false, 
                    isError: true 
                }
            }
        case types.OUTSTANDING_BALANCE_CREATE:
            return { 
                ...state, 
                create: { 
                    ...state.create, 
                    isLoading: true, 
                    isNotFound: false, 
                    isError: false 
                }
            }
        case types.OUTSTANDING_BALANCE_CREATE_SUCCESS:
            return { 
                ...state, 
                create: { 
                    ...state.create, 
                    header: action.payload.header, 
                    listItems: action.payload.listItems, 
                    isLoading: false, 
                    isNotFound: false,
                    isError: false 
                }
            }
        case types.OUTSTANDING_BALANCE_CREATE_FAIL:
            return { 
                ...state, 
                create: { 
                    ...state.create, 
                    isLoading: false, 
                    isError: true 
                }
            }
        case types.OUTSTANDING_BALANCE_CREATE_SET_HEADER:
            return { 
                ...state, 
                create: {
                    ...state.create, 
                    header: action.payload 
                }
            }
        case types.OUTSTANDING_BALANCE_CREATE_SET_CHECKED_ITEMS:
            return { 
                ...state, 
                create: { 
                    ...state.create, 
                    checkedItems: action.payload
                }
            }
        case types.OUTSTANDING_BALANCE_CREATE_SET_INITIAL_STATE:
            return {
                ...state,
                create: {
                    ...state.create,
                    checkedItems: {
                        ...state.create.checkedItems,
                        cash: {
                            checked: false,
                            pay: null
                        },
                        transfer: {
                            checked: false,
                            bankAccountItem: null,
                            pay: null
                        },
                        qrcode: {
                            checked: false,
                            pay: null
                        },
                        cheques: [
                            {
                                checked: false,
                                bankFileItem: null,
                                chequeDate: moment().format('DD/MM/YYYY'),
                                chequeNo: null,
                                bankFileItemEnabled: false,
                                chequeDateDisabled: true,
                                chequeNoEditable: false,
                                pay: null
                            },
                            {
                                checked: false,
                                bankFileItem: null,
                                chequeDate: moment().format('DD/MM/YYYY'),
                                chequeNo: null,
                                bankFileItemEnabled: false,
                                chequeDateDisabled: true,
                                chequeNoEditable: false,
                                pay: null
                            },
                            {
                                checked: false,
                                bankFileItem: null,
                                chequeDate: moment().format('DD/MM/YYYY'),
                                chequeNo: null,
                                bankFileItemEnabled: false,
                                chequeDateDisabled: true,
                                chequeNoEditable: false,
                                pay: null
                            }
                        ]
                    }
                }
            }
        default:
			return state;
    }
}
