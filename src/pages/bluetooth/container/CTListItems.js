import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { setItem } from '../../../action/bluetooth'
import { MainTheme } from '../../../constant/lov'
import ListItems from '../presenter/ListItems'

const CTListItem = (props) => {

	const _onChooseBluetooth = (item) => {
        props.setItem(item)
	}
	
	const _renderItem = ({ item }) => (
        <View style={{paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#e1e8ee'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{item.name}</Text>
                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{item.address}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
                    <TouchableOpacity
                        style={{ backgroundColor: MainTheme.colorPrimary, borderRadius: 3, paddingHorizontal: 10, paddingVertical: 8 }}
                        onPress={() => {_onChooseBluetooth(item)}}
                        activeOpacity={0.7}>
                        <Text style={{ fontSize: hp('1.7%'), color: '#fff' }}>เลือก</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

	return (
        <ListItems 
            printingType={props.bluetooth.printingType}
			items={props.bluetooth.listItems}
			renderItem={_renderItem} />
	)
}

const mapStateToProps = (state) => ({
    bluetooth: state.bluetooth
})

const mapDispatchToProps = (dispatch) => {
    return {
		setItem: (item) => {
			dispatch(setItem(item))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTListItem)

