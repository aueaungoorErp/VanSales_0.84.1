import { Picker } from '@react-native-picker/picker';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
    isStockSearch,
  } = props;

  const searchPlaceholder =
    actionType !== 'add_scr' ? 'รหัส , ชื่อสินค้า' : 'ค้นหาประเภททดแทน';

  const shouldShowAllOption = !categoryItems.some(
    (item) => item && item.ICDEPT_KEY == null,
  );

  const actionButtons = (
    <>
      <TouchableOpacity onPress={() => {
        onSearch ? onSearch() : null;
      }} style={isStockSearch ? styles.stockIconButtonPrimary : styles.iconButton}>
        <AntDesign
          name="search1"
          size={isStockSearch ? 22 : 20}
          color={isStockSearch ? MainTheme.colorSecondary : MainTheme.colorQuaternary}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        onRefresh ? onRefresh() : null;
      }} style={isStockSearch ? styles.stockIconButton : styles.iconButton}>
        <AntDesign
          name="sync"
          size={isStockSearch ? 22 : 20}
          color={isStockSearch ? MainTheme.colorPrimary : MainTheme.colorTertiary}
        />
      </TouchableOpacity>

      {hasBarcodeScan ? (
        <TouchableOpacity
          onPress={() => (onScanBarcodePress ? onScanBarcodePress() : null)}
          style={isStockSearch ? styles.stockIconButton : styles.iconButton}>
          <MaterialDesignIcons
            name="barcode-scan"
            size={isStockSearch ? 23 : 21}
            color={isStockSearch ? MainTheme.colorPrimary : MainTheme.colorTertiary}
          />
        </TouchableOpacity>
      ) : null}
    </>
  );

  return (
    <View style={[styles.container, isStockSearch ? styles.stockContainer : null]}>
      <View style={isStockSearch ? styles.stockSearchCard : styles.searchCard}>
      <View style={isStockSearch ? styles.stockPickerRow : styles.pickerRow}>
        <Item
          style={isStockSearch ? styles.stockPickerItem : styles.pickerItem}>
          <Form style={isStockSearch ? styles.stockForm : styles.form}>
          
            <Picker
              style={isStockSearch ? styles.stockPicker : styles.picker}
              selectedValue={category}
              dropdownIconColor={isStockSearch ? 'transparent' : MainTheme.colorPrimary}
              onValueChange={(value) => {
                setProductCategory ? setProductCategory(value) : null;
              }}>
              {shouldShowAllOption ? (
                <Picker.Item label="ทั้งหมด" value={null} color="#21312A" />
              ) : null}
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
        style={isStockSearch ? styles.stockSearchRow : styles.searchRow}>
        <View style={isStockSearch ? styles.stockSearchField : styles.searchField}>
          <ISearchBar
            value={value}
            round={true}
            lightTheme={false}
            placeholder={searchPlaceholder}
            returnKeyType="search"
            onChangeText={(value) =>
              setTextSearch ? setTextSearch(value) : null
            }
            onSubmitEditing={() => (onSearch ? onSearch() : null)}
            onClear={() => {
              setTextSearch ? setTextSearch(null) : null;
            }}
            style={isStockSearch ? {
              containerStyle: styles.stockSearchBarContainer,
              inputContainerStyle: styles.stockSearchBarInputContainer,
              inputStyle: styles.stockSearchBarInput,
              searchIconStyle: styles.stockSearchBarSearchIcon,
            } : {
              containerStyle: styles.searchBarContainer,
              inputContainerStyle: styles.searchBarInputContainer,
              inputStyle: styles.searchBarInput,
              searchIconStyle: styles.searchBarSearchIcon,
            }}
          />
        </View>
        {actionButtons}
      </View>

      </View>

      <View
        style={isStockSearch ? styles.stockBottomSpacer : styles.bottomDivider}></View>
    </View>
  );
};

export default SearchForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E1EAE4',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  stockContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: '#F4F8F5',
  },
  stockHeroCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EAF6EF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#D6EAD9',
    marginBottom: 10,
  },
  stockHeroIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: MainTheme.colorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stockHeroCopy: {
    flex: 1,
  },
  stockEyebrow: {
    fontSize: 12,
    color: '#6A8D76',
    fontWeight: '700',
    marginBottom: 2,
  },
  stockTitle: {
    fontSize: 22,
    color: '#1F3B2F',
    fontWeight: '700',
    marginBottom: 4,
  },
  stockSubtitle: {
    fontSize: 13,
    color: '#587060',
    lineHeight: 19,
  },
  stockSearchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E1EAE4',
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  form: {
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockForm: {
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  stockPickerRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  pickerItem: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#DCE6E0',
    borderRadius: 14,
    backgroundColor: '#F8FBF9',
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  pickerLeadingIcon: {
    marginLeft: 4,
    marginRight: 6,
  },
  pickerLabel: {
    fontSize: 13,
    color: '#5E6E66',
    marginRight: 4,
  },
  stockPickerItem: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#DCE6E0',
    borderRadius: 14,
    backgroundColor: '#F8FBF9',
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  stockPickerLeadingIcon: {
    marginLeft: 4,
    marginRight: 2,
  },
  // inputSection: {
  //   flex: 0.8
  // },
  // pickerContainer: {
  //   flex: 0.8
  // },
  picker: {
    height: 50,
    marginLeft: 0,
    flex: 1,
    color: '#21312A',
    marginTop: -2,
  },
  stockPicker: {
    height: 50,
    marginLeft: 0,
    flex: 1,
    color: '#21312A',
    marginTop: -3,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchField: {
    flex: 1,
  },
  searchBarContainer: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  searchBarInputContainer: {
    minHeight: 48,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D7DFE5',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  searchBarSearchIcon: {
    marginHorizontal: 8,
    marginTop: 0,
    alignSelf: 'center',
  },
  searchBarInput: {
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
  },
  stockSearchField: {
    flex: 1,
    marginRight: 8,
  },
  stockSearchBarContainer: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  stockSearchBarInputContainer: {
    minHeight: 48,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D7DFE5',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  stockSearchBarSearchIcon: {
    marginHorizontal: 8,
    marginTop: 0,
    alignSelf: 'center',
  },
  stockSearchBarInput: {
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F7F5',
    borderWidth: 1,
    borderColor: '#D7DFE5',
  },
  stockIconButtonPrimary: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MainTheme.colorPrimary,
    marginLeft: 2,
    marginRight: 6,
  },
  stockIconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F7F5',
    borderWidth: 1,
    borderColor: '#D7DFE5',
    marginLeft: 0,
    marginRight: 6,
  },
  bottomDivider: {
    borderBottomWidth: 0.5,
    width: '100%',
    borderColor: MainTheme.colorButtonBorder,
    marginTop: 10,
  },
  stockBottomSpacer: {
    height: 10,
  },
});
