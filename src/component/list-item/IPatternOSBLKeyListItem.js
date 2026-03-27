import _ from 'lodash'
import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { ListItem } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { MainTheme, mainDivider } from '../../constant/lov'

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

class IPatternOSBLKeyListItem extends React.Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate = async (nextProps, nextState) => {

        if (!_.isEqual(nextProps.item, this.props.item)) {
            return true
        }   

        return false
    }

    render() {
        const { item, index, setVPDPay } = this.props

        return (
            <ListItem
                title={
                    <View style={{flexDirection: 'row'}} >
                        <Text style={{ flex: 1, marginLeft: 5, alignSelf: 'center', fontSize: hp('1.7%') }} allowFontScaling={false} >{item.VPD_DIREF}</Text>
                        <Text style={{ flex: 1, marginLeft: 5, alignSelf: 'center', textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >{item.VPD_OUTSTANDING.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                        <Item regular style={{flex: 1, marginLeft: 5}}>
                            <Input 
                                style={{ 
                                    fontSize: hp('1.6%'), 
                                    textAlign: 'right', 
                                    height: 35, 
                                    paddingBottom: 8, 
                                    backgroundColor: item.VPD_PAY >= 0 ? MainTheme.colorSecondary : '#D1D0CE'
                                }}
                                value={item.VPD_PAY !== 0 ? item.VPD_PAY.toString() : null}
                                keyboardType='numeric'
                                onChangeText={(value) => { setVPDPay(item, index, value)}}
                                editable={item.VPD_PAY >= 0}
                                 />
                        </Item>
                    </View>
                }
                containerStyle={[{ backgroundColor: MainTheme.colorSecondary }, mainDivider]}
                bottomDivider
                titleNumberOfLines={1} /> 
        )
    }
}

export default IPatternOSBLKeyListItem