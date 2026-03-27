import { View, Text } from 'react-native'
import { ListItem, Icon, Button } from 'react-native-elements'

export const BluetoothItem = ({ item }) => (
    <ListItem
        title={
        <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
                <Text>{item.name}</Text>
                <Text>{item.address}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
            <Button
                icon={{name: 'touch-app', type: 'material' }}
                buttonStyle={{backgroundColor: MainTheme.colorPrimary, borderRadius: 3}}
                title='เชื่อมต่อ'
                onPress={() => {this.onPressBluetoothButton(item.name, item.address)}} />
            </View>
        </View>
        }
        titleNumberOfLines={1}
        leftIcon={{name: 'bluetooth', type: 'material'}}
        hideChevron />

)