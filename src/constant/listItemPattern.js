import { Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

export const BluetoothItem = ({ item }) => (
    <View style={{paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#e1e8ee'}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
            <AntDesign name='bluetooth' size={20} color={MainTheme.colorPrimary} style={{marginRight: 10, alignSelf: 'center'}} />
            <View style={{flex: 1, flexDirection: 'column'}}>
                <Text>{item.name}</Text>
                <Text>{item.address}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
                <TouchableOpacity
                    style={{backgroundColor: MainTheme.colorPrimary, borderRadius: 3, paddingHorizontal: 12, paddingVertical: 8}}
                    onPress={() => {this.onPressBluetoothButton(item.name, item.address)}}
                    activeOpacity={0.7}>
                    <Text style={{color: '#fff'}}>เชื่อมต่อ</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
)