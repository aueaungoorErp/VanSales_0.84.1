import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ISearchBar from '../../../component/input/ISearchBar';
import { MainTheme } from '../../../constant/lov';
import { resolveVectorIconComponent } from '../../../utils/iconFactory';

const Icon = ({type, ...props}) => {
  const IconComponent = resolveVectorIconComponent(
    type,
    resolveVectorIconComponent('AntDesign'),
  );

  return <IconComponent {...props} />;
};

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
        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: MainTheme.colorButtonBorder,
            paddingLeft: 5,
          }}>
          <RNPickerSelect
            items={types}
            onValueChange={(value) => {
              console.log(value);
              setCustomerType ? setCustomerType(value) : null;
            }}
            style={{
              iconContainer: {
                top: 10,
                right: 5,
              },
              inputAndroid: {
                color: '#000000',
              },
            }}
            value={type}
            placeholder={{}}
            textInputProps={{underlineColorAndroid: 'cyan', underlineColor: 'yellow'}}
            Icon={() => {
              return (
                <Icon
                  name="down"
                  type="AntDesign"
                  size={25}
                  style={{color: MainTheme.colorPrimary}}
                />
              );
            }}
          />
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {userToken.VANCONFIG.VANCNF_AR_LIMIT != 2 ? (
          <View style={{flex: 0.7}}>
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
            />
          </View>
        ) : null}

        {userToken.VANCONFIG.VANCNF_AR_LIMIT != 2 ? (
          <TouchableOpacity
            onPress={() => {
              onSearch ? onSearch() : null;
            }}
            style={{flex: 0.1, height: 35, marginTop: 5}}>
            <Icon
              name="search1"
              type="AntDesign"
              style={{color: MainTheme.colorQuaternary}}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            onRefresh ? onRefresh() : null;
          }}
          style={{flex: 0.1, height: 35, marginTop: 5}}>
          <Icon
            name="cycle"
            type="Entypo"
            style={{color: MainTheme.colorTertiary}}
          />
        </TouchableOpacity>

        {
          //</View>userToken.VANCONFIG.VANCNF_AR_LIMIT == 1 ? (

          // <TouchableOpacity
          //   onPress={() => {
          //     navigateTo ? navigateTo('CustomerRouteMap') : null;
          //   }}
          //   style={{flex: 0.1, height: 35, marginTop: 5}}>
          //   <Icon
          //     name="radar"
          //     type="MaterialCommunityIcons"
          //     style={{color: MainTheme.colorTertiary}}
          //   />
          // </TouchableOpacity>
       //) : null
        }
        {userToken.VANCONFIG.VANCNF_AR_LIMIT == 2 ? (
          <TouchableOpacity
            onPress={() => {
              navigateTo ? navigateTo('CustomerDestination') : null;
            }}
            style={{flex: 0.1, height: 35, marginTop: 5}}>
            <Icon
              name="routes"
              type="MaterialCommunityIcons"
              style={{color: MainTheme.colorTertiary}}
            />
          </TouchableOpacity>
        ) : null}
{/* //ดึงข้อมูลลูกค้า ตาม VAN_CNF VANCNF_AR_LIMIT โดย ค่า1 คือตามสายลูกค้า, ค่า 2 คือตามสายเดินรถ */}
        {userToken.VANCONFIG.VANCNF_AR_LIMIT == 1 ? (
          <TouchableOpacity
            onPress={() => { navigateTo ? navigateTo('CustomerRouteMapLine') : null }}
            style={{ flex: 0.1, height: 35, marginTop: 5 }} >
            <Icon name='flow-branch' type='Entypo' style={{ color: MainTheme.colorTertiary }} />
          </TouchableOpacity>
        ) :  <TouchableOpacity
            onPress={() => { navigateTo ? navigateTo('CustomerRouteMapLine2') : null }}
            style={{ flex: 0.1, height: 35, marginTop: 5 }} >
            <Icon name='flow-branch' type='Entypo' style={{ color: MainTheme.colorTertiary }} />
          </TouchableOpacity> }
     
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
  searchSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
});
