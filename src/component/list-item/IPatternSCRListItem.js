import _ from 'lodash';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { mainDivider } from '../../constant/lov';

const Item = ({children, style}) => <View style={style}>{children}</View>;

const Input = React.forwardRef(({value, style, ...props}, ref) => (
  <TextInput
    ref={ref}
    value={value === null || value === undefined ? '' : String(value)}
    style={style}
    underlineColorAndroid="transparent"
    {...props}
  />
));

class IPatternSCRListItem extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      scrChooseItem: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this._setState('scrChooseItem', this.props.scrChooseItem);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  shouldComponentUpdate = async (nextProps, nextState) => {
    if (!_.isEqual(nextProps.scrChooseItem, this.props.scrChooseItem)) {
      await this._setState('scrChooseItem', nextProps.scrChooseItem);
      return true;
    }

    return false;
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  render() {
    const {
      item,
      index,
      scrChooseItem,
      setItemQty,
      setItemFree,
      setItemDiscount,
    } = this.props;
    return (
      <ListItem
        title={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{width: 150, marginLeft: 5}}>{item.GOODS_NAME}</Text>
            <Text style={{width: 100, marginRight: 5, textAlign: 'right'}}>
              {item.UTQ_NAME}
            </Text>
            <Text style={{width: 100, marginRight: 5, textAlign: 'right'}}>
              {item.ARPLU_U_PRC.toFixed(2).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ',',
              )}
            </Text>
            <Item regular style={{width: 50, marginLeft: 5}}>
              <Input
                style={{
                  fontSize: 15,
                  textAlign: 'right',
                  height: 35,
                  paddingBottom: 8,
                }}
                value={
                  this.state.scrChooseItem !== undefined &&
                  this.state.scrChooseItem !== null &&
                  this.state.scrChooseItem.GOODS_QTY !== undefined &&
                  this.state.scrChooseItem.GOODS_QTY !== null &&
                  this.state.scrChooseItem.GOODS_QTY !== '0'
                    ? this.state.scrChooseItem.GOODS_QTY
                    : null
                }
                keyboardType="numeric"
                onChangeText={(value) => {
                  setItemQty(item, index, value);
                }}
              />
            </Item>
            <Item regular style={{width: 50, marginLeft: 5}}>
              <Input
                style={{
                  fontSize: 15,
                  textAlign: 'right',
                  height: 35,
                  paddingBottom: 8,
                }}
                value={
                  this.state.scrChooseItem !== undefined &&
                  this.state.scrChooseItem !== null &&
                  this.state.scrChooseItem.GOODS_FREE !== undefined &&
                  this.state.scrChooseItem.GOODS_FREE !== null &&
                  this.state.scrChooseItem.GOODS_FREE !== '0'
                    ? this.state.scrChooseItem.GOODS_FREE
                    : null
                }
                keyboardType="numeric"
                onChangeText={(value) => {
                  setItemFree(item, index, value);
                }}
              />
            </Item>
            <Item regular style={{width: 50, marginLeft: 5}}>
              <Input
                style={{
                  fontSize: 15,
                  textAlign: 'right',
                  height: 35,
                  paddingBottom: 8,
                }}
                value={
                  this.state.scrChooseItem !== undefined &&
                  this.state.scrChooseItem !== null &&
                  this.state.scrChooseItem.GOODS_DISCOUNT !== undefined &&
                  this.state.scrChooseItem.GOODS_DISCOUNT !== null &&
                  this.state.scrChooseItem.GOODS_DISCOUNT !== '0'
                    ? this.state.scrChooseItem.GOODS_DISCOUNT
                    : null
                }
                keyboardType="numeric"
                onChangeText={(value) => {
                  setItemDiscount(item, index, value);
                }}
              />
            </Item>
            <Text style={{width: 80, marginLeft: 5}}>{item.GOODS_CODE}</Text>
          </View>
        }
        titleNumberOfLines={1}
        hideChevron
        containerStyle={mainDivider}
      />
    );
  }
}

export default IPatternSCRListItem;
