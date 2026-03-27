import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { ListItem } from 'react-native-elements'
import DetailListItems from '../presenter/DetailListItems'
import { MainTheme, mainDivider } from '../../../constant/lov'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

class CTDetailListItems extends React.Component {
    _isMounted = false

    constructor(props) {
        super(props)
    }

    componentDidMount = async (props) => {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    _renderItem = ({ item, index }) => {
        return (
            <ListItem
                title={
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 0.5}}>
                            {
                                this.props.campaignType.item.CPGNT_CODE === '169' ? 
                                <View>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >รหัสสินค้า {item.ITEM_SKU_CODE}</Text>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ชื้อสินค้า {item.ITEM_SKU_NAME}</Text>
                                </View> 
                                : null
                            }

                            {
                                this.props.campaignType.item.CPGNT_CODE === '170' ? 
                                <View>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >รหัสทดแทน {item.ITEM_ALT_CODE}</Text>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ชื้อทดแทน {item.ITEM_ALT_NAME}</Text>
                                </View> 
                                : null
                            }

                            {
                                this.props.campaignType.item.CPGNT_CODE === '172' ? 
                                <View>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >รหัสทดแทน {item.ITEM_ALT_CODE}</Text>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ชื้อทดแทน {item.ITEM_ALT_NAME}</Text>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >รหัสสินค้า {item.ITEM_SKU_CODE}</Text>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ชื้อสินค้า {item.ITEM_SKU_NAME}</Text>
                                </View> 
                                : null
                            }
                        </View>
                        <View style={{ flex: 0.5, borderLeftWidth: 1, borderColor: MainTheme.colorNonary, paddingHorizontal: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >จำนวนซื้อ</Text>
                                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{item.ITEM_Q_BUY}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >จำนวนแถม</Text>
                                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{item.ITEM_Q_FREE}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ลดต่อจำนวน</Text>
                                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{item.ITEM_Q_DISC}</Text>
                            </View>
                        </View>
                    </View>
                }
                titleNumberOfLines={1}
                leftIcon={{name: item.icon, type: item.type}}
                containerStyle={mainDivider}
                bottomDivider />
        )
    }

    render() {
        return (
            <DetailListItems 
                renderItem={this._renderItem}
                listItems={this.props.campaign.listItems}/>
        )
    }
}

const mapStateToProps = (state) => ({
    campaign: state.campaign,
    campaignType: state.campaignType
})

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTDetailListItems)