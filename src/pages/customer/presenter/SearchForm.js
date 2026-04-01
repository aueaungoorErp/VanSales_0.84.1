import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ISearchBar from '../../../component/input/ISearchBar';
import { MainTheme } from '../../../constant/lov';

const SearchForm = (props) => {
  const {
    value,
    onSearch,
    setTextSearch,
    typeItems,
    type,
    setCustomerType,
    onRefresh,
    navigateTo,
    userToken,
  } = props;

  const types = typeItems.map((item) => ({
    label: item.ARCAT_NAME,
    value: item.ARCAT_KEY ? item.ARCAT_KEY : '',
  }));

  // console.log("userToken.VANCONFIG >> " , userToken.VANCONFIG )
  //ดึงข้อมูลลูกค้า ตาม VAN_CNF VANCNF_AR_LIMIT โดย ค่า1 คือตามสายลูกค้า, ค่า 2 คือตามสายเดินรถ


  return (
    <View style={styles.container}>
     

      {userToken.VANCONFIG.VANCNF_AR_LIMIT != 2 ? (
        <View style={styles.typePickerSection}>
          <RNPickerSelect
            items={types}
            onValueChange={(value) => {
              console.log(value);
              setCustomerType ? setCustomerType(value) : null;
            }}
            style={{
              iconContainer: styles.typePickerIcon,
              inputAndroid: styles.typePickerInput,
              inputIOS: styles.typePickerInput,
            }}
            value={type}
            placeholder={{}}
            useNativeAndroidPickerStyle={false}
            textInputProps={{underlineColorAndroid: 'transparent'}}
            Icon={() => {
              return (
                <AntDesign
                  name="down"
                  size={28}
                  color={MainTheme.colorPrimary}
                />
              );
            }}
          />
        </View>
      ) : null}

      <View style={styles.searchRow}>
        {userToken.VANCONFIG.VANCNF_AR_LIMIT != 2 ? (
          <View style={styles.searchFieldWrap}>
            <ISearchBar
              value={value}
              round={true}
              lightTheme={false}
              placeholder="ลูกค้า"
              returnKeyType="search"
              onChangeText={(value) =>
                setTextSearch ? setTextSearch(value) : null
              }
              onSubmitEditing={() => (onSearch ? onSearch() : null)}
              onClear={() => (setTextSearch ? setTextSearch(null) : null)}
              style={{
                containerStyle: styles.searchBarContainer,
                inputContainerStyle: styles.searchBarInputContainer,
                inputStyle: styles.searchBarInput,
              }}
            />
          </View>
        ) : null}

        {userToken.VANCONFIG.VANCNF_AR_LIMIT != 2 ? (
          <TouchableOpacity
            onPress={() => {
              onSearch ? onSearch() : null;
            }}
            style={styles.iconButton}>
            <AntDesign
              name="search1"
              size={22}
              color={MainTheme.colorQuaternary}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            onRefresh ? onRefresh() : null;
          }}
          style={styles.iconButton}>
          <AntDesign
            name="sync"
            size={22}
            color={MainTheme.colorTertiary}
          />
        </TouchableOpacity>

        {
         
        }
        {userToken.VANCONFIG.VANCNF_AR_LIMIT == 2 ? (
          <TouchableOpacity
            onPress={() => {
              navigateTo ? navigateTo('CustomerDestination') : null;
            }}
            style={styles.iconButton}>
            <AntDesign
              name="sync"
              size={22}
              color={MainTheme.colorTertiary}
            />
          </TouchableOpacity>
        ) : null}
{/* //ดึงข้อมูลลูกค้า ตาม VAN_CNF VANCNF_AR_LIMIT โดย ค่า1 คือตามสายลูกค้า, ค่า 2 คือตามสายเดินรถ */}
        {userToken.VANCONFIG.VANCNF_AR_LIMIT == 1 ? (
          <TouchableOpacity
            onPress={() => { navigateTo ? navigateTo('CustomerRouteMapLine') : null }}
            style={styles.iconButton} >
            <AntDesign name='fork' size={22} color={MainTheme.colorTertiary} />
          </TouchableOpacity>
        ) :  <TouchableOpacity
            onPress={() => { navigateTo ? navigateTo('CustomerRouteMapLine2') : null }}
            style={styles.iconButton} >
            <AntDesign name='fork' size={22} color={MainTheme.colorTertiary} />
          </TouchableOpacity> }
     
     </View>
      <View style={styles.bottomDivider}></View>
    </View>
  );
};

export default SearchForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MainTheme.colorQuaternary,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  typePickerSection: {
    borderWidth: 1,
    borderColor: '#D7DFE5',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#F9FBFA',
  },
  typePickerIcon: {
    top: 10,
    right: 6,
  },
  typePickerInput: {
    color: '#000000',
    paddingRight: 30,
    paddingVertical: 12,
    fontSize: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchFieldWrap: {
    flex: 1,
  },
  searchBarContainer: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  searchBarInputContainer: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#D7DFE5',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  searchBarInput: {
    fontSize: 14,
    color: '#111827',
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
  bottomDivider: {
    borderBottomWidth: 0.5,
    width: '100%',
    borderColor: MainTheme.colorButtonBorder,
    marginTop: 10,
  },
  searchSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
});
