import { Alert } from 'react-native'
import Navigator from '../services/Navigator'
import { BluetoothFinder } from '../module'

export const bluetoothAlertDialog = () => Alert.alert(
    'ประกาศ',
    'เนื่องจากไม่ได้ทำการ Connect printer ต้องการจะไปที่หน้า Bluetooth setting หรือไม่',
    [
        {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
        {text: 'ยืนยัน', onPress: () => goToBluetoothSetting()}
    ],
    { cancelable: false }
)

export const goToBluetoothSetting = () => {
    BluetoothFinder.checkBluetoothEnable((value) => {
        if(value.result) {
          Navigator.navigate('Bluetooth') 
        } 
    })
}