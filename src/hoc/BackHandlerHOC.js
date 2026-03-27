import React from 'react'
import { Alert } from 'react-native'
import { AndroidBackHandler } from '../component/AndroidBackHandler'
import Navigator from '../services/Navigator'
import Request from '../utils/Request'

const BackHandlerHOC = (Component) => {

    return class App extends React.Component  {
        constructor(props) {
            super(props)
        }

        _onBackButtonPressAndroid = () => {
            const { routes, index } = Navigator.getCurrentRoute()
            const routeName = routes[index].name
            Request.setTimeCutOff()
            
            if (routeName === 'OrderSales' || 
                routeName === 'ProductAddTo' || 
                routeName === 'ProductEditTo' ||
                routeName === 'OrderSalesFinalize') {
                this._alertDialog()
                return true
            }
            
            return false

        }

        _alertDialog = () => Alert.alert(
            'ประกาศ',
            'คุณแน่ใจว่าจะออกจากหน้าจอนี้',
            [
                {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
                {text: 'ยืนยัน', onPress: () => Navigator.back()}
            ],
            { cancelable: false }
        )

        render() {
            return (
                <AndroidBackHandler onBackPress={this._onBackButtonPressAndroid}>
                    <Component {...this.props} />
                </AndroidBackHandler>
            )
        }
    }
}

export default BackHandlerHOC