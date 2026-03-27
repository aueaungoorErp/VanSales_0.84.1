import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { mainContainer } from '../../../constant/lov'

const Item = ({ children, style }) => <View style={style}>{children}</View>

const DetailForm = (props) => {

    const { campaignARCPGNType } = props

    return (
        <View style={{flex: 0.40}}>
            <View style={{flex: 1, padding: 5}}> 
                <View style={{flex: 1, flexDirection: 'row'}} > 
                    <Item  style={{ flex: 1, paddingVertical: 11 }} inlineLabel >
                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >รหัสแคมเปญ </Text>
                        <Text style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{campaignARCPGNType.ARCPGN_CODE}</Text> 
                    </Item>
                </View>
            </View>

            <View style={{flex: 1, padding: 5}}> 
                <View style={{flex: 1, flexDirection: 'row'}} > 
                    <Item style={{ flex: 1, paddingVertical: 11 }} inlineLabel >
                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ชื่อแคมเปญ </Text>
                        <Text style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{campaignARCPGNType.ARCPGN_NAME}</Text> 
                    </Item>
                </View>
            </View>

            <View style={{flex: 1, padding: 5}}>
                <View style={{flex: 1, flexDirection: 'row'}} >  
                    <Item style={{ flex: 0.5, paddingVertical: 11 }} inlineLabel >
                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ช่วงวันที่ </Text>
                        <Text style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{campaignARCPGNType.ARCPGN_FM_DATE}</Text> 
                    </Item>

                    <Item style={{flex: 0.5, paddingVertical: 11 }} inlineLabel >
                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ถึง </Text>
                        <Text style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{campaignARCPGNType.ARCPGN_TO_DATE}</Text> 
                    </Item>
                </View>
            </View>

            <View style={{flex: 1, padding: 5}}>
                <View style={{flex: 1, flexDirection: 'row'}} >  
                    <Item style={{ flex: 0.5, paddingVertical: 11 }} inlineLabel >
                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ช่วงเวลา </Text>
                        <Text style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{campaignARCPGNType.ARCPGN_FM_TIME}</Text> 
                    </Item>

                    <Item  style={{ flex: 0.5, paddingVertical: 11 }} inlineLabel >
                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >ถึง </Text>
                        <Text style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{campaignARCPGNType.ARCPGN_TO_TIME}</Text>
                    </Item>
                </View>
            </View>




            {/* <View style={{flex: 1, padding: 5}}>
                <View style={styles.lineSection}>
                    <Text style={{flex: 0.2}}>วันที่เริ่ม</Text>
                    <Item style={[ {flex: 0.8}, styles.itemSection ]}>
                        <Input 
                            value={'21/05/2562'} 
                            editable={false} />
                    </Item>
                </View>
            </View>
            <View style={{flex: 1, padding: 5}}>
                <View style={styles.lineSection}>
                    <Text style={{flex: 0.2}}>วันที่สิ้นสุด</Text>
                    <Item style={[ {flex: 0.8}, styles.itemSection ]}>
                        <Input 
                            value={'21/06/2562'} 
                            editable={false} />
                    </Item>
                </View>
            </View>
            <View style={{flex: 1, padding: 5}}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{flex: 0.2}}>รายละเอียด</Text>
                    <Form style={[ {flex: 0.8}, styles.itemSection ]}>
                        <Textarea rowSpan={5} bordered placeholder="Textarea" disabled={true} />
                    </Form>
 
                </View>
            </View> */}
        </View>
    )
}

export default DetailForm

const styles = StyleSheet.create({
    container: mainContainer,
    lineSection: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    itemSection: { 
        borderBottomColor: 'black'
    }
})
