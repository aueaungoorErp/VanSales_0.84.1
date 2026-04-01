import React from 'react'
import { Alert, Image, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import { MainTheme, settingListItems } from '../../../constant/lov'
import { strings } from '../../../locales/i18n'
import Navigator from '../../../services/Navigator'
import Request from '../../../utils/Request'
import {
    getSettingConfig,
    removeLoginGuID,
    removeLoginInfo,
    removeUserToken,
    setAccessTimeToken,
    setSettingConfig,
} from '../../../utils/Token'
import ListItems from '../presenter/ListItems'

import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
class CTListItems extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            config: null
        }
        
        this._checkPermission()

        this._getSettingConfig()
    }

    _checkPermission = async () => {
        permissions = [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            
        ]
    
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple(permissions)
        }
    }

    _getSettingConfig = async () => {
        const config = await getSettingConfig()

        if (config) {
            this.setState(oldState => {
                return { 
                    config: config
                }
            })
        }
    } 

    _header = () => {
        return (
            <View style={itemStyles.headerContainer}>
                <AntDesign name="setting" size={24} color={MainTheme.colorPrimary} />
                <Text style={itemStyles.headerText} allowFontScaling={false}>การตั้งค่า</Text>
            </View>
        )
    }

    _getFormattedBaseUrl = () => {
        const rawBaseUrl = this.state.config?.baseUrl

        if (!rawBaseUrl) {
            return null
        }

        if (/^https?:\/\//i.test(rawBaseUrl)) {
            return rawBaseUrl
        }

        return `http://${rawBaseUrl}`
    }

    _getDisplayTitle = (item) => {
        if (item.title === 'ปริ้นเตอร์' || item.title === 'printer') {
            return 'ปริ้นเตอร์'
        }

        if (item.iconName === 'server') {
            const formattedBaseUrl = this._getFormattedBaseUrl()
            return formattedBaseUrl ? `${item.title} ${formattedBaseUrl}` : item.title
        }

        return item.title
    }

    _renderItem = ({ item }, key) => {
        if (item.title === 'ปริ้นเตอร์' || item.title === 'printer') {
            return this._renderCustomPattern(item)
        } if (item.title === 'คู่มือการใช้งาน' || item.title === 'คำถามที่พบบ่อย' || item.title === 'ออกจากระบบ') {
            return this._renderImagePattern(item)
        } else {
            return this._renderDefaultPattern(item)
        }
    }

    _renderDefaultPattern = (item) => {
        return (
            <TouchableOpacity style={itemStyles.row} onPress={() => this._onPress(item)} activeOpacity={0.6}>
                <View style={itemStyles.iconContainer}>
                    {item.iconName ===  'server' ?<MaterialDesignIcons name={item.iconName} color={MainTheme.colorPrimary} size={22} /> : <AntDesign name={item.iconName} size={22} color={MainTheme.colorPrimary} />  }
                   
                </View>
                <View style={itemStyles.textContainer}>
                    <Text style={itemStyles.title} allowFontScaling={false}>
                        {this._getDisplayTitle(item)}
                    </Text>
                </View>
                <AntDesign name="right" size={14} color="#ccc" />
            </TouchableOpacity>
        )
    }

    _renderImagePattern = (item) => {
        return (
            <TouchableOpacity style={itemStyles.row} onPress={() => this._onPress(item)} activeOpacity={0.6}>
                <View style={itemStyles.iconContainer}>
                    {item.imgSrc ? (
                        <Image style={{width: 28, height: 28}} resizeMode='contain' source={item.imgSrc} />
                    ) : (
                        <AntDesign name={item.iconName} size={22} color={MainTheme.colorPrimary} />
                    )}
                </View>
                <View style={itemStyles.textContainer}>
                    <Text style={itemStyles.title} allowFontScaling={false}>{item.title}</Text>
                </View>
                <AntDesign name="right" size={14} color="#ccc" />
            </TouchableOpacity>
        )
    }

    _renderCustomPattern = (item) => {
        const isPDF = this.props.bluetooth.printingType === 'PDF'
        const isConnected = this.props.bluetooth && this.props.bluetooth.state === 'connected'

        return (
            <TouchableOpacity style={itemStyles.row} onPress={() => this._onPress(item)} activeOpacity={0.6}>
                <View style={itemStyles.iconContainer}>
                    {isPDF ? (
                        <FontAwesome5 name='file-pdf' color={MainTheme.colorPrimary} size={20} solid />
                    ) : (
                        <Image style={{width: 25, height: 25}} resizeMode='contain' source={isConnected ? item.imgSrc : item.subImgSrc} />
                    )}
                </View>
                <View style={itemStyles.textContainer}>
                    <Text style={itemStyles.title} allowFontScaling={false}>{isPDF ? 'PDF' : this._getDisplayTitle(item)}</Text>
                    <Text style={[itemStyles.subtitle, {color: isConnected ? MainTheme.colorPrimary : '#E74C3C'}]}>
                        {isPDF ? 'พิมพ์เป็น PDF' : isConnected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}
                    </Text>
                </View>
                <AntDesign name="right" size={14} color="#ccc" />
            </TouchableOpacity>
        )
    }

    _onPress = async (item) => {
        if (item.methodType === 'new-page') {
            Navigator.navigate(item.screen, item.params)
        } else if (item.methodType === 'function') {
            if (item.methodName === 'logout') {
                this._confirmAlertDialog(item)
            } else if (item.methodName === 'syncUserConfig') {
                Navigator.navigate('Splash')
            }
        }
    }
    
    _confirmAlertDialog = (item) => Alert.alert(
        strings('announce.title_msg'),
        strings('announce.logout_msg'),
        [
            {text: strings('announce.cancel'), onPress: () => {}, style: 'cancel'},
            {text: strings('announce.confirm'), onPress: () => this._logout(item)}
        ],
        { cancelable: false }
    )
    
    _logout = async (item) => {
        const settingConfig = await getSettingConfig()

        await removeUserToken()
        await removeLoginInfo()
        await removeLoginGuID()
        await setAccessTimeToken('0')

        if (settingConfig) {
            await setSettingConfig({
                ...settingConfig,
                USER_CODE: null,
                USER_PASSWORD: null,
                SALESMAN: null,
            })
        }

        Request.removeAllHeaders()
        Navigator.reset(item.screen || 'Auth', { screen: 'Login' })
    }

    

    render() {
        return (
            <ListItems header={this._header} listItems={settingListItems} renderItem={this._renderItem}/>
        )
    }
}

const itemStyles = StyleSheet.create({
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
        fontSize: hp('2.2%'),
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
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F0FAF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    title: {
        fontSize: hp('1.8%'),
        color: '#333',
        fontWeight: '500',
    },
    subtitle: {
        fontSize: hp('1.4%'),
        marginTop: 2,
    },
})

const mapStateToProps = (state) => ({
    bluetooth: state.bluetooth
})

const mapDispatchToProps = (dispatch) => {
    return {
        
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems)