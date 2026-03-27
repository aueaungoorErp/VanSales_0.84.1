import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-elements';
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom';
import ILoading from '../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../constant/lov';
import { ORDER_TYPE_TRANSFER } from '../../../constant/orderTypes';

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

const DetailForm = (props) => {
  const {
    style,
    buttonListItems,
    renderItem,
    goodsCode,
    item,
    setItemQty,
    setItemSerial,
    setItemLot,
    setItemDiscount,
    setItemFree,
    successMessage,
    errorMessage,
    isLoading,
    getRef,
    onSearch,
    setGoodsCode,
    goodsCodeEditable,
    orderType,
    editableItemFree,
    editableItemDiscount,
    onScanBarcodePress,
    onSubmitEditing
  } = props;

  return (
    <View
      style={[
        styles.container,
        style && style.container ? style.container : null,
      ]}>
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.lineSection}>
            <Text style={{flex: 0.2}}>รหัสสินค้า</Text>
            <Item style={[{flex: 0.8}, styles.itemSection]}>
              <Input
                value={goodsCode}
                returnKeyType="search"
                onChangeText={setGoodsCode}
                onSubmitEditing={() => (onSearch ? onSearch() : null)}
                editable={goodsCodeEditable}
                style={{textAlign: 'left' , fontSize: 16}}
              />

              <Icon
                name="barcode-scan"
                color={MainTheme.colorPrimary}
                size={30}
                type={'material-community'}
                onPress={() =>
                  onScanBarcodePress ? onScanBarcodePress() : null
                }
              />
            </Item>
          </View>

          <View style={styles.lineSection}>
            <Text style={{flex: 0.2 }}>ชื่อสินค้า</Text>
            <Item
              style={[{flex: 0.8, paddingVertical: 11}, styles.itemSection]}>
              <Text style={{color: '#000000', fontSize: 16}}>
                {item.GOODS_NAME ? item.GOODS_NAME : item.SKU_NAME}
                {item.UTQ_NAME ? ' (' + item.UTQ_NAME + ')' : null}
              </Text>
            </Item>
          </View>

          <View style={styles.lineSection}>
            <Text style={{flex: 0.2}}>จำนวน</Text>
            <Item style={[{flex: 0.8}, styles.itemSection]}>
              <Input
                value={
                  item.GOODS_QTY !== null && item.GOODS_QTY != undefined
                    ? item.GOODS_QTY.toString()
                    : null
                }
                keyboardType="numeric"
                ref={(ref) => (getRef ? getRef(ref) : null)}
                onChangeText={setItemQty}
                style={{textAlign: 'right'}}
              />
            </Item>
          </View>

          {orderType !== ORDER_TYPE_TRANSFER  ? (
            <View>
              <View style={styles.lineSection}>
                <Text style={{flex: 0.2}}>แถม</Text>
                <Item style={[{flex: 0.8}, styles.itemSection]}>
                  <Input
                    value={
                      item.GOODS_FREE !== null && item.GOODS_FREE != undefined
                        ? item.GOODS_FREE.toString()
                        : null
                    }
                    keyboardType="numeric"
                    onChangeText={setItemFree}
                    editable={editableItemFree}
                    style={{textAlign: 'right'}}
                  />
                </Item>
              </View>

              <View style={styles.lineSection}>
                <Text style={{flex: 0.3}}>ราคาต่อหน่วย</Text>
                <Item style={[{flex: 0.8}, styles.itemSection]}>
                  <Input
                    value={
                      item.ARPLU_U_PRC !== null && item.ARPLU_U_PRC != undefined
                        ? parseFloat(item.ARPLU_U_PRC)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : null
                    }
                    keyboardType= "numeric"
                    editable={false}
                    style={{textAlign: 'right'}}
                  />
                </Item>
              </View>

              <View style={styles.lineSection}>
                <Text style={{flex: 0.2}}>ส่วนลด</Text>
                <Item style={[{flex: 0.8}, styles.itemSection]}>
                  <Input
                    value={
                      item.GOODS_DISCOUNT !== null &&
                      item.GOODS_DISCOUNT != undefined
                        ? ((item.GOODS_DISCOUNT.toString() == '0' || item.GOODS_DISCOUNT.toString().substring(0, 2) == '0*'
                        ) ? null : item.GOODS_DISCOUNT.toString() )
                        : null
                    }
                    onChangeText={setItemDiscount}
                    keyboardType=  "numeric"
                    editable={editableItemDiscount}
                    style={{textAlign: 'right'}}
                    onSubmitEditing ={onSubmitEditing}
                  />
                </Item>
              </View>

              {/* <View style={{flexDirection: 'row'}} >  
                                <Item style={{flex: 0.5, marginRight: 15}}>
                                    <Text> ยอดส่วนลด </Text>
                                    <Input 
                                        value={item.GOODS_TOTAL_DISCOUNT !== null ? item.GOODS_TOTAL_DISCOUNT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null} 
                                        editable={false} />
                                </Item>

                                <Item style={{flex: 0.5}}>
                                    <Text> ภาษี </Text>
                                    <Input 
                                        value={item.GOODS_VAT !== null ? item.GOODS_VAT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null}
                                        editable={false} />
                                </Item>
                            </View> */}

              {/* <View style={{flexDirection: 'row'}} >  
                                <Item style={{flex: 0.5, marginRight: 15}}>
                                    <Text> มูลค่า </Text>
                                    <Input 
                                        value={item.GOODS_TOTAL_PRC !== null ? item.GOODS_TOTAL_PRC.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null} 
                                        editable={false} />
                                </Item>

                                <Item style={{flex: 0.5}}>
                                    <Text> ราคาสุทธิ </Text>
                                    <Input 
                                        value={item.GOODS_NET_PRC !== null ? item.GOODS_NET_PRC.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null} 
                                        editable={false} />
                                </Item>
                            </View> */}

              <View style={styles.lineSection}>
                <Text style={{flex: 0.2}}>ยอดส่วนลด</Text>
                <Item style={[{flex: 0.8}, styles.itemSection]}>
                  <Input
                    value={
                      item.GOODS_TOTAL_DISCOUNT !== null &&
                      item.GOODS_TOTAL_DISCOUNT != undefined
                        ? parseFloat(item.GOODS_TOTAL_DISCOUNT)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : null
                    }
                    editable={false}
                    style={{textAlign: 'right'}}
                  />
                </Item>
              </View>

              <View style={styles.lineSection}>
                <Text style={{flex: 0.2}}>จำนวนเงิน</Text>
                <Item style={[{flex: 0.8}, styles.itemSection]}>
                  <Input
                    value={
                      item.GOODS_TOTAL_PRC !== null &&
                      item.GOODS_TOTAL_PRC != undefined
                        ? parseFloat(item.GOODS_TOTAL_PRC)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : null
                    }
                    editable={false}
                    style={{textAlign: 'right'}}
                  />
                </Item>
              </View>
{
              // <View style={styles.lineSection}>
              //   <Text style={{flex: 0.2}}>เลขล๊อต</Text>
              //   <Item style={[{flex: 0.8}, styles.itemSection]}>
              //     <Input
              //       value={
              //         item.TRD_LOT_NO !== null && item.TRD_LOT_NO != undefined
              //           ? item.TRD_LOT_NO.toString()
              //           : null
              //       }
              //       onChangeText={setItemLot}
              //       keyboardType="default"
              //       style={{textAlign: 'right'}}
              //     />
              //   </Item>
              // </View>

              // <View style={styles.lineSection}>
              //   <Text style={{flex: 0.2}}>เลขซีเรียล</Text>
              //   <Item style={[{flex: 0.8}, styles.itemSection]}>
              //     <Input
              //       value={
              //         item.TRD_SERIAL !== null && item.TRD_SERIAL != undefined
              //           ? item.TRD_SERIAL.toString()
              //           : null
              //       }
              //       onChangeText={setItemSerial}
              //       keyboardType="default"
              //       style={{textAlign: 'right'}}
              //     />
              //   </Item>
              // </View>
          }
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.messageBox}>
        <ITextWithSuccessMessage message={successMessage} />
        <ITextWithErrorMessage message={errorMessage} />
        <ILoading isLoading={isLoading} />
      </View>

      <IButtonGroupCustom
        listItems={buttonListItems}
        renderItem={renderItem}
        style={iButtonGroupCustomStyles}
      />
    </View>
  );
};

export default DetailForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  inputSection: {
    height: 320,
  },
  itemSection: {
    borderBottomColor: 'black',
  },
  messageBox: {
    height: 30,
    margin: 15,
  },
  sectionInline: {
    height: 40,
    flexDirection: 'row',
  },
  errorSection: {
    flex: 0.5,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  errorMessage: {
    color: MainTheme.colorDanger,
  },
  lineSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const iButtonGroupCustomStyles = StyleSheet.create({
  container: {
    flex: null,
    height: 60,
    flexDirection: 'row',
    justifyContent: null,
  },
});
