import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { MainTheme, MOBILE5INCH } from '../../../constant/lov'
import { strings } from '../../../locales/i18n'

const margin = Dimensions.get('window').width > MOBILE5INCH ? 20 : 10

const Header = (props) => {
    const { userToken } = props
    
    return (
        <View style={styles.container}>
            <Text style={[ styles.title, { fontSize: hp('2.5%'), textAlign: 'center' } ]} allowFontScaling={true} >
                {
                    userToken && 
                    userToken.COMPANYINFO && 
                    userToken.COMPANYINFO.CMPNY_TCOMPANYNAME ? userToken.COMPANYINFO.CMPNY_TCOMPANYNAME : null
                }
            </Text>
            <Text style={[ styles.title, { fontSize: hp('2%'), marginTop: 5, } ]} allowFontScaling={false}>
                {
                    userToken && 
                    userToken.SALESMAN && 
                    userToken.SALESMAN.SLMN_NAME ? userToken.SALESMAN.SLMN_NAME : null
                }
            </Text>
            
            <View 
                style={
                    { 
                        borderBottomWidth: 0.3, 
                        borderColor: MainTheme.colorSecondary, 
                        width: 350, 
                        marginTop: margin, 
                        marginBottom: margin 
                    }
                }>
            </View>

            <Text style={[styles.title, { fontSize: hp('3%') }]} allowFontScaling={false} >
                {strings('user_detail.van_machine')} 
                {
                    userToken && 
                    userToken.USERTAB && 
                    userToken.USERTAB.USER_TH_POSITION ? ' ' + userToken.USERTAB.USER_TH_POSITION : null
                }
                {' ' + (userToken !== null ?  userToken.VANCONFIG != null ? userToken.VANCONFIG.VANCNF_MACHINE : '':'' ) }
            </Text>

            <Text style={[ styles.title, { fontSize: hp('2%') } ]} allowFontScaling={false} >
                {strings('user_detail.car_number')} 
                {
                    userToken && 
                    userToken.VANCONFIG && 
                    userToken.VANCONFIG.VANCNF_REG_NAME ? ' ' + userToken.VANCONFIG.VANCNF_REG_NAME : null
                }
            </Text>
        </View>
    )
    
}

export default Header

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
      color: '#fff'
    }
})