import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {
    addProduct,
    addProducts,
    calculateOrderProductSummary,
    getProductListItemsFromLastBillByArCode,
    removeAllProductItems,
    removeAllSwipeList,
    setSwipeCurrent,
} from '../../../action/order';
import { setInitialState } from '../../../action/product';
import { serverReady } from '../../../api/setting';
import {
    MainTheme,
    orderSalesButtonGroup,
    orderSalesButtonGroupAddSCR,
    orderSalesButtonGroupEditSCR,
    orderSalesFooterButtonGroup,
    orderSalesReturnButtonGroup,
} from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import {
    convertProductItemToOrderItem,
    convertProductItemToOrderItemSCR,
} from '../../../utils/Order';
import { getLoginGuID, getSettingConfig, getUserToken } from '../../../utils/Token';
import ButtonGroup from '../presenter/ButtonGroup';
class CTButtonGroup extends Component {
  _isMounted = false;
  _userToken = false;
  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      _errormsg: null
    };

    this._getUserToken();
  }

  componentDidMount() {
     this._check_inVANCNFDatetime();
    this._isMounted = true;
    
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _check_inVANCNFDatetime= async () => {
    const VANCONFIG = await getSettingConfig();
    const result =   await this.props.serverReady(VANCONFIG.baseUrl);
    const {RESULT_DATA, RESPONSE_DATETIME} = result;
    const timeArray = RESPONSE_DATETIME.split(':');
  
    if (
      parseInt(timeArray[0] + timeArray[1]) >=
      parseInt(VANCONFIG.VANCONFIG.VANCNF_TIME_FM) &&
      parseInt(timeArray[0] + timeArray[1]) <=
      parseInt(VANCONFIG.VANCONFIG.VANCNF_TIME_TO)
    ) {
      
    } else {
      const errorStr =
        'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด \n\r(' +
        VANCONFIG.VANCONFIG.VANCNF_TIME_FM.substring(0, 2) + ":" + VANCONFIG.VANCONFIG.VANCNF_TIME_FM.substring(2, 4) + ' น. - ' +
        VANCONFIG.VANCONFIG.VANCNF_TIME_TO.substring(0, 2) + ":" + VANCONFIG.VANCONFIG.VANCNF_TIME_TO.substring(2, 4) + ' น.)';

        this.setState({_errormsg:errorStr});
      return;
    }

  };



  _getUserToken = () => {
    const {routes, index} = Navigator.getCurrentRoute();
    const {userToken} = routes[index].params;
    this._userToken = userToken;
  };

  _renderItem = (item, key) => {
    const disabled =
      this.props.order.productListItems.length <= 0 && item.title === 'ตกลง'
        ? true
        : false;

    return (
      <TouchableOpacity key={key} style={[item.buttonStyle, item.containerStyle, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}, disabled ? {
          backgroundColor: MainTheme.colorNonary,
          borderRadius: 0,
        } : null]} onPress={() => {
          this._onPress(item);
        }} disabled={disabled} activeOpacity={0.7}>
              <Text style={item.titleStyle}>{item.title}</Text>
            </TouchableOpacity>
    );
  };

  _onPress = async (item) => {
    this.props.order.errorMessage = null;

    if (item.methodType === 'new-page') {
      if (item.screen === 'ProductAddTo') {
        const userToken = await getUserToken();

        this.props.setInitialState();

        if (
          userToken.VANCONFIG.VANCNF_KEYIN_SCR == 1 ||
          this.props.order.header.AR_ORDER_TYPE === 'รับคืนสินค้า' ||
          this.props.order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า'
        ) {
          Navigator.navigate(item.screen, {
            actionType: 'add',
            confirmMethod: async (item) => {
              await this.props.addProduct(convertProductItemToOrderItem(item));
              await this.props.calculateOrderProductSummary();
              Navigator.back();
            },
          });
        } else {
          Navigator.navigate(item.screen, {
            actionType: 'add_scr',
            confirmMethod: async (items) => {
              await this.props.addProducts(
                convertProductItemToOrderItemSCR(items),
              );
              await this.props.calculateOrderProductSummary();
              Navigator.back();
            },
          });
        }
      } else if (item.screen === 'ProductEditTo') {
        const userToken = await getUserToken();

        if (
          userToken.VANCONFIG.VANCNF_KEYIN_SCR == 1 ||
          this.props.order.header.AR_ORDER_TYPE === 'รับคืนสินค้า' ||
          this.props.order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า'
        ) {
          Navigator.navigate(item.screen, {
            actionType: 'edit',
          });
        } else {
          Navigator.navigate(item.screen, {
            actionType: 'edit_scr',
            confirmMethod: async (items) => {
              await this.props.removeAllProductItems();
              await this.props.addProducts(
                convertProductItemToOrderItemSCR(items),
              );
              await this.props.calculateOrderProductSummary();

              Navigator.back();
            },
          });
        }
      } else if (item.screen === 'OrderSalesSummary') {

        Navigator.navigate(item.screen, {
          actionType: 'orderProductSummary',
        });
      } else {
        Navigator.navigate(item.screen, {
          orderType: this.props.order.header.AR_ORDER_TYPE,
        });
      }
    } else if (item.methodType === 'function') {
      if (item.methodName === 'last-bill') {
        this._getLastBillDialog();
      } else if (item.methodName === 'remove-all') {
        this._removeAlertDialog();
      } else if (item.methodName === 'cancel') {
        if (this.props.order.productListItems.length === 0) {
          Navigator.back();
        } else {
          this._alertDialog();
        }
      }
    }
  };

  _alertDialog = () =>
    Alert.alert(
      'ประกาศ',
      'คุณแน่ใจว่าจะออกจากหน้าจอนี้',
      [
        {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
        {text: 'ยืนยัน', onPress: () => Navigator.back()},
      ],
      {cancelable: false},
    );

  _getProductListItemsFromLastBillByArCode = async () => {
    try {
      const v3GUID = await getLoginGuID();
      const userToken = await getUserToken();
      await this.props.getProductListItemsFromLastBillByArCode(
        v3GUID,
        userToken.VANCONFIG.VANCNF_MACHINE,
      );
      await this.props.calculateOrderProductSummary();
    } catch (error) {
      console.log(error);
    }
  };

  _getLastBillDialog = () =>
    Alert.alert(
      'ประกาศ',
      'ต้องการทำรายการเหมือนบิลล่าสุดหรือไม่?',
      [
        {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
        {
          text: 'ยืนยัน',
          onPress: () => {
               this.props.order.errorMessage = null;
               this._removeAll();
               this._getProductListItemsFromLastBillByArCode();
          }
        },
      ],
      {cancelable: false},
    );

  _removeAlertDialog = () =>
    Alert.alert(
      'ประกาศ',
      'คุณต้องการลบข้อมูลสินค้าทั้งหมด?',
      [
        {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
        {text: 'ยืนยัน', onPress: () => this._removeAll()},
      ],
      {cancelable: false},
    );

  _removeAll = () => {
    this.props.removeAllProductItems();
    this.props.calculateOrderProductSummary();
    this.props.removeAllSwipeList();
    this.props.setSwipeCurrent(-1);
  };

  render() {
    if (this.props.hasFooterButton) {
      return (
        <ButtonGroup
          listItems={orderSalesFooterButtonGroup}
          renderItem={this._renderItem}
        />
      );
    } else {
      let buttonGroup = null;
      if (
        this.props.order.header.AR_ORDER_TYPE === 'รับคืนสินค้า' ||
        this.props.order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า'
      ) {
        buttonGroup = orderSalesReturnButtonGroup;
      } else {
        if (this._userToken.VANCONFIG.VANCNF_KEYIN_SCR != 1) {
          if (this.props.order.productListItems.length > 0) {
            buttonGroup = orderSalesButtonGroupEditSCR;
          } else {
            buttonGroup = orderSalesButtonGroupAddSCR;
          }
        } else {
          buttonGroup =  orderSalesButtonGroup;
        }
      }
      return (<>      
      {!this.state._errormsg ?
      <ButtonGroup listItems={this.state._errormsg?   null : buttonGroup} renderItem={this._renderItem} /> : 
      <Text  style={styles.red}>{'\n\n'}{this.state._errormsg}</Text>       
      }
      </>);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
   textAlign: 'center', 
  },
});



const mapStateToProps = (state) => ({
  order: state.order,
});

const mapDispatchToProps = (dispatch) => {
  return {
    serverReady: (data) => dispatch(serverReady(data)),
    addProduct: (item) => dispatch(addProduct(item)),
    addProducts: (items) => dispatch(addProducts(items)),
    removeAllProductItems: () => dispatch(removeAllProductItems()),
    setSwipeCurrent: (index) => {
      dispatch(setSwipeCurrent(index));
    },
    removeAllSwipeList: () => {
      dispatch(removeAllSwipeList());
    },
    calculateOrderProductSummary: () =>
      dispatch(calculateOrderProductSummary()),
    setInitialState: () => {
      dispatch(setInitialState());
    },
    getProductListItemsFromLastBillByArCode: (v3GUID, vancnf_machine) =>
      dispatch(getProductListItemsFromLastBillByArCode(v3GUID, vancnf_machine)),
   
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTButtonGroup);
