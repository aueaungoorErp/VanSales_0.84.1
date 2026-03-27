import React from 'react'
import { Image, View, Text } from 'react-native'
import { ListItem } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import ListItems from '../presenter/ListItems'
import { mainDivider, MainTheme, manualListItems } from '../../../constant/lov'
import Navigator from '../../../services/Navigator'

const CTListItems = () => {

    const _header = () => {
        return (
            <ListItem
                title={
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >คู่มือการใช้งาน</Text>
                    </View>
                }
                containerStyle={{backgroundColor: MainTheme.colorSeptenary}}
                leftIcon={
                    <Image
                        style={{width: 35, height: 35, alignSelf: 'center'}}
                        resizeMode='contain'
                        source={require('../../../images/manual.png')} />
                }
                bottomDivider >
            </ListItem>
        )
    }

    const _renderItem = ({ item }, key) => {
        return (
            <ListItem
                key={key}
                title={
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{item.title}</Text>
                    </View>
                }
                onPress={() => _onPress(item)}
                containerStyle={mainDivider} >
            </ListItem>
        )
    }

    const _onPress = async (item) => {
        Navigator.navigate('PDFPreview', item)
    }

    return (
        <ListItems 
            header={_header}
            listItems={manualListItems} 
            renderItem={_renderItem}  />
    )
}

export default CTListItems

