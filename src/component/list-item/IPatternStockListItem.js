import _ from 'lodash'
import React, { Component } from 'react'
import { Alert, Text, TextInput, View } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { mainDivider, MainTheme } from '../../constant/lov'

const Item = ({ children, style }) => <View style={style}>{children}</View>

const Input = React.forwardRef(({ value, style, ...props }, ref) => (
    <TextInput
        ref={ref}
        value={value === null || value === undefined ? '' : String(value)}
        style={style}
        underlineColorAndroid="transparent"
        {...props}
    />
))

class IPatternStockListItem extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            item: null
        }
    }


    componentDidMount() {
        this._isMounted = true
        this._setState('item', this.props.item)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (!_.isEqual(nextProps.item, this.props.item)) {
            await this._setState('item', nextProps.item)
            return true
        }   

        return false
    }
    
    _setState = async (key, value) =>  {
        this._isMounted && 
        await this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }
    
    _removeAlertDialog = (index) => Alert.alert(
        'ประกาศ',
        'คุณต้องการลบข้อมูลสินค้าทั้งหมด?',
        [
            {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
            {text: 'ยืนยัน', onPress: () => this.props.removeProductItem(index)}
        ],
        { cancelable: false }
    )

    render() {
        const { item, index, setStockBalance } = this.props
    
        return (
            <ListItem
                title={
                    <View style={{flexDirection: 'row'}} >
                        <Text style={{ width: 150, marginLeft: 5, marginTop: 10, fontSize: hp('1.7%') }} allowFontScaling={false} >{item.VTRD_NAMES}</Text>
                        <Text style={{ width: 100, marginLeft: 5, marginTop: 10, textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >{item.VTRD_UTQ_NAME}</Text>
                        <Text style={{ width: 100, marginLeft: 5, marginTop: 10, textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >{item.VTRD_QTY}</Text>
                        <Item regular style={{ width: 100, marginLeft: 5, textAlign: 'right'}} >
                            <Input 
                                // style={{ textAlign: 'right', fontSize: hp('1.5%') }}
                                style={{ fontSize: hp('1.3%'), textAlign: 'right', height: 35, paddingBottom: 8 }}
                                value={
                                    this.state.item !== undefined && 
                                    this.state.item !== null && 
                                    this.state.item.CAS_QTY !== undefined && 
                                    this.state.item.CAS_QTY !== null && 
                                    this.state.item.CAS_QTY !== 0
                                    ? this.state.item.CAS_QTY.toString() : null
                                }
                                keyboardType='numeric'
                                onChangeText={(value) => {setStockBalance(item, index, value)}} />
                        </Item>
                        <Text style={{ width: 100, marginLeft: 5, marginTop: 10, textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >{item.DIFFERENCE}</Text>
                        <Text style={{ width: 100, marginLeft: 5, marginTop: 10, textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >{item.VTRD_CODE}</Text>
                        <View style={{ width: 50, justifyContent: 'center' }} >
                            <Icon
                                name='trash-o'
                                type='font-awesome'
                                color={MainTheme.colorPrimary}
                                size={30}
                                onPress={() => this._removeAlertDialog(index)} />
                        </View>
                    </View>
                }
                titleNumberOfLines={1}
                hideChevron
                containerStyle={mainDivider}
                bottomDivider />
        )
        
    }

}

export default IPatternStockListItem