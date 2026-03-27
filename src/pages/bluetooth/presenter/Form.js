import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {Button} from 'react-native-elements';
import {MainTheme} from '../../../constant/lov';
import ITextInputWithLabel from '../../../component/input/ITextInputWithLabel';
import IPickerSelectWithLabel from '../../../component/input/IPickerSelectWithLabel';
import {ProgressDialog, ConfirmDialog} from 'react-native-simple-dialogs';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Form = (props) => {
  const {
    bluetooth,
    setModel,
    getBluetoothList,
    connect,
    disConnect,
    testPrinter,
    clearAll,
    setState,
    printingType,
    setPrintingType,
  } = props;
  console.log('BLUTOOTH2');
  return (
    <View style={styles.container}>
      <CheckBox
        title="PDF"
        checked={printingType !== 'BLUETOOTH'}
        checkedColor={MainTheme.colorTertiary}
        containerStyle={{
          backgroundColor: MainTheme.colorSecondary,
          borderWidth: 0,
          paddingLeft: 0,
        }}
        onPress={() => setPrintingType('PDF')}
      />
      <CheckBox
        title="Printer"
        checked={printingType === 'BLUETOOTH'}
        checkedColor={MainTheme.colorTertiary}
        containerStyle={{
          backgroundColor: MainTheme.colorSecondary,
          borderWidth: 0,
          paddingLeft: 0,
        }}
        onPress={() => setPrintingType('BLUETOOTH')}
      />

      {printingType === 'BLUETOOTH' ? (
        <View>
          <View style={{padding: 5}}>
            <ITextInputWithLabel
              label="ชื่อบลูทูธ"
              value={bluetooth.item.name}
              editable={false}
            />
            <ITextInputWithLabel
              label="แอดแดรส"
              value={bluetooth.item.address}
              editable={false}
            />

            <IPickerSelectWithLabel
              label="ปริ้นเตอร์"
              items={bluetooth.modelItems}
              selectedValue={bluetooth.model}
              placeholder="เลือก"
              disabled={bluetooth.state === 'connected'}
              onValueChange={(model) => {
                setModel(model);
              }}
            />
          </View>

          <View style={iButtonGroupCustomStyles.container}>
            <Button
              title={'เชื่อมต่อ'}
              buttonStyle={{
                backgroundColor: MainTheme.colorQuaternary,
                height: 60,
                borderRadius: 0,
                borderColor: MainTheme.colorQuaternary,
                borderRightWidth: 0.3,
                elevation: 0,
              }}
              containerStyle={{flex: 1}}
              titleStyle={{
                color: MainTheme.colorSecondary,
                fontSize: hp('1.4%'),
              }}
              disabledStyle={{
                backgroundColor: MainTheme.colorNonary,
                borderRadius: 0,
              }}
              onPress={() => {
                connect();
              }}
              disabled={bluetooth.state === 'connected'}
            />

            <Button
              title={'ยกเลิก'}
              buttonStyle={{
                backgroundColor: MainTheme.colorSeptenary,
                height: 60,
                borderRadius: 0,
                borderColor: MainTheme.colorQuaternary,
                borderRightWidth: 0.3,
                elevation: 0,
              }}
              containerStyle={{flex: 1}}
              titleStyle={{color: MainTheme.colorSenary, fontSize: hp('1.4%')}}
              disabledStyle={{
                backgroundColor: MainTheme.colorNonary,
                borderRadius: 0,
              }}
              onPress={() => {
                disConnect();
              }}
              disabled={bluetooth.state !== 'connected'}
            />

            <Button
              title={'พิมพ์'}
              buttonStyle={{
                backgroundColor: MainTheme.colorSeptenary,
                height: 60,
                borderRadius: 0,
                borderColor: MainTheme.colorQuaternary,
                borderRightWidth: 0.3,
                elevation: 0,
              }}
              containerStyle={{flex: 1}}
              titleStyle={{color: MainTheme.colorSenary, fontSize: hp('1.4%')}}
              onPress={() => {
                testPrinter();
              }}
              disabled={bluetooth.state !== 'connected'}
              disabledStyle={{
                backgroundColor: MainTheme.colorNonary,
                borderRadius: 0,
              }}
            />

            <Button
              title={'รีเฟรช'}
              buttonStyle={{
                backgroundColor: MainTheme.colorSeptenary,
                height: 60,
                borderRadius: 0,
                borderColor: MainTheme.colorQuaternary,
                borderRightWidth: 0.3,
                elevation: 0,
              }}
              containerStyle={{flex: 1}}
              titleStyle={{color: MainTheme.colorSenary, fontSize: hp('1.4%')}}
              onPress={() => {
                getBluetoothList();
              }}
            />

            <Button
              title={'ล้าง'}
              buttonStyle={{
                backgroundColor: MainTheme.colorSeptenary,
                height: 60,
                borderRadius: 0,
                borderColor: MainTheme.colorQuaternary,
                borderRightWidth: 0.3,
                elevation: 0,
              }}
              containerStyle={{flex: 1}}
              titleStyle={{color: MainTheme.colorSenary, fontSize: hp('1.4%')}}
              disabled={bluetooth.state === 'connected'}
              disabledStyle={{
                backgroundColor: MainTheme.colorNonary,
                borderRadius: 0,
              }}
              onPress={() => {
                clearAll();
              }}
            />
          </View>

          <ProgressDialog
            visible={bluetooth.state === 'connecting'}
            message={bluetooth.state !== null ? bluetooth.state : ''}
            animationType={'fade'}
            dialogStyle={{borderRadius: 5}}
          />

          <ConfirmDialog
            title="เกิดข้อผิดพลาด"
            visible={bluetooth.state === 'connect failed'}
            // onTouchOutside={() => setState(null)}
            positiveButton={{
              title: 'ตกลง',
              titleStyle: {color: '#000000'},
              onPress: () => setState(null),
            }}
            animationType={'fade'}
            dialogStyle={{borderRadius: 5}}>
            <View>
              <Text>{bluetooth.state !== null ? bluetooth.state : ''}</Text>
            </View>
          </ConfirmDialog>
        </View>
      ) : null}

      {/* <Overlay 
                visible={
                    bluetooth.state === 'connecting'|| 
                    bluetooth.state === 'connect failed'
                }
                closeOnTouchOutside 
                animationType="zoomIn"
                containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                childrenWrapperStyle={{backgroundColor: '#eee'}}
                animationDuration={500}
                onClose={() => {
                    setState(null)
                }}>
                <Text>{bluetooth.state}</Text>
            </Overlay> */}
    </View>
  );
};

export default Form;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: MainTheme.colorSecondary,
  },
  iconGroupContainer: {
    height: 60,
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-evenly',
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
