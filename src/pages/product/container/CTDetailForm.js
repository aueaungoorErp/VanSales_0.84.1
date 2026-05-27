import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {
  clearItem,
  processOrderItem,
  searchProductByGoodsCode,
  setGoodsCodeCriteria,
  setInitialState,
  setItemDiscount,
  setItemFree,
  setItemLot,
  setItemNetPrice,
  setItemQty,
  setItemSerial,
  setItemTotalDiscount,
  setItemTotalPrice,
} from '../../../action/product';
import { MainTheme, productDetailFormButtonGroup } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import {
  calculateDiscount,
  calculateOrderProductTotalDiscount,
  discountFormat,
  numberOnly,
} from '../../../utils/Culculate';
import { getUserToken } from '../../../utils/Token';
import DetailForm from '../presenter/DetailForm';

class CTDetailForm extends Component {
  _isMounted = false;
  _scanBarcodeEnabled = true;

  _isTransferOrder = () =>
    this.props.order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า';

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      disabledButton: false,
      successMessage: null,
      errorMessage: null,
      submitDisabled: true,
      userToken: null,
    };

    this._getUserToken();

    const { routes, index } = Navigator.getCurrentRoute();
    const { actionType } = routes[index].params;
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isTransferOrder()) {
      this._setSubmitDisabled(false);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _getTransferNegativeBalanceMessage = () => {
    const isTransferOrder = this._isTransferOrder();
    const preventNegativeBalance =
      this.state.userToken?.VANCONFIG?.VANCNF_NOV_SKU_BAL === 1;
    const hasSelectedGoods = !!this.props.product.item?.GOODS_CODE;
    const goodsBalance = Number(this.props.product.item?.good_inVan_qty);

    if (
      isTransferOrder &&
      preventNegativeBalance &&
      hasSelectedGoods &&
      Number.isFinite(goodsBalance) &&
      goodsBalance < 0
    ) {
      return 'ไม่สามารถโอนย้ายสินค้าจำนวนติดลบได้';
    }

    return null;
  };

  _renderItem = (item, key) => {
    const isTransferOrder = this._isTransferOrder();

    const greentStyle = {
      backgroundColor: '#2FBA74',
      borderColor: '#E5E4E2',
      borderRadius: 0,
      borderWidth: 0.3,
      height: 60,
    };
    const hasTransferNegativeBalance =
      !!this._getTransferNegativeBalanceMessage();
    const isBlockedAction =
      hasTransferNegativeBalance && item.methodName === 'confirm';
    const disabled =
      item.methodName === 'confirm'
        ? (isTransferOrder ? false : this.state.submitDisabled) ||
          isBlockedAction
        : this.state.disabledButton;

    return (
      <>
        <TouchableOpacity
          key={key}
          style={[
            item.methodName === 'process' && this.state.submitDisabled == true
              ? greentStyle
              : item.buttonStyle,
            item.containerStyle,
            {
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
            },
            disabled ? { backgroundColor: MainTheme.colorNonary } : null,
          ]}
          onPress={() => {
            this._onPress(item);
          }}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            style={
              item.methodName === 'process' && this.state.submitDisabled == true
                ? { titleStyle: { color: MainTheme.colorSecondary } }
                : item.titleStyle
            }
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      this._isMounted &&
        (await this.setState(oldState => {
          return {
            userToken: userToken,
          };
        }));
    }
  };

  _onPress = item => {
    console.log('item===>', item);
    this._setErrorMessage(null);
    if (item.methodType === 'function') {
      const { routes, index } = Navigator.getCurrentRoute();
      const { actionType, confirmMethod, cancelMethod } = routes[index].params;

      if (item.methodName === 'confirm') {
        if (this._validateItem()) {
          if (!this.state.isLoading) {
            this._setSubmitDisabled(true);
            this._setDisabledButton(true);
            confirmMethod ? confirmMethod(this.props.product.item) : null;
          }
        }
      } else if (item.methodName === 'process') {
        if (!this.state.isLoading) {
          this._processOrderItem();
        }
      } else if (item.methodName === 'cancel') {
        console.log('actionType >> 2 ', actionType);
        if (actionType === 'add') {
          this._setSubmitDisabled(true);
          this.props.setGoodsCodeCriteria(null);
          console.log('clearItem4');

          this.props.clearItem();
        } else if (actionType === 'edit') {
          cancelMethod ? cancelMethod(this.props.product.item) : null;
        }
      }
    } else if (item.methodType === 'new_page') {
    }
  };

  _processOrderItem = async () => {
    try {
      if (this._validateItem()) {
        this._setIsLoading(true);
        this._setErrorMessage(null);
        this._setSuccessMessage(null);
        const userToken = await getUserToken();
        console.log('userToken.VANCONFIG ', userToken.VANCONFIG);
        const response = await this.props.processOrderItem(userToken.VANCONFIG);
        const { ResponseData, ResponseCode, ReasonString } = response;

        if (ResponseCode == 200) {
          console.log(ReasonString);
          this._setSubmitDisabled(false);
          await this._setSuccessMessage('คำนวณเรียบร้อย');
          this.props.setGoodsCodeCriteria(this.props.product.item.GOODS_CODE);
        } else {
          this._setErrorMessage(ReasonString);
        }
      }
    } catch (error) {
      this._setErrorMessage(error);
    }
    this._setIsLoading(false);
  };

  _onSearchByGoodsCode = async () => {
    try {
      if (
        this.props.product.criteria.GOODS_CODE !== null &&
        this.props.product.criteria.GOODS_CODE !== ''
      ) {
        this._setIsLoading(true);
        this._setErrorMessage(null);
        this._setSuccessMessage(null);
        this.props.clearItem();

        await this.props.searchProductByGoodsCode();
        this.textInputQtyRef && this.textInputQtyRef.focus();
      } else {
        this._setErrorMessage('กรุณากรอก รหัสสินค้า');
      }
    } catch (error) {
      this._setErrorMessage(error);
    }
    this._setSubmitDisabled(this._isTransferOrder() ? false : true);
    this._setIsLoading(false);
  };

  _setItemQty = async value => {
    console.log('_setItemQty :', value);
    this._setSubmitDisabled(this._isTransferOrder() ? false : true);
    this.props.product.item.GOODS_TOTAL_PRC = 0;
    await this.props.setItemQty(numberOnly(value));
    // await this.props.setItemDiscountPerUnit(this._calculateDiscountPerUnit().toString())
    // await this.props.setItemTotalDiscount(this._calculateTotalDiscount().toString())
    // await this.props.setItemTotalPrice(this._calculateTotalPrice().toString())
    // await this.props.setItemNetPrice(this._calculateNetPrice().toString())
  };

  _setItemSerial = async value => {
    console.log('_setItemSerial :', value);
    this._setSubmitDisabled(this._isTransferOrder() ? false : true);
    await this.props.setItemSerial(value);
    // await this.props.setItemDiscountPerUnit(this._calculateDiscountPerUnit().toString())
    // await this.props.setItemTotalDiscount(this._calculateTotalDiscount().toString())
    // await this.props.setItemTotalPrice(this._calculateTotalPrice().toString())
    // await this.props.setItemNetPrice(this._calculateNetPrice().toString())
  };
  _setItemLot = async value => {
    console.log('_setItemLot :', value);
    this._setSubmitDisabled(this._isTransferOrder() ? false : true);
    await this.props.setItemLot(value);
    // await this.props.setItemDiscountPerUnit(this._calculateDiscountPerUnit().toString())
    // await this.props.setItemTotalDiscount(this._calculateTotalDiscount().toString())
    // await this.props.setItemTotalPrice(this._calculateTotalPrice().toString())
    // await this.props.setItemNetPrice(this._calculateNetPrice().toString())
  };

  _setItemDiscount = async value => {
    this._setSubmitDisabled(this._isTransferOrder() ? false : true);
    await this.props.setItemDiscount(discountFormat(value));
    // await this.props.setItemDiscountPerUnit(this._calculateDiscountPerUnit().toString())
    // await this.props.setItemTotalDiscount(this._calculateTotalDiscount().toString())
    // await this.props.setItemTotalPrice(this._calculateTotalPrice().toString())
    // await this.props.setItemNetPrice(this._calculateNetPrice().toString())
  };

  _setItemFree = async value => {
    this._setSubmitDisabled(this._isTransferOrder() ? false : true);
    this._isMounted && (await this.props.setItemFree(numberOnly(value)));
  };

  _validateItem = () => {
    const transferNegativeBalanceMessage =
      this._getTransferNegativeBalanceMessage();

    if (transferNegativeBalanceMessage) {
      this._setErrorMessage(transferNegativeBalanceMessage);
      return false;
    }

    const {
      GOODS_CODE,
      GOODS_QTY,
      GOODS_FREE,
      GOODS_DISCOUNT,
      good_inVan_qty,
      UTQ_QTY,
      GOODS_TOTAL_PRC,
      UTQ_NAME,
      ARPLU_U_PRC,
    } = this.props.product.item;
    console.log('this.props.product.item >>> ', this.props.product.item);

    if (GOODS_CODE === null) {
      this._setErrorMessage('กรุณาเลือกสินค้า');
      return false;
    }

    if (GOODS_QTY === null || GOODS_QTY <= 0) {
      this.props.setItemQty('0');
    }

    if (
      GOODS_QTY !== null &&
      GOODS_QTY !== '' &&
      parseInt(GOODS_QTY) <= 0 &&
      GOODS_DISCOUNT !== null &&
      GOODS_DISCOUNT !== '' &&
      parseInt(GOODS_DISCOUNT) > 0
    ) {
      this._setErrorMessage('ไม่สามารถใส่ส่วนลดได้เนื่องจากจำนวนสินค้าเป็น 0');
      return false;
    }

    if (
      GOODS_QTY !== null &&
      GOODS_QTY !== '' &&
      parseInt(GOODS_QTY) >= 0 &&
      GOODS_DISCOUNT !== null &&
      GOODS_DISCOUNT !== '' &&
      parseInt(GOODS_DISCOUNT) > 0 &&
      GOODS_DISCOUNT * GOODS_QTY >= ARPLU_U_PRC * GOODS_QTY
    ) {
      this._setErrorMessage('ไม่สามารถใส่ส่วนลดได้ ส่วนลดมากกว่าราคาขาย');
      return false;
    }

    if (
      (GOODS_QTY === null || GOODS_QTY === '' || parseInt(GOODS_QTY) <= 0) &&
      (GOODS_FREE === null || GOODS_FREE === '' || parseInt(GOODS_FREE) <= 0)
    ) {
      this._setErrorMessage('พบรายการที่ทั้งจำนวนขายและจำนวนแถม 0');
      return false;
    }

    var itemremain = 0;
    var itemdigit = 0;
    var convert_GOODS_QTY_remain = 0;
    itemremain = Math.floor(good_inVan_qty / UTQ_QTY);
    //itemremain = Math.floor(good_inVan_qty - (this.props.product.item.GOODS_QTY * UTQ_QTY));

    itemdigit = (
      Math.abs(good_inVan_qty).toFixed(0) -
      Math.floor(Math.abs(good_inVan_qty) / UTQ_QTY).toFixed(0) * UTQ_QTY
    ).toFixed(0);
    itemdigit =
      UTQ_QTY == '1'
        ? ''
        : '.' + itemdigit.padStart(('' + UTQ_QTY).length, '0');

    console.log('itemremain >> ', itemremain);
    console.log(
      'this.props.product.item.GOODS_QTY >> ',
      this.props.product.item.GOODS_QTY,
    );
    console.log('GOODS_QTY >> ', GOODS_QTY);

    if (
      GOODS_TOTAL_PRC === null ||
      GOODS_TOTAL_PRC === '' ||
      parseInt(GOODS_TOTAL_PRC) <= 0
    ) {
      //this.props.product.item.GOODS_QTY = GOODS_QTY * UTQ_QTY;
      convert_GOODS_QTY_remain = Math.floor(GOODS_QTY * UTQ_QTY);
    } else {
      convert_GOODS_QTY_remain = Math.floor(GOODS_QTY);
    }

    console.log(
      'this.props.product.item.GOODS_QTY >> 2',
      this.props.product.item.GOODS_QTY,
    );

    if (this.state.userToken.VANCONFIG.VANCNF_NOV_SKU_BAL === 1)
      if (this.props.order.header.AR_ORDER_TYPE === 'ขายสินค้า') {
        {
          if (
            parseInt(good_inVan_qty) - parseInt(convert_GOODS_QTY_remain) <
            0
          ) {
            this._setErrorMessage(
              'สินค้าในรถมีไม่พอขาย จำนวนคงเหลือ : ' +
                parseFloat(itemremain + itemdigit) +
                ' (' +
                UTQ_NAME +
                ')',
            );
            return false;
          }
        }
      }
    return true;
  };

  _calculateTotalPrice() {
    console.log(
      '_calculateTotalPrice this.props.product.item',
      this.props.product.item,
    );
    const uPrc = this.props.product.item.ARPLU_U_PRC
      ? this.props.product.item.ARPLU_U_PRC
      : 0;
    const qty = this.props.product.item.GOODS_QTY
      ? this.props.product.item.GOODS_QTY
      : 0;
    return Math.round(uPrc * qty * 100) / 100;
  }

  _calculateNetPrice() {
    console.log(
      '_calculateNetPrice this.props.product.item',
      this.props.product.item,
    );
    const totalPrice = this.props.product.item.GOODS_TOTAL_PRC
      ? this.props.product.item.GOODS_TOTAL_PRC
      : 0;
    const totalDiscount = this.props.product.item.GOODS_TOTAL_DISCOUNT
      ? this.props.product.item.GOODS_TOTAL_DISCOUNT
      : 0;
    return Math.round((totalPrice - totalDiscount) * 100) / 100;
  }

  _calculateDiscountPerUnit() {
    console.log(
      '_calculateDiscountPerUnit this.props.product.item',
      this.props.product.item,
    );
    let uPrc = this.props.product.item.ARPLU_U_PRC
      ? this.props.product.item.ARPLU_U_PRC
      : 0;
    const discountInput = this.props.product.item.GOODS_DISCOUNT
      ? this.props.product.item.GOODS_DISCOUNT.split(/[,+]/)
      : '';

    const res = calculateDiscount(uPrc, discountInput);
    return res.result ? res.result : 0;
  }

  _calculateTotalDiscount() {
    console.log(
      '_calculateTotalDiscount this.props.product.item',
      this.props.product.item,
    );
    let uPrc = this.props.product.item.ARPLU_U_PRC
      ? this.props.product.item.ARPLU_U_PRC
      : 0;
    const discountInput = this.props.product.item.GOODS_DISCOUNT
      ? this.props.product.item.GOODS_DISCOUNT.split(/[,+]/)
      : '';
    const qty = this.props.product.item.GOODS_QTY
      ? this.props.product.item.GOODS_QTY
      : 0;

    const res = calculateOrderProductTotalDiscount(uPrc, discountInput, qty);

    return res.result ? res.result : 0;
  }

  _setIsLoading = value => {
    this._isMounted &&
      this.setState(oldState => {
        return {
          isLoading: value,
        };
      });
  };

  _setSuccessMessage = async value => {
    this._isMounted &&
      this.setState(oldState => {
        return {
          successMessage: value,
        };
      });
  };

  _setErrorMessage = value => {
    this._isMounted &&
      this.setState(oldState => {
        return {
          errorMessage: value,
        };
      });
  };

  _setSubmitDisabled = bool => {
    this._isMounted &&
      this.setState(oldState => {
        return {
          submitDisabled: bool,
        };
      });
  };

  _setDisabledButton = value => {
    this._isMounted &&
      this.setState(oldState => {
        return {
          disabledButton: value,
        };
      });
  };

  _setTextInputQtyRef = ref => {
    if (ref) {
      this.textInputQtyRef = ref;

      this.props.getInputQtyRef ? this.props.getInputQtyRef(ref) : null;
    }
    //ref && ref.focus ? ref.focus() : null
  };

  _setGoodsCode = async value => {
    await this.props.setGoodsCodeCriteria(value);
  };

  _onScanBarcodePress = () => {
    this._scanBarcodeEnabled = true;
    Navigator.navigate('Camera', {
      barcodeFinderVisible: true,
      onBarCodeRead: scanResult => {
        console.log('scanResult ', JSON.stringify(scanResult));
        if (this._scanBarcodeEnabled) {
          this._setGoodsCode(scanResult.data);
          this._scanBarcodeEnabled = false;

          setTimeout(() => {
            this._onSearchByGoodsCode();
          }, 500);

          Navigator.back();
        }
      },
    });
  };

  _onSubmitEditing = (discount, DI_AMOUNT) => {
    if (discount) {
      const discountRGEX =
        /^[0-9*]+\.?[0-9*]*[bB%*]?([,+\-\/]?([0-9*]+\.?[0-9*]*[bB%*]?)?)*$/;
      const discountFormat = discountRGEX.test(discount);
      const discountPER =
        /^[0-9*]?([*]?([0-9*]+\.?[0-9*]*[%]?)?)([0-9*]+\.?)*$/;
      const discountPERFormat = discountPER.test(discount);
      if (!discountFormat) {
        return 'error.notValidDiscount';
      }

      if (discountPERFormat) {
        const discountPERCENT = discount.replace('%', '');
        if (Number(discountPERCENT) > 100) {
          return 'error.discountMorethanValue';
        }
      } else {
        // const discountBATH = discount.replace( /[bB]/, '')
        // if(Number(discountBATH) > Number(DI_AMOUNT)){
        //   return 'error.discountMorethanValue'
        // }
      }

      return false;
    }
    return false;
  };

  render() {
    return (
      <DetailForm
        item={this.props.product.item}
        goodsCode={this.props.product.criteria.GOODS_CODE}
        buttonListItems={productDetailFormButtonGroup}
        renderItem={this._renderItem}
        setItemQty={this._setItemQty.bind(this)}
        setItemLot={this._setItemLot.bind(this)}
        setItemSerial={this._setItemSerial.bind(this)}
        setItemDiscount={this._setItemDiscount.bind(this)}
        setItemFree={this._setItemFree.bind(this)}
        errorMessage={this.state.errorMessage}
        isLoading={this.state.isLoading}
        getRef={this._setTextInputQtyRef}
        onSearch={this._onSearchByGoodsCode}
        setGoodsCode={this._setGoodsCode}
        goodsCodeEditable={this.props.goodsCodeEditable}
        orderType={this.props.order.header.AR_ORDER_TYPE}
        editableItemFree={
          this.state.userToken &&
          this.state.userToken.VANCONFIG &&
          this.state.userToken.VANCONFIG.VANCNF_ENABLE_QFREE &&
          this.state.userToken.VANCONFIG.VANCNF_ENABLE_QFREE == 2
            ? true
            : false
        }
        editableItemDiscount={
          this.state.userToken &&
          this.state.userToken.VANCONFIG &&
          this.state.userToken.VANCONFIG.VANCNF_ENABLE_UDSC &&
          this.state.userToken.VANCONFIG.VANCNF_ENABLE_UDSC == 2
            ? true
            : false
        }
        onScanBarcodePress={this._onScanBarcodePress}
        onSubmitEditing={this._onSubmitEditing}
      />
    );
  }
}

const mapStateToProps = state => ({
  order: state.order,
  product: state.product,
});

const mapDispatchToProps = dispatch => {
  return {
    setInitialState: () => {
      dispatch(setInitialState());
    },
    clearItem: () => {
      dispatch(clearItem());
    },
    setItemQty: value => dispatch(setItemQty(value)),
    setItemLot: value => dispatch(setItemLot(value)),
    setItemSerial: value => dispatch(setItemSerial(value)),
    setItemTotalPrice: value => dispatch(setItemTotalPrice(value)),
    setItemNetPrice: value => dispatch(setItemNetPrice(value)),
    setItemDiscount: value => dispatch(setItemDiscount(value)),
    setItemTotalDiscount: value => dispatch(setItemTotalDiscount(value)),
    setItemFree: value => dispatch(setItemFree(value)),
    processOrderItem: VANCONFIG => dispatch(processOrderItem(VANCONFIG)),
    setGoodsCodeCriteria: value => dispatch(setGoodsCodeCriteria(value)),
    searchProductByGoodsCode: () => dispatch(searchProductByGoodsCode()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTDetailForm);
