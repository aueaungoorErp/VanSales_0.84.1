import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ISearchBar from '../../../component/input/ISearchBar';
import { MainTheme } from '../../../constant/lov';

const Form = ({ style, children }) => <View style={style}>{children}</View>;

const Item = ({ style, children }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
);

const SearchForm = (props) => {
  const {
    value,
    onSearch,
    setTextSearch,
    categoryItems,
    category,
    setProductCategory,
    onRefresh,
    hasBarcodeScan,
    onScanBarcodePress,
    actionType,
  } = props;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Item
          style={{
            flex: 1,
            borderWidth: 1,
            height: 35,
            marginLeft: 5,
            marginRight: 5,
          }}>
          <Form style={styles.form}>
            <Picker
              style={styles.picker}
              selectedValue={category}
              onValueChange={(value) => {
                setProductCategory ? setProductCategory(value) : null;
              }}>
              {categoryItems.map((item, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={item.ICDEPT_THAIDESC}
                    value={item.ICDEPT_KEY}
                  />
                );
              })}
            </Picker>
          </Form>
        </Item>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ flex: 0.8 }}>
          <ISearchBar
            value={value}
            round={true}
            lightTheme={false}
            placeholder={
              actionType !== 'add_scr' ? 'รหัส, ชื่อสินค้า' : 'ค้นหาประเภททดแทน'
            }
            returnKeyType="search"
            onChangeText={(value) =>
              setTextSearch ? setTextSearch(value) : null
            }
            onSubmitEditing={() => (onSearch ? onSearch() : null)}
            onClear={() => {
              setTextSearch ? setTextSearch(null) : null;
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            onSearch ? onSearch() : null;
          }}
          style={{ flex: 0.1, height: 35 }}>
          <AntDesign name="search1" size={20} color={MainTheme.colorQuaternary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onRefresh ? onRefresh() : null;
          }}
          style={{ flex: 0.1, height: 35 }}>
          <Entypo name="cycle" size={20} color={MainTheme.colorTertiary} />
        </TouchableOpacity>

        {hasBarcodeScan ? (
          <TouchableOpacity
            onPress={() => (onScanBarcodePress ? onScanBarcodePress() : null)}
            style={{ flex: 0.1, height: 35 }}>
            <MaterialCommunityIcons name="barcode-scan" size={20} color={MainTheme.colorTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View
        style={{
          borderBottomWidth: 0.5,
          width: '100%',
          borderColor: MainTheme.colorButtonBorder,
        }}></View>
    </View>
  );
};

export default SearchForm;

const styles = StyleSheet.create({
  container: {},
  form: {
    margin: 2,
    padding: 0,
    flexDirection: 'row',
  },
  // inputSection: {
  //   flex: 0.8
  // },
  // pickerContainer: {
  //   flex: 0.8
  // },
  picker: {
    height: 30,
    marginLeft: 0,
  },
});
