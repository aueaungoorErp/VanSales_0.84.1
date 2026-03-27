import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Form from '../presenter/Form'
import { setCreateInitialState, setCreateCheckedItems } from '../../../../../action/outstanding-balance'
import { customCheckChar } from '../../../../../utils/FormatUtil'
import { getUserToken } from '../../../../../utils/Token'

class CTForm extends React.Component { 
    _isMounted = false

    constructor(props) {
        super(props)
        this.state = {
            userToken: {
                VANCONFIG: {
                    VANCNF_BANK_QRCODE_USE: null,
                    VANCNF_BANK_TRANSFER_USE: null,
                    VANCNF_ENABLE_CASH: null,
                    VANCNF_CHEQUE: null
                }
            }
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        this.props.setCreateInitialState()
        this._getUserToken()
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    _getUserToken = async () => {
        const userToken = await getUserToken()

        if (userToken) {
            await this._setState('userToken', userToken)
        } 
    }

    _setState = (key, value) => {
        this._isMounted && 
        this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    _setCreateCheckedItems = async (keyParent, keyChildren, value) => {
        let { checkedItems } = this.props.outstandingBalance.create
        let { VPH_PAY_AMT } = this.props.outstandingBalance.process.header

        if (keyChildren === 'checked') {
            let booleanItems = [ false, false, false ]
            let payItems = [ null, null, null ]

            if (keyParent === 'cash') {
                booleanItems[0] = true
                booleanItems[1] = false
                booleanItems[2] = false
                payItems[0] = VPH_PAY_AMT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                payItems[1] = null
                payItems[2] = null

            } else if (keyParent === 'transfer') {
                booleanItems[0] = false
                booleanItems[1] = true
                booleanItems[2] = false
                payItems[0] = null
                payItems[1] = VPH_PAY_AMT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                payItems[2] = null
            } else if (keyParent === 'qrcode') {
                booleanItems[0] = false
                booleanItems[1] = false
                booleanItems[2] = true
                payItems[0] = null
                payItems[1] = null
                payItems[2] = VPH_PAY_AMT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }

            checkedItems.cash.checked = booleanItems[0]
            checkedItems.transfer.checked = booleanItems[1]
            checkedItems.qrcode.checked = booleanItems[2]

            checkedItems.cash.pay = payItems[0]
            checkedItems.transfer.pay = payItems[1]
            checkedItems.qrcode.pay = payItems[2]

            checkedItems.cheques[0].checked = false
            checkedItems.cheques[1].checked = false
            checkedItems.cheques[2].checked = false

            checkedItems.cheques[0].bankFileItem = null
            checkedItems.cheques[1].bankFileItem = null
            checkedItems.cheques[2].bankFileItem = null

            checkedItems.cheques[0].pay = null
            checkedItems.cheques[1].pay = null
            checkedItems.cheques[2].pay = null
            
            checkedItems.cheques[0].chequeDate = moment().format('DD/MM/YYYY')
            checkedItems.cheques[1].chequeNo = moment().format('DD/MM/YYYY')
            checkedItems.cheques[2].chequeNo = moment().format('DD/MM/YYYY')

            checkedItems.cheques[0].pay = null
            checkedItems.cheques[1].pay = null
            checkedItems.cheques[2].pay = null

        } else {
            if (keyChildren === 'pay') value = customCheckChar('0123456789.', value)

            checkedItems = {
                ...checkedItems,
                [keyParent]: {
                    ...checkedItems[keyParent],
                    [keyChildren]: value
                }
            }
        }

        await this.props.setCreateCheckedItems(checkedItems)
    }

    _setCreateCheckedItemsCheque = async (index, key, value) => {
        let { checkedItems } = this.props.outstandingBalance.create
        let { cheques } = checkedItems
        
        console.log('key', key, value)
        
        if (key === 'chequeNo') {
            value = customCheckChar('0123456789', value)
            
        } else if (key === 'pay') {
            value = customCheckChar('0123456789.', value)
        } else if (key === 'checked') {

            checkedItems.cash.checked = false
            checkedItems.transfer.checked = false
            checkedItems.qrcode.checked = false
            
            checkedItems.cash.pay = null
            checkedItems.transfer.pay = null
            checkedItems.qrcode.pay = null

            if (value) {
                checkedItems.transfer.bankAccountItem = null
                let payItems = [ 0, 0, 0 ]
                const VPH_PAY_AMT = parseFloat(this.props.outstandingBalance.process.header.VPH_PAY_AMT)

                payItems[0] = parseFloat(checkedItems.cheques[0].pay ? checkedItems.cheques[0].pay  : 0)
                payItems[1] = parseFloat(checkedItems.cheques[1].pay ? checkedItems.cheques[1].pay  : 0)
                payItems[2] = parseFloat(checkedItems.cheques[2].pay ? checkedItems.cheques[2].pay  : 0)

                if (index === 0) {
                    const pay = (VPH_PAY_AMT - payItems[1] - payItems[2]).toFixed(2)
                    cheques[index].pay =  pay !== '0' ? pay : null
                } else if (index === 1) {
                    const pay = (VPH_PAY_AMT - payItems[0] - payItems[2]).toFixed(2)
                    cheques[index].pay =  pay !== '0' ? pay : null
                } else if (index === 2) {
                    const pay = (VPH_PAY_AMT - payItems[0] - payItems[1]).toFixed(2)
                    cheques[index].pay =  pay !== '0' ? pay : null
                }
            } else {
                checkedItems.cheques[index].checked = false
                checkedItems.cheques[index].bankFileItem = null
                checkedItems.cheques[index].chequeDate = moment().format('DD/MM/YYYY')
                checkedItems.cheques[index].chequeNo = null
                checkedItems.cheques[index].bankFileItemEnabled = null
                checkedItems.cheques[index].chequeDateDisabled = null
                checkedItems.cheques[index].chequeNoEditable = null
                checkedItems.cheques[index].pay = null
            }
        }

        cheques[index] = {
            ...cheques[index],
            [key]: value
        }

        checkedItems = {
            ...checkedItems,
            cheques: cheques
        }
        
        await this.props.setCreateCheckedItems(checkedItems)

    }

    render() {
        return (
            <Form 
                userToken={this.state.userToken}
                outstandingBalance={this.props.outstandingBalance} 
                bankFileListItems={this.props.masterData.bankFileListItems}
                bankAccountListItems={this.props.masterData.bankAccountListItems}
                checkedItems={this.props.outstandingBalance.create.checkedItems}
                setCreateCheckedItems={this._setCreateCheckedItems}
                setCreateCheckedItemsCheque={this._setCreateCheckedItemsCheque} />
        )
    }
}

const mapStateToProps = (state) => ({
    outstandingBalance: state.outstandingBalance,
    masterData: state.masterData
})

const mapDispatchToProps = (dispatch) => {
    return {
        setCreateInitialState: () => dispatch(setCreateInitialState()),
        setCreateCheckedItems: (items) => dispatch(setCreateCheckedItems(items))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTForm)