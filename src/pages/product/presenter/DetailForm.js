import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom';
import ILoading from '../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../constant/lov';
import { ORDER_TYPE_TRANSFER } from '../../../constant/orderTypes';

const Item = ({children, style}) => <View style={style}>{children}</View>;

const Input = React.forwardRef(({value, style, editable, ...props}, ref) => (
  <TextInput
    ref={ref}
    value={value === null || value === undefined ? '' : String(value)}
    style={[
      styles.inputBase,
      editable === false ? styles.inputReadOnly : styles.inputEditable,
      style,
    ]}
    editable={editable}
    underlineColorAndroid="transparent"
    placeholderTextColor="#B0B0B0"
    {...props}
  />
));

const FieldRow = ({iconName, label, children, labelFlex}) => (
  <View style={styles.fieldRow}>
    <View style={[styles.labelContainer, labelFlex ? {flex: labelFlex} : null]}>
      <AntDesign name={iconName} size={16} color={MainTheme.colorQuaternary} style={styles.labelIcon} />
      <Text style={styles.labelText}>{label}</Text>
    </View>
    <View style={[styles.fieldContent, labelFlex ? {flex: 1 - labelFlex + 0.3} : null]}>
      {children}
    </View>
  </View>
);

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
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 10}}>
        {/* Product Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="inbox" size={16} color={MainTheme.colorSecondary} />
            <Text style={styles.cardHeaderText}>ข้อมูลสินค้า</Text>
          </View>

          <View style={styles.cardBody}>
            <FieldRow iconName="barcode" label="รหัสสินค้า">
              <View style={styles.codeInputRow}>
                <Input
                  value={goodsCode}
                  returnKeyType="search"
                  onChangeText={setGoodsCode}
                  onSubmitEditing={() => (onSearch ? onSearch() : null)}
                  editable={goodsCodeEditable}
                  style={{flex: 1, textAlign: 'left', fontSize: 15}}
                />
                <MaterialDesignIcons
                  name="barcode-scan"
                  color={MainTheme.colorPrimary}
                  size={26}
                  style={styles.scanIcon}
                  onPress={() =>
                    onScanBarcodePress ? onScanBarcodePress() : null
                  }
                />
              </View>
            </FieldRow>

            <FieldRow iconName="tags" label="ชื่อสินค้า">
              <Text style={styles.productNameText}>
                {item.GOODS_NAME ? item.GOODS_NAME : item.SKU_NAME}
                {item.UTQ_NAME ? ' (' + item.UTQ_NAME + ')' : null}
              </Text>
            </FieldRow>
          </View>
        </View>

        {/* Quantity Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="calculator" size={16} color={MainTheme.colorSecondary} />
            <Text style={styles.cardHeaderText}>จำนวน</Text>
          </View>

          <View style={styles.cardBody}>
            <FieldRow iconName="shoppingcart" label="จำนวน">
              <Input
                value={
                  item.GOODS_QTY !== null && item.GOODS_QTY != undefined
                    ? item.GOODS_QTY.toString()
                    : null
                }
                keyboardType="numeric"
                ref={(ref) => (getRef ? getRef(ref) : null)}
                onChangeText={setItemQty}
                style={{textAlign: 'right', fontSize: 15}}
                placeholder="0"
              />
            </FieldRow>

            {orderType !== ORDER_TYPE_TRANSFER ? (
              <FieldRow iconName="gift" label="แถม">
                <Input
                  value={
                    item.GOODS_FREE !== null && item.GOODS_FREE != undefined
                      ? item.GOODS_FREE.toString()
                      : null
                  }
                  keyboardType="numeric"
                  onChangeText={setItemFree}
                  editable={editableItemFree}
                  style={{textAlign: 'right', fontSize: 15}}
                  placeholder="0"
                />
              </FieldRow>
            ) : null}
          </View>
        </View>

        {/* Pricing Card */}
        {orderType !== ORDER_TYPE_TRANSFER ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AntDesign name="pay-circle-o1" size={16} color={MainTheme.colorSecondary} />
              <Text style={styles.cardHeaderText}>ราคาและส่วนลด</Text>
            </View>

            <View style={styles.cardBody}>
              <FieldRow iconName="tago" label="ราคาต่อหน่วย" labelFlex={0.45}>
                <Input
                  value={
                    item.ARPLU_U_PRC !== null && item.ARPLU_U_PRC != undefined
                      ? parseFloat(item.ARPLU_U_PRC)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : null
                  }
                  keyboardType="numeric"
                  editable={false}
                  style={{textAlign: 'right', fontSize: 15}}
                />
              </FieldRow>

              <FieldRow iconName="disconnect" label="ส่วนลด">
                <Input
                  value={
                    item.GOODS_DISCOUNT !== null &&
                    item.GOODS_DISCOUNT != undefined
                      ? ((item.GOODS_DISCOUNT.toString() == '0' || item.GOODS_DISCOUNT.toString().substring(0, 2) == '0*'
                      ) ? null : item.GOODS_DISCOUNT.toString() )
                      : null
                  }
                  onChangeText={setItemDiscount}
                  keyboardType="numeric"
                  editable={editableItemDiscount}
                  style={{textAlign: 'right', fontSize: 15}}
                  onSubmitEditing={onSubmitEditing}
                  placeholder="0"
                />
              </FieldRow>
            </View>

            {/* Summary Section */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>ยอดส่วนลด</Text>
                <Text style={styles.summaryValue}>
                  {item.GOODS_TOTAL_DISCOUNT !== null &&
                  item.GOODS_TOTAL_DISCOUNT != undefined
                    ? parseFloat(item.GOODS_TOTAL_DISCOUNT)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : '0.00'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>จำนวนเงิน</Text>
                <Text style={styles.totalValue}>
                  {item.GOODS_TOTAL_PRC !== null &&
                  item.GOODS_TOTAL_PRC != undefined
                    ? parseFloat(item.GOODS_TOTAL_PRC)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : '0.00'}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
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
    backgroundColor: '#F4F6F8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MainTheme.colorPrimary,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cardHeaderText: {
    color: MainTheme.colorSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  labelContainer: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: 6,
  },
  labelText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  fieldContent: {
    flex: 0.7,
  },
  inputBase: {
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: '#333',
  },
  inputEditable: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E0E4E8',
  },
  inputReadOnly: {
    backgroundColor: '#F0F2F4',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    color: '#666',
  },
  codeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanIcon: {
    marginLeft: 8,
    padding: 4,
  },
  productNameText: {
    color: '#333',
    fontSize: 15,
    paddingVertical: 8,
    fontWeight: '500',
  },
  summarySection: {
    backgroundColor: MainTheme.colorSeptenary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EDE9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#C8D8CC',
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 15,
    color: MainTheme.colorQuaternary,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    color: MainTheme.colorQuaternary,
    fontWeight: '700',
  },
  messageBox: {
    
    marginHorizontal: 15,
    marginVertical: 5,
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
