import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { ListItem, Button } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { MainTheme } from '../../../constant/lov'
import { setItem } from '../../../action/bluetooth'
import ListItems from '../presenter/ListItems'

const CTListItem = (props) => {

	const _onChooseBluetooth = (item) => {
        props.setItem(item)
	}
	
	const _renderItem = ({ item }) => (
        <ListItem
            title={
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{item.name}</Text>
                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{item.address}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
                    <Button
                        buttonStyle={{ backgroundColor: MainTheme.colorPrimary, borderRadius: 3, paddingHorizontal: 10 }}
                        title='เลือก'
                        titleStyle={{ fontSize: hp('1.7%') }}
                        onPress={() => {_onChooseBluetooth(item)}} />
                </View>
            </View>
            }
            titleNumberOfLines={1}
            leftIcon={{ name: 'bluetooth', type: 'foundation', color: MainTheme.colorPrimary }}
            hideChevron
            bottomDivider />
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

