import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { ListItem } from '../../../component/elements';
import ListItems from '../presenter/ListItems';

import {
    clearProductList,
    searchProductBySkuAlt,
    searchProductList,
    setError,
    setGoodsCodeCriteria,
    setKeyword,
    setModal,
    setProduct,
} from '../../../action/product';
import { mainDivider } from '../../../constant/lov';
import Navigate from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';
class CTListItems extends Component {
  constructor(props) {
    super(props);
    console.log('this.props.screen ', this.props.screen);
    console.log('this.props.actionType ', this.props.actionType);
    this.props.screen === 'ProductAddTo' && this.props.actionType === 'add_scr'
      ? null
      : this.props.clearProductList();

    this._onRefresh();
  }

  state = {
    hasReachedEnd: false, // เริ่มต้นสถานะว่าไม่ได้ไปถึงจุดสุดท้าย
  };

  _renderProductItem = (item) => {
    return (
      <ListItem
        containerStyle={mainDivider}
        bottomDivider
        onPress={() => {
          this._onItemPress(item);
        }}
      >
        <ListItem.Content>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={{ fontSize: hp('2%'), color: '#000066' }} allowFontScaling={false}>
                {item.ICDEPT_THAIDESC}
              </Text>
              <Text style={{ fontSize: hp('2%'), color: 'blue' }} allowFontScaling={false}>
                {item.GOODS_CODE}
              </Text>
              <Text style={{ fontSize: hp('2%'), color: '#000066', }} allowFontScaling={false}>
                {item.GOODS_NAME ? item.GOODS_NAME : item.SKU_NAME}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>
                ราคา{' '}
                {item.ARPLU_U_PRC.toFixed(2).replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ',',
                )}{' '}
                บาท
              </Text>
              <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>
                บรรจุ {item.UTQ_NAME}{' '}
              </Text>
              <Text style={{ fontSize: hp('2%'), color: 'red', textAlignVertical: 'bottom' }} allowFontScaling={false}>
                คงเหลือ {
                  Math.floor(item.good_inVan_qty / item.UTQ_QTY)
                    .toFixed(0).replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    )}{
                  item.UTQ_QTY == 1 ? '' : '.' +
                    ('0' +
                      Math.abs(item.good_inVan_qty) -
                      ((Math.floor(Math.abs(item.good_inVan_qty) / item.UTQ_QTY).toFixed(0)) * item.UTQ_QTY)
                    )
                      .toFixed(0)
                      .padStart(('' + item.UTQ_QTY).length, '0')
                }{' '}{item.UTQ_NAME}{' '}
              </Text>
            </View>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  _renderStockItem = (item) => {
    return (
      <ListItem
        onPress={() => {
          this._onItemPress(item);
        }}
      >
        <ListItem.Content>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>
                {item.ICDEPT_THAIDESC}
              </Text>
              <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>
                {item.SKU_CODE}
              </Text>
              <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>
                {item.SKU_NAME}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column' }}>
            </View>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  _renderSkuAltItem = (item) => {
    return (
      <ListItem
        containerStyle={mainDivider}
        onPress={() => {
          this._onItemPress(item);
        }}
      >
        <ListItem.Content>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>
                {item.ICDEPT_THAIDESC}
              </Text>
              <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>
                {item.SKUALT_CODE}
              </Text>
              <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>
                {item.SKUALT_NAME}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column' }}>
            </View>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  _renderItem = ({ item }) => {
    if (this.props.screen === 'ProductAddTo') {
      if (this.props.actionType === 'add_scr') {
        return this._renderSkuAltItem(item);
      } else {
        return this._renderProductItem(item);
      }
    } else {
      // return (this._renderStockItem(item))
      return this._renderProductItem(item);
    }
  };

  _onItemPress = async (item) => {
    //console.log("_onItemPress item",item);
    if (this.props.screen) {
      if (this.props.screen === 'ProductAddTo') {
        if (this.props.actionType == 'add_scr') {
          await this.props.searchProductBySkuAlt(item.SKUALT_KEY);
          this.props.setModal(false);
        } else {
          this.props.setProduct('add', item);
          this.props.setGoodsCodeCriteria(item.GOODS_CODE);
          this.props.setModal(false);
          this.props.inputQtyRef
            ? setTimeout(() => {
              this.props.inputQtyRef.focus();
            }, 200)
            : null;
        }
      } else if (this.props.screen === 'Stock') {
        this.props.setProduct('add', item);
        Navigate.navigate('StockDropPointDetail');
      }
    }
  };

  _onRefresh = async () => {
    try {
    console.log('_onRefresh screen=', this.props.screen, 'actionType=', this.props.actionType);
    this.props.productCategory.item = {};

    this.props.screen === 'ProductAddTo' && this.props.actionType === 'add_scr' ? null : this.props.clearProductList();
    console.log('ตรวจสอบตรงนี้ >> 1');
    await this.props.setKeyword(
      this.state.textSearch ? this.state.textSearch.trim() : null,
    );
    console.log('_onRefresh: calling searchProductList...');
    await this.props.searchProductList(this.props.screen, false);
    console.log('_onRefresh: searchProductList completed');
    } catch (err) {
      console.log('_onRefresh ERROR:', err && err.message ? err.message : err);
    }
  };



  _onScroll = async (event) => {

    const { layoutMeasurement, contentSize, contentOffset } = event.nativeEvent;


    console.log('_onScroll', layoutMeasurement);
    console.log('_onScroll', layoutMeasurement.height);
    console.log('_onScroll', this.props.screen);


    const { VANCONFIG } = await getUserToken();
    if (VANCONFIG.VANCNF_SKU_LIMIT === 1 || VANCONFIG.VANCNF_SKU_LIMIT === 2) {
      const frameHeight = layoutMeasurement.height;
      const contentHeight = contentSize.height;
      const maxOffset = 0.95 * parseInt(contentHeight - frameHeight);
      const currentOffset = parseInt(contentOffset.y);
      console.log('ตรวจสอบตรงนี้ >> 2');
      currentOffset >= maxOffset && !this.props.product.isLoading
        ? this.props.searchProductList(this.props.screen, true)
        : null;
    }
  };



  // _onScroll = async (event) => {

  //   const { layoutMeasurement, contentSize,contentOffset } = event.nativeEvent;


  //      console.log('_onScroll'  , layoutMeasurement);
  //      console.log('_onScroll' ,  layoutMeasurement.height );
  //      console.log('_onScroll' ,  this.props.screen );


  //      const {VANCONFIG} = await getUserToken();
  //   if (VANCONFIG.VANCNF_SKU_LIMIT != 4) {
  //     const frameHeight = layoutMeasurement.height;
  //     const contentHeight = contentSize.height;
  //     const currentOffset = contentOffset.y;
  //     const isCloseToBottom = currentOffset >= (contentHeight - frameHeight - 10); // ปรับความแม่นยำตรงนี้

  //     if (isCloseToBottom && !this.props.product.isLoading) {
  //        // ตรวจสอบว่าไม่ใช่การโหลดซ้ำที่จุดสุดท้าย
  //        if (!this.props.product.hasReachedEnd) {
  //         this.props.searchProductList(this.props.screen, true);
  //     }
  //     }
  //   }
  // };






  // _onScroll = async (event) => {
  //   console.log('_onScroll');
  //   console.log('_onScroll' ,  event.nativeEvent.layoutMeasurement.height );
  //   console.log('_onScroll' ,  this.props.screen );


  //   const {VANCONFIG} = await getUserToken();
  //   if (VANCONFIG.VANCNF_SKU_LIMIT != 4) {
  //     const frameHeight = event.nativeEvent.layoutMeasurement.height;
  //     const contentHeight = event.nativeEvent.contentSize.height;
  //     const maxOffset = 0.95 * parseInt(contentHeight - frameHeight);
  //     const currentOffset = parseInt(event.nativeEvent.contentOffset.y);
  //     currentOffset >= maxOffset && !this.props.product.isLoading
  //       ? this.props.searchProductList(this.props.screen, true)
  //       : null;
  //   }
  // };

  _actionHandler = () => {
    this.props.setError(false);
  };

  // ฟังก์ชันที่ใช้ในการอัพเดทสถานะ `hasReachedEnd` 
  updateHasReachedEnd = (isEnd) => {
    this.setState({ hasReachedEnd: isEnd });
  };

  render() {
    console.log('CTListItems render', this.props.product.listItems.length);
    console.log('CTListItems DEBUG: product.isLoading=', this.props.product.isLoading, 'productCategory.isLoading=', this.props.productCategory.isLoading);
    console.log('CTListItems DEBUG: product.isError=', this.props.product.isError, 'product.isNotFound=', this.props.product.isNotFound);
    console.log('CTListItems DEBUG: productCategory.isError=', this.props.productCategory.isError, 'productCategory.listItems=', Array.isArray(this.props.productCategory.listItems) ? this.props.productCategory.listItems.length : 'NOT_ARRAY');
    return (
      <ListItems
        listItems={
          this.props.actionType === 'add_scr'
            ? this.props.product.skuAltListItems
            : this.props.product.listItems
        }
        renderItem={this._renderItem}
        isNotFound={
          this.props.product.isNotFound &&
          this.props.product.listItems.length == 0
        }
        isError={
          (this.props.product.isError && this.props.product.listItems.length == 0) ||
          this.props.productCategory.isError
        }
        isSnackBarVisible={
          this.props.product.isError && this.props.product.listItems.length > 0
        }
        refreshing={
          this.props.product.isLoading || this.props.productCategory.isLoading
        }
        onRefresh={this._onRefresh}
        onScroll={this.props.actionType === 'add_scr' ? null : this._onScroll}
        actionHandler={this._actionHandler}
      // setErrorMessage={this._setState}
      // errorMessage={this.state.errorMessage}
      // isLoading={this.state.isLoading}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  product: state.product,
  productCategory: state.productCategory,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setProduct: (type, item) => {
      dispatch(setProduct(type, item));
    },
    setModal: (bool) => {
      dispatch(setModal(bool));
    },
    clearProductList: () => {
      dispatch(clearProductList());
    },
    searchProductList: (screen, nextPage) => {
      dispatch(searchProductList(screen, nextPage));
    },
    setError: (bool) => {
      dispatch(setError(bool));
    },
    setGoodsCodeCriteria: (value) => {
      dispatch(setGoodsCodeCriteria(value));
    },
    searchProductBySkuAlt: (key) => {
      dispatch(searchProductBySkuAlt(key));
    },
    setKeyword: (value) => {
      dispatch(setKeyword(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);
