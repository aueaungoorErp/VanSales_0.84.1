import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Alert, Image, PermissionsAndroid, Platform } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Navigator from '../../../services/Navigator'
import { settingListItems, MainTheme } from '../../../constant/lov'
import { removeUserToken, getSettingConfig } from '../../../utils/Token'
import Request from '../../../utils/Request'
import { strings } from '../../../locales/i18n'
import ListItems from '../presenter/ListItems'


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
            <ListItem
                title={
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>การตั้งค่า</Text>
                    </View>
                }
                containerStyle={{backgroundColor: MainTheme.colorSeptenary}}
                leftIcon={{name: 'settings', type: 'material', iconStyle: {color: MainTheme.colorPrimary}, size: 30}}
                bottomDivider >
            </ListItem>
        )
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

    _renderDefaultPattern =  (item) => {

        return (
            <ListItem
                title={
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>{item.title} { item.iconName === 'server' && this.state.config ? this.state.config.baseUrl : null }</Text>
                    </View>
                }
                leftIcon={
                    {
                        name: item.iconName, 
                        type: item.iconType, 
                        iconStyle: item.iconStyle, 
                        size: item.iconSize
                    }
                }
                onPress={() => this._onPress(item)}>
            </ListItem>
        )
    }

    _renderImagePattern = (item) => {
        return (
            <ListItem
                title={
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{ fontSize: hp('2%') }} allowFontScaling={false} >{item.title} { item.iconName === 'server' && this.state.config ? this.state.config.baseUrl : null }</Text>
                    </View>
                }
                leftIcon={
                    <Image
                        style={item.iconStyle}
                        resizeMode='contain'
                        source={item.imgSrc} />
                }
                onPress={() => this._onPress(item)}>
            </ListItem>
        )
    }

    _renderCustomPattern = (item) => {
        return (
            <ListItem
                title={
                    <View style={{flexDirection: 'column'}}>
                        
                        <Text style={{ fontSize: hp('2%') }} allowFontScaling={false} >{this.props.bluetooth.printingType === 'PDF' ? 'PDF' : item.title} { item.iconName === 'server' && this.state.config ? this.state.config.baseUrl : null }</Text>
                    </View>
                }
                leftIcon={
                    this.props.bluetooth.printingType === 'PDF' ?
                    <Icon
                        style={
                            {
                                width: 30, 
                                height: 30, 
                                alignSelf: 'center'
                            }
                        }
                        color={MainTheme.colorPrimary}
                        name='file-pdf'
                        type='material-community' />
                        :
                        <Image
                            style={item.iconStyle}
                            resizeMode='contain'
                            source={this.props.bluetooth && this.props.bluetooth.state === 'connected' ? item.imgSrc : item.subImgSrc} />
                }
                onPress={() => this._onPress(item)}>
            </ListItem>
        )
    }

    _onPress = async (item) => {
        if (item.methodType === 'new-page') {
            // console.log('item', item.params)
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
        const isRemove = await removeUserToken()
        Request.removeAllHeaders()
        isRemove ? Navigator.navigate(item.screen) : null
    }

    

    render() {
        return (
            <ListItems header={this._header} listItems={settingListItems} renderItem={this._renderItem}/>
        )
    }
}

const mapStateToProps = (state) => ({
    bluetooth: state.bluetooth
})

const mapDispatchToProps = (dispatch) => {
    return {
        
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems)