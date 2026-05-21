import React, { Component } from 'react';
import { Alert, Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import {
  calculateOrderProductSummary,
  editProduct,
  getProductListItemsFromLastBillByArCode,
  pushSwipeList,
  removeAllSwipeList,
  removeProductItem,
  setSwipeCurrent,
} from '../../../action/order';
import { setGoodsCodeCriteria, setProduct } from '../../../action/product';
import { Icon, ListItem } from '../../../component/elements';
import { mainDivider, MainTheme, MOBILE5INCH } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import {
  convertOrderItemToProductItem,
  convertProductItemToOrderItem,
} from '../../../utils/Order';
import {
  LAST_BILL_QUOTATION_WARNING_MESSAGE,
  getLatestSoldQuotationGoodsCodes,
} from '../../../utils/LastBillValidation';
import { getLoginGuID, getUserToken } from '../../../utils/Token';
import ListItems from '../presenter/ListItems';

class CTListItems extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      isLatestItemModalVisible: false,
      latestItemModalMessage: null,
    };

    this._getUserToken();

    this._autoPullOrderLastBill();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

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
    const {routes, index} = Navigator.getCurrentRoute();
    const {disabledAutoLoad} = routes[index].params;
    console.log('_autoPullOrderLastBill');
    const userToken = await getUserToken();
    if (
      !disabledAutoLoad === true &&
      userToken.VANCONFIG.VANCNF_AS_PREVIOUS == 2 &&
      userToken.VANCONFIG.VANCNF_KEYIN_SCR == 1 &&
      (this.props.order.header.AR_ORDER_TYPE === 'ขายสินค้า' ||
        this.props.order.header.AR_ORDER_TYPE === 'จองสินค้า') &&
      this.props.order.header.VDI_USER_REF === null
    ) {
      const validationResult = await getLatestSoldQuotationGoodsCodes({
        v3GUID: await getLoginGuID(),
        vanConfig: userToken.VANCONFIG,
        arCode: this.props.customer.item.INFO.AR_CODE,
        arprbCode: this.props.customer.item?.ARPRB?.ARPRB_CODE,
        orderType: this.props.order.header.AR_ORDER_TYPE,
      });

      if (!validationResult.allowed) {
        this.setState({
          isLatestItemModalVisible: true,
          latestItemModalMessage:
            validationResult.message || LAST_BILL_QUOTATION_WARNING_MESSAGE,
        });
        return;
      }

      this._getProductListItemsFromLastBillByArCode(
        validationResult.goodsCodes,
      );
    }
  };

  _closeLatestItemModal = () => {
    this.setState({
      isLatestItemModalVisible: false,
      latestItemModalMessage: null,
    });
  };

  _getProductListItemsFromLastBillByArCode = async (goodsCodes = null) => {
    // try {
    const v3GUID = await getLoginGuID();
    const userToken = await getUserToken();
    //console.log('_getProductListItemsFromLastBillByArCode v3GUID ', v3GUID);
    await this.props.getProductListItemsFromLastBillByArCode(
      v3GUID,
      userToken.VANCONFIG.VANCNF_MACHINE,
      goodsCodes,
    );
    await this.props.calculateOrderProductSummary();
    // } catch (error) {
    //   console.log("Lastbills",error);
    // }
  };

  _editProductItem = (item, index) => {
    console.log('convertProductItemToOrderItem 2 >>' , item );
    //item.GOODS_TOTAL_DISCOUNT =  item.VTRD_U_DSC
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

  _removeProductItem = (index) => {
    this.props.removeProductItem(index);
  };

  _renderItem5INCH = ({item, index}) => {
    // console.log('_renderItem5INCH item ', item);
    return (
      <ListItem
        containerStyle={mainDivider}
        bottomDivider
      >
        <ListItem.Content key="content">
          <View style={{flex: 1}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
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
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>ส่วนลด</Text>
                      <Text>
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
                    name="pencil"
                    color={MainTheme.colorPrimary}
                    size={36}
                    type={'font-awesome'}
                    onPress={() => {
                      this._editProductItem(item, index);
                    }}
                  />

                  <Icon
                    name="trash-o"
                    color={MainTheme.colorPrimary}
                    size={36}
                    type={'font-awesome'}
                    onPress={() => {
                      this._removeAlertDialog(index);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  _renderItem = ({item, index}) => {
    console.log('<ListItem >>> ',item);
    return (
      <ListItem
        containerStyle={mainDivider}
        bottomDivider
      >
        <ListItem.Content key="content">
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 0.4}}>
              {/* <Text> {item.ICDEPT_THAIDESC} </Text> */}
              <Text style={{fontSize: hp('1.7%')}} allowFontScaling={false}>
                {item.VTRD_CODE}
              </Text>
              <Text style={{fontSize: hp('1.7%')}} allowFontScaling={false}>
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
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: hp('1.7%')}} allowFontScaling={false}>
                        จำนวน {'(' + item.VTRD_UTQ_NAME + ')'}
                </Text>
                <Text style={{fontSize: hp('1.7%')}} allowFontScaling={false}>
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
                      style={{fontSize: hp('1.7%')}}
                      allowFontScaling={false}>
                      ราคาต่อหน่วย
                    </Text>
                    <Text
                      style={{fontSize: hp('1.7%')}}
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
                      style={{fontSize: hp('1.7%')}}
                      allowFontScaling={false}>
                      แถม
                    </Text>
                    <Text
                      style={{fontSize: hp('1.7%')}}
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
                      style={{fontSize: hp('1.7%')}}
                      allowFontScaling={false}>
                      ส่วนลด 
                    </Text>
                    <Text
                      style={{fontSize: hp('1.7%')}}
                      allowFontScaling={false}>
                      {
                        // item.VTRD_TDSC_V
                        // ? parseFloat(item.VTRD_TDSC_V)
                        //     .toFixed(2)
                        //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        // : parseFloat(item.GOODS_TOTAL_DISCOUNT)
                        //     .toFixed(2)
                        //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                             {item.VTRD_U_DSC
                        ? parseFloat(item.VTRD_U_DSC)
                             .toFixed(2)
                             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                         : parseFloat(item.GOODS_TOTAL_DISCOUNT)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{fontSize: hp('1.7%')}}
                      allowFontScaling={false}>
                      ราคารวม
                    </Text>
                    <Text
                      style={{fontSize: hp('1.7%')}}
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
                size={36}
                type={'font-awesome'}
                onPress={() => {
                  this._editProductItem(item, index);
                }}
              />

              <Icon
                name="trash-o"
                color={MainTheme.colorPrimary}
                size={36}
                type={'font-awesome'}
                onPress={() => {
                  this._removeAlertDialog(index);
                }}
              />
            </View>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  _removeAlertDialog = (index) =>
    Alert.alert(
      'ประกาศ',
      'คุณต้องการลบข้อมูลสินค้าทั้งหมด?',
      [
        {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
        {text: 'ยืนยัน', onPress: () => this._removeProductItem(index)},
      ],
      {cancelable: false},
    );

  _onRefresh = () => {};

  render() {
    return (
      <>
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
        <Modal
          transparent={true}
          visible={this.state.isLatestItemModalVisible}
          animationType="fade"
          onRequestClose={this._closeLatestItemModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>ประกาศ</Text>
              <Text style={styles.modalMessage}>
                {this.state.latestItemModalMessage}
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={this._closeLatestItemModal}
                activeOpacity={0.7}>
                <Text style={styles.modalButtonText}>ตกลง</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButton: {
    minWidth: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: MainTheme.colorPrimary,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

const mapStateToProps = (state) => ({
  order: state.order,
  customer: state.customer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setSwipeCurrent: (index) => {
      dispatch(setSwipeCurrent(index));
    },
    pushSwipeList: (item) => {
      dispatch(pushSwipeList(item));
    },
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
    getProductListItemsFromLastBillByArCode: (V3GUID, vancnf_machine, goodsCodes) =>
      dispatch(getProductListItemsFromLastBillByArCode(V3GUID, vancnf_machine, goodsCodes)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);
