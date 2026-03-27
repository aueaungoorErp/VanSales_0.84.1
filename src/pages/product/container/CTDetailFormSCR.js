import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text} from 'react-native';
import {ListItem} from 'react-native-elements';
import DetailFormSCR from '../presenter/DetailFormSCR';
import {MainTheme} from '../../../constant/lov';
import {discountFormat, numberOnly} from '../../../utils/Culculate';
import {
  setInitialState,
  addOrEditSCRChooseItems,
  setDisabledButton,
  searchProductBySkuAlt,
  setProductListItems,
} from '../../../action/product';
import IPatternSCRListItem from '../../../component/list-item/IPatternSCRListItem';
import {convertOrderItemsToProductItems} from '../../../utils/Order';

class CTDetailFormSCR extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      errorMessage: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.setInitialState();

    if (this.props.actionType === 'edit_scr') {
      if (
        this.props.order.header.VDI_USER_REF == null ||
        this.props.order.header.VDI_USER_REF == ''
      ) {
        this._searchProductBySkuAlt();
      } else {
        this._convertOrderItemsToProductItems();
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _setItemQty = async (item, index, value) => {
    const {scrChooseItems} = this.props.product;

    item = {
      ...item,
      GOODS_QTY: numberOnly(value),
      GOODS_FREE:
        scrChooseItems[index] != null &&
        scrChooseItems[index].GOODS_FREE !== undefined &&
        scrChooseItems[index].GOODS_FREE !== null
          ? scrChooseItems[index].GOODS_FREE
          : '0',
      GOODS_DISCOUNT:
        scrChooseItems[index] !== null &&
        scrChooseItems[index].GOODS_DISCOUNT !== undefined &&
        scrChooseItems[index].GOODS_DISCOUNT !== null
          ? scrChooseItems[index].GOODS_DISCOUNT
          : '0',
    };

    scrChooseItems[index] = item;
    await this.props.addOrEditSCRChooseItems(scrChooseItems);
    await this.props.setDisabledButton(true);
    await this._checlNUllAndDeletescrChooseItems(scrChooseItems, index);
  };

  _setItemFree = async (item, index, value) => {
    const {scrChooseItems} = this.props.product;

    item = {
      ...item,
      GOODS_FREE: numberOnly(value),
      GOODS_QTY:
        scrChooseItems[index] !== null &&
        scrChooseItems[index].GOODS_QTY !== undefined &&
        scrChooseItems[index].GOODS_QTY !== null
          ? scrChooseItems[index].GOODS_QTY
          : '0',
      GOODS_DISCOUNT:
        scrChooseItems[index] !== null &&
        scrChooseItems[index].GOODS_DISCOUNT !== undefined &&
        scrChooseItems[index].GOODS_DISCOUNT !== null
          ? scrChooseItems[index].GOODS_DISCOUNT
          : '0',
    };

    scrChooseItems[index] = item;

    await this.props.addOrEditSCRChooseItems(scrChooseItems);
    await this.props.setDisabledButton(true);
    await this._checlNUllAndDeletescrChooseItems(scrChooseItems, index);
  };

  _setItemDiscount = async (item, index, value) => {
    const {scrChooseItems} = this.props.product;

    item = {
      ...item,
      GOODS_DISCOUNT: discountFormat(value),
      GOODS_QTY:
        scrChooseItems[index] !== null &&
        scrChooseItems[index].GOODS_QTY !== undefined &&
        scrChooseItems[index].GOODS_QTY !== null
          ? scrChooseItems[index].GOODS_QTY
          : '0',
      GOODS_FREE:
        scrChooseItems[index] !== null &&
        scrChooseItems[index].GOODS_FREE !== undefined &&
        scrChooseItems[index].GOODS_FREE !== null
          ? scrChooseItems[index].GOODS_FREE
          : '0',
    };

    scrChooseItems[index] = item;

    await this.props.addOrEditSCRChooseItems(scrChooseItems);
    await this.props.setDisabledButton(true);
    await this._checlNUllAndDeletescrChooseItems(scrChooseItems, index);
  };

  _checlNUllAndDeletescrChooseItems = (scrChooseItems, index) => {
    if (
      (scrChooseItems[index].GOODS_QTY === null ||
        scrChooseItems[index].GOODS_QTY === '' ||
        scrChooseItems[index].GOODS_QTY === '0') &&
      (scrChooseItems[index].GOODS_FREE === null ||
        scrChooseItems[index].GOODS_FREE === '' ||
        scrChooseItems[index].GOODS_FREE === '0') &&
      (scrChooseItems[index].GOODS_DISCOUNT === null ||
        scrChooseItems[index].GOODS_DISCOUNT === '' ||
        scrChooseItems[index].GOODS_DISCOUNT === '0')
    ) {
      scrChooseItems[index] = null;
      this.props.addOrEditSCRChooseItems(scrChooseItems);
    }
  };

  _setAllSCRChooseItems = () => {
    this.props.order.productListItems.map((orderProductItem, index) => {
      this.props.product.listItems.map((productItem, index) => {
        if (orderProductItem.VTRD_CODE === productItem.GOODS_CODE) {
          this._setSCRChooseItems(productItem, orderProductItem, index);
        }
      });
    });
  };

  _setSCRChooseItems = (productItem, orderProductItem, index) => {
    const {scrChooseItems} = this.props.product;
    console.log('_setSCRChooseItems');
    productItem = {
      ...productItem,
      GOODS_FREE:
        orderProductItem.VTRD_Q_FREE !== null
          ? orderProductItem.VTRD_Q_FREE.toString()
          : null,
      GOODS_QTY:
        orderProductItem.VTRD_QTY !== null
          ? orderProductItem.VTRD_QTY.toString()
          : null,
      GOODS_DISCOUNT:
        orderProductItem.VTRD_U_DISC_TEXT !== null
          ? orderProductItem.VTRD_U_DISC_TEXT.toString()
          : null,
    };

    scrChooseItems[index] = productItem;
    this.props.addOrEditSCRChooseItems(scrChooseItems);
  };

  _searchProductBySkuAlt = async () => {
    try {
      this._setState('isLoading', true);
      this._setState('errorMessage', null);

      const response = await this.props.searchProductBySkuAlt(
        this.props.order.productListItems[0].SKU_ALT,
      );

      const {RESULT_DATA, STATUS, ERROR_MESSAGES} = response;

      if (STATUS === '00') {
        this._setAllSCRChooseItems();
      } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
        this._setErrorMessage(ERROR_MESSAGES[0]);
      }
    } catch (error) {
      this._setState('errorMessage', error);
    }

    this._setState('isLoading', false);
  };

  _convertOrderItemsToProductItems = async () => {
    console.log("_convertOrderItemsToProductItems");
    await this.props.setProductListItems(
      convertOrderItemsToProductItems(this.props.order.productListItems),
    );
    this._setAllSCRChooseItems();
  };

  _setState = (key, value) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          [key]: value,
        };
      });
  };

  _header = () => (
    <ListItem
      title={
        <View style={{flexDirection: 'row'}}>
          {/* <Text>รายละเอียดสินค้า</Text> */}
          <Text
            style={{
              width: 150,
              marginLeft: 5,
              color: MainTheme.colorSecondary,
            }}>
            สินค้า
          </Text>
          <Text
            style={{
              width: 100,
              marginRight: 5,
              color: MainTheme.colorSecondary,
              textAlign: 'right',
            }}>
            บรรจุ
          </Text>
          <Text
            style={{
              width: 100,
              marginRight: 5,
              color: MainTheme.colorSecondary,
              textAlign: 'right',
            }}>
            ราคา
          </Text>
          <Text
            style={{width: 50, marginLeft: 5, color: MainTheme.colorSecondary}}>
            จำนวน
          </Text>
          <Text
            style={{width: 50, marginLeft: 5, color: MainTheme.colorSecondary}}>
            แถม
          </Text>
          <Text
            style={{width: 50, marginLeft: 5, color: MainTheme.colorSecondary}}>
            ส่วนลด
          </Text>
          <Text
            style={{width: 80, marginLeft: 5, color: MainTheme.colorSecondary}}>
            อ้างอิง
          </Text>
        </View>
      }
      containerStyle={{backgroundColor: MainTheme.colorPrimary}}
      titleNumberOfLines={1}
      hideChevron
    />
  );

  _renderItem = ({item, index}) => {
    return (
      <IPatternSCRListItem
        item={item}
        index={index}
        scrChooseItem={this.props.product.scrChooseItems[index]}
        setItemQty={this._setItemQty}
        setItemFree={this._setItemFree}
        setItemDiscount={this._setItemDiscount}
      />
    );
  };

  _onRefresh = () => {
    this.props.actionType === 'edit_scr' ? this._searchProductBySkuAlt() : null;
  };

  render() {
    return (
      <DetailFormSCR
        header={this._header}
        renderItem={this._renderItem}
        listItems={this.props.product.listItems}
        refreshing={this.state.isLoading}
        onRefresh={this._onRefresh}
        errorMessage={this.state.errorMessage}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  product: state.product,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setInitialState: () => dispatch(setInitialState()),
    addOrEditSCRChooseItems: (items) =>
      dispatch(addOrEditSCRChooseItems(items)),
    setDisabledButton: (bool) => dispatch(setDisabledButton(bool)),
    removeSCRPickItem: (index) => dispatch(removeSCRPickItem(index)),
    searchProductBySkuAlt: (key) => dispatch(searchProductBySkuAlt(key)),
    setProductListItems: (items) => dispatch(setProductListItems(items)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTDetailFormSCR);
