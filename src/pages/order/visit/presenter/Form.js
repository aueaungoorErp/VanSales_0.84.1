import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MainTheme } from '../../../../constant/lov';

const Item = ({children, style}) => <View style={style}>{children}</View>;

const Form = (props) => {
  const {vanVitRListItems, vanVitRItem, setVanVitRItem} = props;

  const items = vanVitRListItems.map((value) => ({
    label: value.VANVISR_T_NAME,
    value: value.VANVISR_KEY.toString(),
  }));

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Item style={{flex: 0.2, borderBottomWidth: 0}}>
          <Text style={{fontSize: hp('1.7%')}} allowFontScaling={false}>
            เหตุผล
          </Text>
        </Item>
        <View
          style={{flex: 0.8, borderColor: '#d6d7da', borderBottomWidth: 0.5}}>
          <RNPickerSelect
            items={items}
            onValueChange={(value) => {
              setVanVitRItem ? setVanVitRItem(value) : null;
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
            value={vanVitRItem}
            placeholder={{label: 'เลือกเหตุผล', value: null}}
            textInputProps={{underlineColorAndroid: 'cyan', underlineColor: 'yellow'}}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return (
                <AntDesign
                  name="down"
                  size={25}
                  style={{color: MainTheme.colorPrimary}}
                />
              );
            }}
          />
        </View>
      </View>
      {/* <IPickerSelectWithLabel 
                label='เหตุผล' 
                selectedValue={vanVitRItem}
                placeholder='เลือกเหตุผล' 
                items={items}
                onValueChange={(value) => { setVanVitRItem ? setVanVitRItem(value) : null }} /> */}
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  messageBox: {
    marginTop: 15,
  },
});
