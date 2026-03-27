import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

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

const Summary = (props) => {
  const {order} = props;
  console.log('Summary order ', order.orderProductSummary);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, padding: 5}}>
        <View style={styles.lineSection}>
          <Text style={{flex: 0.2, fontSize: hp('1.7%')}}>รวมยอด</Text>
          <Item style={[{flex: 0.8}, styles.itemSection]}>
            <Input
              style={{textAlign: 'right', fontSize: hp('1.4%')}}
              value={
                order &&
                order.orderProductSummary &&
                order.orderProductSummary.netPrice
                  ? order.orderProductSummary.netPrice
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : null
              }
              editable={false}
            />
          </Item>
        </View>
        <View style={styles.lineSection}>
          <Text style={{flex: 0.2, fontSize: hp('1.7')}}>รวมรายการ</Text>
          <Item style={[{flex: 0.8}, styles.itemSection]}>
            <Input
              style={{textAlign: 'right', fontSize: hp('1.4%')}}
              value={
                order &&
                order.orderProductSummary &&
                order.orderProductSummary.totalItems
                  ? order.orderProductSummary.totalItems
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : null
              }
              editable={false}
            />
          </Item>
        </View>
        <View style={styles.lineSection}>
          <Text style={{flex: 0.2, fontSize: hp('1.7%')}}>รวมชิ้น</Text>
          <Item style={[{flex: 0.8}, styles.itemSection]}>
            <Input
              style={{textAlign: 'right', fontSize: hp('1.4%')}}
              value={
                order &&
                order.orderProductSummary &&
                order.orderProductSummary.totalQty
                  ? (order.orderProductSummary.totalQty+order.orderProductSummary.totalFree)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : null
              }
              editable={false}
            />
          </Item>
        </View>
      </View>
    </View>
  );
};

// VDI_ITEMS_SH_COUNT VDI_AF_DISC VDI_PCS
export default Summary;

const styles = StyleSheet.create({
  lineSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSection: {
    borderBottomColor: 'black',
  },
});
