import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { ListItem } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import ListItems from '../presenter/ListItems'
import { MainTheme } from '../../../../../constant/lov'
import { setPrePocessListItems } from '../../../../../action/outstanding-balance'
import IPatternOSBLKeyListItem from '../../../../../component/list-item/IPatternOSBLKeyListItem'
import { customCheckChar } from '../../../../../utils/FormatUtil'

class CTListItems extends React.Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            errorMessage: null,
            dialogMessage: null
        }
    }

    componentDidMount = (props) => {
        this._isMounted = true
    }
    
    componentWillUnmount = (props) => {
        this._isMounted = false
    }

    _header = () => {
        return (
            <ListItem
                title={
                    <View style={{flexDirection: 'row'}} >
                        <Text style={{ flex: 1, marginLeft: 5, alignSelf: 'center', fontSize: hp('1.7%') }} allowFontScaling={false} >เลขที่</Text>
                        <Text style={{ flex: 1, marginLeft: 5, alignSelf: 'center', textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >ยอดค้างชำระ</Text>
                        <Text style={{ flex: 1, marginLeft: 5, alignSelf: 'center', fontSize: hp('1.7%') }} allowFontScaling={false} >จำนวนที่ต้องการชำระ</Text>
                    </View>
                }
                containerStyle={{backgroundColor: MainTheme.colorPrimary}}
                titleNumberOfLines={1} /> 
        )
    }

    _renderItem = ({ item, index }) => {
        
        return (
           <IPatternOSBLKeyListItem item={item} index={index} setVPDPay={this._setVPDPay}  />
        )
    }

    _setState = (key, value) => {
        this._isMounted &&
        this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    _setVPDPay =  async (item, index, value) => {
        const { listItems } = this.props.outstandingBalance.preProcess

        item = {
            ...item,
            VPD_PAY: customCheckChar('0123456789.', value)
        }

        listItems[index] = item

        await this.props.setPrePocessListItems(listItems)
    }

    render() {
        
        return (
            <ListItems 
                header={this._header}
                listItems={this.props.outstandingBalance.preProcess.listItems}
                renderItem={this._renderItem}
                errorMessage={this.state.errorMessage} />
        )
    }

}

const mapStateToProps = (state) => ({
    outstandingBalance: state.outstandingBalance
})

const mapDispatchToProps = (dispatch) => {
    return {
        setPrePocessListItems: (items) => dispatch(setPrePocessListItems(items))
     }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems)