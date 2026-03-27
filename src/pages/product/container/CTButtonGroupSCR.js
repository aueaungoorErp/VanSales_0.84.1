import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { Button } from 'react-native-elements'
import Navigator from '../../../services/Navigator'
import ButtonGroupSCR from '../presenter/ButtonGroupSCR'
import { productDetailFormButtonGroup, MainTheme } from '../../../constant/lov'
import { genenrateOrderForProcessToServerSCR, convertProductItemToOrderItemSCR } from '../../../utils/Order'
import { processOrderItemSCR, setDisabledButton } from '../../../action/product'
import { ORDER_TYPE_SALE, ORDER_TYPE_RETURN, ORDER_TYPE_BOOKING, ORDER_TYPE_QUOTATION, ORDER_TYPE_TRANSFER, ORDER_TYPE_PAYMENT } from '../../../constant/orderTypes';

class CTDetailFormSCR extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            successMessage: null,
            errorMessage: null,
            disabledButton: false
        }
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    _setState = (key, value) => {
        this._isMounted && 
        this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    _onPress = (item) => {
        console.log("SADSADADASDASDSAD PRESSSSSSSSSSSSS");
        if (item.methodType === 'function') {
            const { routes, index } = Navigator.getCurrentRoute()
            const { actionType, confirmMethod, cancelMethod } = routes[index].params
            
            if (item.methodName === 'confirm') {
                if (!this.state.isLoading) {
                    this._setState('disabledButton', true)
                    this.props.setDisabledButton(true)
                    confirmMethod ? confirmMethod(this.props.product.scrListItems) : null
                }     
            } else if (item.methodName === 'process') {
                if (!this.state.isLoading) {
                    this._processOrderItem()
                }
            } else if (item.methodName === 'cancel') {
                this._alertDialog()
            }
        } 
    }

    _alertDialog = () => Alert.alert(
        'ประกาศ',
        'คุณแน่ใจว่าจะออกจากหน้าจอนี้',
        [
            {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
            {text: 'ยืนยัน', onPress: () => Navigator.back()}
        ],
        { cancelable: false }
    )

    _processOrderItem = async () => {
        try {
            this._setState('isLoading', true)
            this._setState('successMessage', null)
            this._setState('errorMessage', null)
            if (this._validateItem()) {
                const response = await this.props.processOrderItemSCR(
                    genenrateOrderForProcessToServerSCR(
                        this.props.order, 
                        convertProductItemToOrderItemSCR(
                            this.props.product.scrChooseItems.filter(value => value != null),
                            this.props.order.header.AR_ORDER_TYPE === ORDER_TYPE_RETURN ? true : false
                        ), 
                        this.props.order.header.AR_ORDER_TYPE === ORDER_TYPE_RETURN ? true : false,
                        this.props.order.header.AR_ORDER_TYPE === ORDER_TYPE_RETURN ? 1 : 0 
                    )
                )

                const { RESULT_DATA, STATUS, ERROR_MESSAGES } = response

                if (STATUS === "00") {
                    this.props.setDisabledButton(false)
                    this._setState('successMessage', 'คำนวณเรียบร้อย')
                } else if (STATUS === "10" && ERROR_MESSAGES[0]) {
                    this._setState('errorMessage', ERROR_MESSAGES[0])
                }
            }
        } catch (error) {
            this._setState('errorMessage', error)
        }
        this._setState('isLoading', false)
    }

    _validateItem = () => {
        let validate = true
        const arrValidate = this.props.product.scrChooseItems.filter(value => value != null)
        
        if (arrValidate.length == 0) {

            this._setState('errorMessage', 'ยังไม่ได้ทำการเลือกสินค้า')
            validate =  false
        }

        arrValidate.map((item, index) => {
            const { GOODS_CODE, GOODS_QTY, GOODS_FREE, GOODS_DISCOUNT } = item

            if ((parseInt(GOODS_QTY) <= 0) && (parseInt(GOODS_DISCOUNT) > 0)) {
                this._setState('errorMessage', 'ไม่สามารถใส่ส่วนลดได้เนื่องจากจำนวนสินค้าเป็น 0')
                validate = false
            }

            if ((parseInt(GOODS_QTY) <= 0) && (parseInt(GOODS_FREE) <= 0)) {
                this._setState('errorMessage', 'พบรายการที่ทั้งจำนวนขายและจำนวนแถม 0')
                validate = false
            }

            if (parseInt(good_inVan_qty) - parseInt(GOODS_QTY) < 0 ) {
                this._setErrorMessage('สินค้าในรถมีไม่พอขาย จำนวนคงเหลือ : ' + good_inVan_qty);
                return false;
            }
            
        })
        
        return validate
    }


    _renderItem = (item, key) => {
        return (
            <Button
                key={key}
                buttonStyle={item.buttonStyle}
                containerStyle={item.containerStyle}
                titleStyle={item.titleStyle}
                title={item.title}
                disabledStyle={{backgroundColor: MainTheme.colorNonary}}
                disabled={item.methodName === 'confirm' ? this.props.product.disabledButton : this.state.disabledButton}
                onPress={() => {this._onPress(item)}} />
        )
    }

    render() {
        return (
            <ButtonGroupSCR  
                renderItem={this._renderItem}
                listItems={productDetailFormButtonGroup}
                successMessage={this.state.successMessage} 
                errorMessage={this.state.errorMessage} 
                isLoading={this.state.isLoading} />
        )
        
    }
}

const mapStateToProps = (state) => ({
    order: state.order, 
    product: state.product
})

const mapDispatchToProps = (dispatch) => {
    return {
        processOrderItemSCR: (data) => dispatch(processOrderItemSCR(data)),
        setDisabledButton: (bool) => dispatch(setDisabledButton(bool))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTDetailFormSCR)
