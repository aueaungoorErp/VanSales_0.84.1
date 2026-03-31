import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainTheme, manualListItems } from '../../../constant/lov'
import Navigator from '../../../services/Navigator'
import ListItems from '../presenter/ListItems'

const CTListItems = () => {

    const _header = () => {
        return (
            <View style={styles.headerContainer}>
                <Image
                    style={{width: 30, height: 30}}
                    resizeMode='contain'
                    source={require('../../../images/manual.png')} />
                <Text style={styles.headerText} allowFontScaling={false}>คู่มือการใช้งาน</Text>
            </View>
        )
    }

    const _renderItem = ({ item }, key) => {
        return (
            <TouchableOpacity style={styles.row} onPress={() => _onPress(item)} activeOpacity={0.6}>
                <AntDesign name="filetext1" size={18} color={MainTheme.colorPrimary} style={{marginRight: 12}} />
                <Text style={styles.title} allowFontScaling={false}>{item.title}</Text>
                <AntDesign name="right" size={14} color="#ccc" />
            </TouchableOpacity>
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

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: MainTheme.colorSeptenary,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E4E8',
    },
    headerText: {
        fontSize: hp('2%'),
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    title: {
        flex: 1,
        fontSize: hp('1.7%'),
        color: '#333',
    },
})

