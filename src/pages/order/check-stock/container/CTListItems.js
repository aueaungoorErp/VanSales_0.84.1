import React, { Component } from 'react';
import { Alert, Dimensions, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { Icon, ListItem } from '../../../../component/elements';
import Navigator from '../../../../services/Navigator';

import {
    calculateOrderProductSummary,
    editProduct,
    getProductListItemsFromLastBillByArCode,
    removeProductItem,
    setOrderItems,
} from '../../../../action/order';
import { setGoodsCodeCriteria, setProduct } from '../../../../action/product';
import { mainDivider, MainTheme, MOBILE5INCH } from '../../../../constant/lov';
import { numberOnlyCanZeroFirst } from '../../../../utils/Culculate';
import {
    convertOrderItemToProductItem,
    convertProductItemToOrderItem,
} from '../../../../utils/Order';
import { getLoginGuID, getUserToken } from '../../../../utils/Token';
import ListItems from '../../presenter/ListItems';


class CTListItems extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      errorMessage: null,
    };

    this._getUserToken();

    this._autoPullOrderLastBill();
  }

  componentDidMount = (props) => {
    this._isMounted = true;
    // this._getProductListItemsFromLastBillByArCode();
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
  };


  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      this._isMounted &&
        (await this.setState((oldState) => {
          return {
            userToken: userToken,
          };
        }));
    }
  };

  _autoPullOrderLastBill = async () => {
    const { routes, index } = Navigator.getCurrentRoute();
    const { disabledAutoLoad } = routes[index].params;
    console.log('_autoPullOrderLastBill');
    const userToken = await getUserToken();
    if (
      !disabledAutoLoad === true &&
      userToken.VANCONFIG.VANCNF_AS_PREVIOUS == 2 &&
      userToken.VANCONFIG.VANCNF_KEYIN_SCR == 1 &&
      this.props.order.header.AR_ORDER_TYPE === 'ขายสินค้า' &&
      this.props.order.header.VDI_USER_REF === null
    ) {
      this._getProductListItemsFromLastBillByArCode();
    }
  };

  // _getProductListItemsFromLastBillByArCode = async () => {
  //       console.log("_getProductListItemsFromLastBillByArCode");
  //     try {
  //       this._setState('isLoading', true);
  //       this._setState('errorMessage', null);
  //       //await this.props.getProductListItemsFromLastBillByArCode();

  //       const {productListItems} = this.props.order;
  //       const cloneObj = JSON.parse(JSON.stringify(productListItems));

  //       cloneObj.map((item, index) => {
  //         item.VTRD_QTY = item.VTRD_QTY + item.VTRD_Q_FREE;
  //         item.DIFFERENCE = item.VTRD_QTY;
  //         return item;
  //       });

  //       await this.props.setOrderItems([...cloneObj]);
  //     } catch (error) {
  //       this._setState('errorMessage', error);
  //     }
  //     this._setState('isLoading', false);
  //   };

  _getProductListItemsFromLastBillByArCode = async () => {
    // try {
    const v3GUID = await getLoginGuID();
    const userToken = await getUserToken();
    //console.log('_getProductListItemsFromLastBillByArCode v3GUID ', v3GUID);
    await this.props.getProductListItemsFromLastBillByArCode(
      v3GUID,
      userToken.VANCONFIG.VANCNF_MACHINE,
    );
    // } catch (error) {
    //   console.log("Lastbills",error);
    // }
  };




  _editProductItem = (item, index) => {
    console.log('convertProductItemToOrderItem 1 >>', item);
    item.GOODS_TOTAL_DISCOUNT = item.VTRD_U_DSC
    this.props.setProduct('edit', convertOrderItemToProductItem(item));
    this.props.setGoodsCodeCriteria(item.VTRD_CODE);

    Navigator.navigate('ProductEditTo', {
      actionType: 'edit',
      confirmMethod: async (item) => {
        await this.props.editProduct(
          convertProductItemToOrderItem(item),
          index,
        );
        await this.props.calculateOrderProductSummary();
        Navigator.back();
      },
      cancelMethod: () => {
        Navigator.back();
      },
    });
  };

  // _header = () => {
  //   return (
  //     <ListItem
  //       title={
  //         <View style={{flexDirection: 'row'}}>
  //           <Text
  //             style={{width: 150, fontSize: hp('1.7%')}}
  //             allowFontScaling={false}>
  //             สินค้า
  //           </Text>
  //           <Text
  //             style={{
  //               width: 100,
  //               marginLeft: 5,
  //               textAlign: 'right',
  //               fontSize: hp('1.7%'),
  //             }}
  //             allowFontScaling={false}>
  //             บรรจุ
  //           </Text>
  //           <Text
  //             style={{
  //               width: 100,
  //               marginLeft: 5,
  //               textAlign: 'right',
  //               fontSize: hp('1.7%'),
  //             }}
  //             allowFontScaling={false}>
  //             จำนวนขาย
  //           </Text>
  //           <Text
  //             style={{
  //               width: 100,
  //               marginLeft: 5,
  //               textAlign: 'right',
  //               fontSize: hp('1.7%'),
  //             }}
  //             allowFontScaling={false}>
  //             คงเหลือ
  //           </Text>
  //           <Text
  //             style={{
  //               width: 100,
  //               marginLeft: 5,
  //               textAlign: 'right',
  //               fontSize: hp('1.7%'),
  //             }}
  //             allowFontScaling={false}>
  //             ผลต่าง
  //           </Text>
  //           <Text
  //             style={{
  //               width: 100,
  //               marginLeft: 5,
  //               textAlign: 'right',
  //               fontSize: hp('1.7%'),
  //             }}
  //             allowFontScaling={false}>
  //             อ้างอิง
  //           </Text>
  //           <Text
  //             style={{width: 100, marginLeft: 5, fontSize: hp('1.7%')}}
  //             allowFontScaling={false}>
  //             #
  //           </Text>
  //         </View>
  //       }
  //       containerStyle={{backgroundColor: MainTheme.colorPrimary}}
  //       titleNumberOfLines={1}
  //     />
  //   );
  // };

  _renderItem5INCH = ({ item, index }) => {
    // console.log('_renderItem5INCH item ', item);
    console.log('<_renderItem5INCH 1 >>> ', item);
    console.log('<ListItem index >>> ', index);

    console.log('<ListItem 1.1 >>> 1 ', this.props.order.header.AR_ORDER_TYPE);

    return (
      <ListItem
        title={
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 0.5 }}>
                {/* <Text> {item.ICDEPT_THAIDESC} </Text> */}
                <Text>{item.VTRD_CODE}</Text>
                <Text>{item.VTRD_NAMES}</Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  borderLeftWidth: 1,
                  borderColor: MainTheme.colorNonary,
                  paddingHorizontal: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>จำนวน</Text>
                  <Text>
                    {parseFloat(item.VTRD_QTY || 0 / item.VTRD_UTQ_QTY || 1)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </Text>
                </View>
                {this.props.order.header.AR_ORDER_TYPE !== 'โอนย้ายสินค้า' ? (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>ราคาต่อหน่วย</Text>
                      <Text>
                        {parseFloat(item.VTRD_U_PRC_KEYIN)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>แถม</Text>
                      <Text>
                        {parseFloat(item.VTRD_Q_FREE)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text>ส่วนลด</Text>
                      <Text>
                        {item.VTRD_TDSC_V
                          ? parseFloat(item.VTRD_TDSC_V).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : parseFloat(item.GOODS_TOTAL_DISCOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>ราคารวม</Text>
                      <Text>
                        {item.GOODS_NET_PRC
                          ? parseFloat(item.GOODS_NET_PRC)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : parseFloat(item.GOODS_TOTAL_PRC)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </Text>
                    </View>
                  </View>
                ) : null}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <Icon
                    name="edit"
                    color={MainTheme.colorPrimary}
                    size={30}
                    type={'antdesign'}
                    onPress={() => {
                      this._editProductItem(item, index);
                    }}
                  />

                  <Icon
                    name="delete"
                    color={MainTheme.colorPrimary}
                    size={30}
                    type={'antdesign'}
                    onPress={() => {
                      this._removeAlertDialog(index);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        }
        titleNumberOfLines={1}
        leftIcon={{ name: item.icon, type: item.type }}
        hideChevron
        containerStyle={mainDivider}
        bottomDivider
      />
    );
  };

  _renderItem = ({ item, index }) => {
    console.log('<ListItem 1 >>> ', item);
    console.log('<ListItem index >>> ', index);

    console.log('<ListItem 1.1 >>> 2', this.props.order.header.AR_ORDER_TYPE);

    return (
      <ListItem
        title={
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 0.4 }}>
                {/* <Text> {item.ICDEPT_THAIDESC} </Text> */}
                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false}>
                  {item.VTRD_CODE}
                </Text>
                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false}>
                  {item.VTRD_NAMES}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  borderLeftWidth: 1,
                  borderColor: MainTheme.colorNonary,
                  paddingHorizontal: 5,
                }}>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false}>
                    จำนวน {'(' + item.VTRD_UTQ_NAME + ')'}
                  </Text>
                  <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false}>
                    {parseFloat(parseFloat(item.VTRD_QTY) / 1) // parseFloat(item.VTRD_UTQ_QTY)) 
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </Text>
                </View>
                {this.props.order.header.AR_ORDER_TYPE !== 'โอนย้ายสินค้า' ? (

                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{ fontSize: hp('1.7%') }}
                        allowFontScaling={false}>
                        ราคาต่อหน่วย
                      </Text>
                      <Text
                        style={{ fontSize: hp('1.7%') }}
                        allowFontScaling={false}>
                        {parseFloat(item.VTRD_U_PRC_KEYIN)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{ fontSize: hp('1.7%') }}
                        allowFontScaling={false}>
                        แถม
                      </Text>
                      <Text
                        style={{ fontSize: hp('1.7%') }}
                        allowFontScaling={false}>
                        {parseFloat(item.VTRD_Q_FREE)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{ fontSize: hp('1.7%') }}
                        allowFontScaling={false}>
                        ส่วนลด
                      </Text>
                      <Text
                        style={{ fontSize: hp('1.7%') }}
                        allowFontScaling={false}>
                        {item.VTRD_TDSC_V
                          ? parseFloat(item.VTRD_TDSC_V)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : parseFloat(item.GOODS_TOTAL_DISCOUNT)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{ fontSize: hp('1.7%') }}
                        allowFontScaling={false}>
                        ราคารวม
                      </Text>
                      <Text
                        style={{ fontSize: hp('1.7%') }}
                        allowFontScaling={false}>
                        {item.VTRD_AF_VALUES
                          ? parseFloat(item.VTRD_AF_VALUES)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : parseFloat(item.GOODS_TOTAL_PRC)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>

              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'column',
                  borderLeftWidth: 1,
                  borderColor: MainTheme.colorNonary,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Icon
                  name="pencil"
                  color={MainTheme.colorPrimary}
                  size={30}
                  type={'font-awesome'}
                  onPress={() => {
                    this._editProductItem(item, index);
                  }}
                />

                <Icon
                  name="trash-o"
                  color={MainTheme.colorPrimary}
                  size={30}
                  type={'font-awesome'}
                  onPress={() => {
                    this._removeAlertDialog(index);
                  }}
                />
              </View>
            </View>
          </View>
        }
        titleNumberOfLines={1}
        leftIcon={{ name: item.icon, type: item.type }}
        hideChevron
        containerStyle={mainDivider}
        bottomDivider
      />
    );
  };

  _removeAlertDialog = (index) =>
    Alert.alert(
      'ประกาศ',
      'คุณต้องการลบข้อมูลสินค้าทั้งหมด?',
      [
        { text: 'ยกเลิก', onPress: () => { }, style: 'cancel' },
        { text: 'ยืนยัน', onPress: () => this._removeProductItem(index) },
      ],
      { cancelable: false },
    );




  _setStockBalance = async (item, index, value) => {

    item.VTRD_QTY = item.VTRD_QTY_OLD;
    console.log('_setStockBalance ');
    const { productListItems } = this.props.order;
    const CAS_QTY = numberOnlyCanZeroFirst(value);
    const difference =
      item.VTRD_QTY - parseInt(CAS_QTY != null && CAS_QTY != '' ? CAS_QTY : 0);

    item = {
      ...item,
      CAS_QTY: CAS_QTY,
      DIFFERENCE: difference.toString(),
    };

    productListItems[index] = item;
    await this.props.setOrderItems(productListItems);
  };





  _setState = (key, value) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          [key]: value,
        };
      });
  };

  _removeProductItem = (index) => {
    this.props.removeProductItem(index);
  };

  // _onRefresh = () => {
  //   this._getProductListItemsFromLastBillByArCode();
  // };

  _onRefresh = () => { };



  render() {
    console.log('Dimensions.get(wi{this.props.order.productListItems', this.props.order.productListItems);
    return (
      <ListItems
        listItems={this.props.order.productListItems}
        renderItem={
          Dimensions.get('window').width > MOBILE5INCH
            ? this._renderItem
            : this._renderItem5INCH
        }
        refreshing={this.props.order.isLoading}
        errorMessage={this.props.order.errorMessage}
        onRefresh={this._onRefresh}
      />
    );
  }
}




const mapStateToProps = (state) => ({
  customer: state.customer,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getProductListItemsFromLastBillByArCode: () =>
      dispatch(getProductListItemsFromLastBillByArCode()),
    setOrderItems: (items) => dispatch(setOrderItems(items)),
    removeProductItem: (index) => {
      dispatch(removeProductItem(index));

    },
    removeAllSwipeList: () => {
      dispatch(removeAllSwipeList());
    },
    calculateOrderProductSummary: () => {
      dispatch(calculateOrderProductSummary());
    },
    editProduct: (item, index) => {
      dispatch(editProduct(item, index));
    },
    setProduct: (type, item) => {
      dispatch(setProduct(type, item));
    },
    setGoodsCodeCriteria: (value) => {
      dispatch(setGoodsCodeCriteria(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);
