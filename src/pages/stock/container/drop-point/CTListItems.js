import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import {
    getDropPointListItems,
    setInitialState
} from '../../../../action/drop-point';
import {
    setInitialState as orderSetInitialState,
    setHeader,
} from '../../../../action/order';
import { MainTheme, mainDivider } from '../../../../constant/lov';
import {
    ORDER_TYPE_TRANSFER
} from '../../../../constant/orderTypes';
import Navigator from '../../../../services/Navigator';
import {
    generateHeaderStockTransferV3
} from '../../../../utils/Order';
import { getUserToken } from '../../../../utils/Token';
import ListItems from '../../presenter/drop-point/ListItems';

class CTListItems extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: this.props.actionType == 'drop-point' ? 1 : 0,
      isLoading: false,
      errorMessage: null,
      userToken: null,
      transferfrom: '',
      transferto: '',
      vanVANCNF_WL: '',


    };

    this._updateIndex = this._updateIndex.bind(this);
    this._getUserToken();
  }

  componentDidMount = (props) => {
    this._isMounted = true;
    this.props.setInitialState();
    console.log('componentDidMount this.props.actionType', this.props);
    console.log('componentDidMount this.props.isFirst', this.props.isFirst);
    this.props.actionType == 'drop-point'
      ? this._getDropPointListItems()
      : null;
  };

  componentWillUnmount() {
    this._isMounted = false;
    console.log("componentWillUnmount");
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

  _getDropPointListItems = async () => {
    try {
      this._setIsLoading(true);
      this._setErrorMessage(null);
      console.log('_getDropPointListItems userToken', this.state.userToken);
      await this.props.getDropPointListItems();
    } catch (error) {
      this._setErrorMessage(error);
    }
    this._setIsLoading(false);
  };

  _setIsLoading = (value) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          isLoading: value,
        };
      });
  };

  _setErrorMessage = (value) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          errorMessage: value,
        };
      });
  };

  _updateIndex(value) {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          selectedIndex: value,
        };
      });
  }

  _onPress = async (item) => {
     const userToken = await getUserToken();
    console.log(
      '_onPress item',
      item,
      this.props.isFirst,
      this.props.from != 'StockTransfer',
    );
   //console.log( 'userToken >>' , userToken);
   if (this.props.isFirst) {
     this.state.transferfrom = this.props.order.header && this.props.order.header.FROM && this.props.order.header.FROM.WL_KEY && item.WL_KEY;
   } else {
     this.state.transferto = this.props.order.header && this.props.order.header.TO && this.props.order.header.TO.WL_KEY && item.WL_KEY;
   }
    this.state.userToken  = userToken;
    this.state.vanVANCNF_WL = userToken.VANCONFIG.VANCNF_WL;

    if (this.props.isFirst && this.props.from != 'StockTransfer') {
      const data = generateHeaderStockTransferV3(item, {}, ORDER_TYPE_TRANSFER);
      console.log('ไม่else ไม่else ไม่else', this.props.order);
      console.log('ไม่else ไม่else ไม่else', this.props.order.header);


       await this.props.orderSetInitialState();
       await this.props.setHeader(data);

      Navigator.navigate('StockTransfer', {
        from: 'StockTransfer',
        userToken: this.state.userToken,
        isFirst: false,
      });
    } else {
      console.log('else else else', this.props.order);
      const data = generateHeaderStockTransferV3(
        this.props.order.header.FROM,
        item,
        ORDER_TYPE_TRANSFER,
      );

      await this.props.setHeader(data);
      Navigator.navigate('OrderSales', {
        from: 'TransferGoods',
        userToken: this.state.userToken,
        isFirst: false,
        FROM: this.props.FROM,
        TO: item,
      });
    }
  };

  _renderListItem = ({item, index}) => {

     this.state.transferfrom = this.props.order.header && this.props.order.header.FROM && this.props.order.header.FROM.WL_KEY ;
     this.state.transferto = this.props.order.header && this.props.order.header.TO && this.props.order.header.TO.WL_KEY ;
    
     this.props.order.header.VDI_AF_DISC = "";

    console.log('_renderListItem item', item);
    console.log('this.props.order >>', this.props.order.header);
    console.log('this.props.order FROM>>', this.props.order.header&&this.props.order.header.FROM&&this.props.order.header.FROM.WL_KEY );
    console.log('this.props.order TO >>', this.props.order.header&&this.props.order.header.TO&&this.props.order.header.TO.WL_KEY);
    console.log('this.props.actionType.actionType', this.props.actionType);
    console.log('item.WL_KEY',item.WL_KEY);
    console.log('this.state.vanVANCNF_WL',this.state.vanVANCNF_WL);
    console.log('this.state.transferfrom', this.state.transferfrom);


    return (
      
      <ListItem
        style = 
             {
                (!this.props.isFirst && item.WL_KEY !== this.state.vanVANCNF_WL&& this.props.actionType === 'transfer') ? item.WL_KEY == this.state.transferfrom ?
                  styles.Bg_Item :  {}: (item.WL_KEY === this.state.vanVANCNF_WL && this.state.vanVANCNF_WL === this.state.transferfrom) ?
                  styles.Bg_Item  : {}
              }
      disabled =   
            {
              (!this.props.isFirst && item.WL_KEY !== this.state.vanVANCNF_WL && this.props.actionType === 'transfer') ? item.WL_KEY == this.state.transferfrom ?
                true : false: (item.WL_KEY === this.state.vanVANCNF_WL && this.state.vanVANCNF_WL === this.state.transferfrom) ?
                true : false
            }
        onPress={() => {
          this.props.actionType === 'transfer' ||
          this.props.actionType === 'transferGoods'
            ? this._onPress(item)
            : null;
        }}
        containerStyle={mainDivider}
        bottomDivider
      >
        {item.icon ? <Icon name={item.icon} type={item.type} /> : null}
        <ListItem.Content>
          <View style={{flex: 1, flexDirection: 'column',}}>
            <Text style = 
             {[
            (!this.props.isFirst && item.WL_KEY !== this.state.vanVANCNF_WL && this.props.actionType === 'transfer') ? item.WL_KEY == this.state.transferfrom ?
               styles.itemNameColor2  : {color: MainTheme.placeholder} : (item.WL_KEY === this.state.vanVANCNF_WL && this.state.vanVANCNF_WL === this.state.transferfrom) ?
               styles.itemNameColor2  : {color: MainTheme.placeholder} 
            , {fontSize: hp('2.1%')}]}            
            allowFontScaling = {false} >
            {
              (!this.props.isFirst && item.WL_KEY !== this.state.vanVANCNF_WL && this.props.actionType === 'transfer') ? item.WL_KEY ==  this.state.transferfrom 
              ?'จาก >>>':'': (item.WL_KEY === this.state.vanVANCNF_WL && this.state.vanVANCNF_WL ===this.state.transferfrom ) 
              ? 'จาก >>>' :  '' }
              {' '}
              {item.WL_NAME}{' '}
            </Text>
            

            {
              this.props.actionType === 'drop-point' || this.props.actionType === 'transfer' ? (
              <View >
                {item != undefined && item.QTY != undefined ? (
                  <Text style={{fontSize: hp('1.7%'), color : 'red'}} allowFontScaling={false}>
                  {' '}
                  คงเหลือ {
                  Math.floor(item.QTY / item.UTQ_QTY)
                  .toFixed(0).replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ',',
                ) }{
                  item.UTQ_QTY == 1?'': '.' +
                  ('0' +
                    Math.abs(item.QTY) -
                    ((Math.floor( Math.abs(item.QTY) / item.UTQ_QTY).toFixed(0)) * item.UTQ_QTY)
                  )
                  .toFixed(0)
                  .padStart(('' + item.UTQ_QTY).length, '0')
                  }{' '}{item.UTQ_NAME}{' '} 
                  </Text>
                ) : null}
              </View>
            ) : null
            }
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  _renderGridItem = ({item}) => {
    console.log('_renderGridItem item', item);
    return (
      <TouchableOpacity
           disabled =   
            {

              (!this.props.isFirst && item.WL_KEY !== this.state.vanVANCNF_WL && this.props.actionType === 'transfer') ? item.WL_KEY == this.state.transferfrom ?
                true : false: (item.WL_KEY === this.state.vanVANCNF_WL && this.state.vanVANCNF_WL === this.state.transferfrom) ?
                true : false
            }
        onPress={() => {
          this.props.actionType === 'transfer' ? this._onPress(item) : null;
        }}>
        <View
        style = {
          [
            styles.itemContainer,
            {
              backgroundColor: (!this.props.isFirst && item.WL_KEY !== this.state.vanVANCNF_WL && this.props.actionType === 'transfer') ? item.WL_KEY == this.state.transferfrom ?
                MainTheme.colorButtonBorder : MainTheme.colorPrimary : (item.WL_KEY === this.state.vanVANCNF_WL && this.state.vanVANCNF_WL === this.state.transferfrom) ?
                MainTheme.colorButtonBorder : MainTheme.colorPrimary
            },
          ]
        } >
          <Text
            style=
            {[
            (!this.props.isFirst && item.WL_KEY !== this.state.vanVANCNF_WL && this.props.actionType === 'transfer') ? item.WL_KEY == this.state.transferfrom ?
                styles.itemNameColor2 : styles.itemName: (item.WL_KEY === this.state.vanVANCNF_WL && this.state.vanVANCNF_WL === this.state.transferfrom) ?
                styles.itemNameColor2 : styles.itemName
            , {fontSize: hp('1.9%')}]}
            
            // {[styles.itemName, {fontSize: hp('1.9%')}]}
            allowFontScaling={false}>
            {
              (!this.props.isFirst && item.WL_KEY !== this.state.vanVANCNF_WL && this.props.actionType === 'transfer') ? item.WL_KEY ==  this.state.transferfrom 
              ?'จาก >>>':'': (item.WL_KEY === this.state.vanVANCNF_WL && this.state.vanVANCNF_WL ===this.state.transferfrom ) 
              ? 'จาก >>>' :  '' }
              {item.WL_NAME}
          </Text>

          {
            //this.props.actionType === 'drop-point' || this.props.actionType === 'transfer'  ?   (
            <View>
              {item != undefined && item.QTY != undefined ? (
                <Text
                  style={[styles.itemCode, {fontSize: hp('1.7%'), color : 'yellow'}]}
                  allowFontScaling={false}>
                  คงเหลือ {
                  Math.floor(item.QTY / item.UTQ_QTY)
                  .toFixed(0).replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ',',
                ) }{
                  item.UTQ_QTY == 1?'': '.' +
                  ('0' +
                    Math.abs(item.QTY) -
                    ((Math.floor( Math.abs(item.QTY) / item.UTQ_QTY).toFixed(0)) * item.UTQ_QTY)
                  )
                  .toFixed(0)
                  .padStart(('' + item.UTQ_QTY).length, '0')
                  }{' '}{item.UTQ_NAME}{' '} 
                </Text>
              ) : null}
            </View>
          //) : null
          }
        </View>
      </TouchableOpacity>
    );
  };

  _listButton = () => (
    <AntDesign
      name="bars"
      color={
        this.state.selectedIndex == 0
          ? MainTheme.colorSecondary
          : MainTheme.colorPrimary
      }
      size={24}
    />
  );
  _gridButton = () => (
    <AntDesign
      name="appstore-o"
      color={
        this.state.selectedIndex == 1
          ? MainTheme.colorSecondary
          : MainTheme.colorPrimary
      }
      size={24}
    />
  );

  _buttons = [{element: this._listButton}, {element: this._gridButton}];

  render() {
    return (
      <ListItems
        renderListItem={this._renderListItem}
        renderGridItem={this._renderGridItem}
        listItems={this.props.dropPoint.listItems}
        buttons={this._buttons}
        updateIndex={this._updateIndex}
        selectedIndex={this.state.selectedIndex}
        errorMessage={this.state.errorMessage}
        isLoading={this.state.isLoading || this.props.dropPoint.isLoading}
        setIsLoading={this._setIsLoading}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  dropPoint: state.dropPoint,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setInitialState: () => {
      dispatch(setInitialState());
    },
    getDropPointListItems: () => dispatch(getDropPointListItems()),
    orderSetInitialState: (data) => dispatch(orderSetInitialState(data)),
    setHeader: (data) => dispatch(setHeader(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },
    itemNameColor: {
        fontWeight: 'bold',
        fontSize: 12,
        color: MainTheme.colorSecondary,
        opacity: 0.9,
      },
      itemNameColor2: {
        fontWeight: 'bold',
        fontSize: 12,
        color: MainTheme.colorDenary,

      },
    Bg_Item: {
      backgroundColor: MainTheme.colorTertiary,
      opacity: 0.9
    },
});
