import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView from 'react-native-maps'
import RNPickerSelect from 'react-native-picker-select'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IPatternCurrentMarkerItem from '../../../component/item/IPatternCurrentMarkerItem'
import IPatternMarkerItem from '../../../component/item/IPatternMarkerItem'
import IList from '../../../component/list/IList'
import { MainTheme } from '../../../constant/lov'

const Map = (props) => {
    const { 
        focus,
        prevFocus,
        region, 
        style, 
        listItems, 
        getMapInstance, 
        getMarkersInstance, 
        onRegionChangeComplete,
        renderItem,
        focusScale, 
        unFocusScale, 
        focusOpacity, 
        unFocusOpacity,
        errorMessage,
        isLoading,
        setState,
        distance,
        distanceSelectItems,
        searchCustomerNearBy } = props
        
    const _renderCurrentMarker = (item, index) => {
        return (
            <IPatternCurrentMarkerItem 
                item={item} 
                key={index} 
                getMarkersInstance={getMarkersInstance} />
        )
    }

    const _renderMarker = (item, index, opacityStyle, scaleStyle) => {
        return (
            <IPatternMarkerItem 
                item={item} 
                key={index} 
                getMarkersInstance={getMarkersInstance} 
                opacityStyle={opacityStyle}
                scaleStyle={scaleStyle} />
        )
    }

    const listitemRV = listItems.slice(1)
    const validMarkers = listItems.filter((item) => {
        const latitude = item?.coordinate?.latitude
        const longitude = item?.coordinate?.longitude

        return Number.isFinite(latitude) && Number.isFinite(longitude)
    })

    const markerElements = validMarkers.map((marker, index) => {
        const scaleStyle = focus === index || prevFocus === index ?
        {
            transform: [
                {
                    scale: index === focus ? focusScale : unFocusScale,
                }
            ]
        } : {}

        const opacityStyle = focus === index || index === prevFocus ?
        {
            opacity: index === focus ? focusOpacity : unFocusOpacity
        } : { opacity: 0.35 }

        if (marker.currentLocation) {
            return _renderCurrentMarker(marker, index)
        }

        return _renderMarker(marker, index, opacityStyle, scaleStyle)
    })

    return (
        <View style={{ flex: 1 }} >
            
            <View style={{ flex: 0.5}}>
                <View 
                    style={[
                        styles.container, 
                        { 
                            width: '100%', 
                            height: '100%'
                        }, 
                        style && style.container ? style.container : null
                    ]}> 

                    <MapView 
                        region={region}
                        style={styles.map}
                        ref={map => getMapInstance(map)}
                        onRegionChangeComplete={(region) => {onRegionChangeComplete(region)}} >
                        {markerElements}

                    </MapView>    
                </View>
            </View>

            <View style={{ flex: 0.5 }}>
                <View 
                    style={{ 
                        flexDirection: 'row',
                        borderBottomWidth: 0.5 ,
                        borderColor: MainTheme.colorButtonBorder,
                        paddingLeft: 5,
                        justifyContent: 'center', 
                        alignItems: 'center'
                    }}>
                    <View style={{flex: 0.9}}>
                        <RNPickerSelect
                            items={distanceSelectItems}
                            onValueChange={(value) => { setState ? setState('distance', value) : null }}
                            style={{
                                iconContainer: {
                                    top: 0,
                                    right: 0
                                }, 
                                inputAndroid: {
                                    color: '#000000',
                                }
                            }}
                            value={distance}
                            textInputProps={{ underlineColorAndroid: 'cyan', underlineColor: 'yellow' }}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{}}
                            Icon={() => {
                                return <AntDesign 
                                            name='down' 
                                            size={25} color={MainTheme.colorPrimary} style={{marginTop: 10}} />
                                        
                            }} />
                    </View>
                    {/* <Picker
                        mode='dialog'
                        iosIcon={<Icon name='search-location' type={'FontAwesome5'}/>}
                        placeholderStyle={{ color: MainTheme.placeholerTextInput }}
                        placeholderIconColor='#007aff'
                        selectedValue={distance}
                        onValueChange={(value) => { setState ? setState('distance', value) : null }} >

                        {
                            distanceSelectItems.map((item, index) => {
                                return <Picker.Item key={index} label={item.label} value={item.value} />
                            })
                        }
                    </Picker> */}
                        <TouchableOpacity 
                            onPress={() => { searchCustomerNearBy ? searchCustomerNearBy() : null}}
                            style={{ flex: 0.1, flexDirection: 'row', height: 35, justifyContent: 'space-around' }} >
                            <AntDesign name='search1' size={20} color={MainTheme.colorQuaternary} />
                        </TouchableOpacity>

                </View>

                <IList 
                    data={listitemRV} 
                    renderItem={renderItem}/>
            </View>

            <ProgressDialog
                visible={isLoading}
                message='กำลังโหลดข้อมูลลูกค้า'
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />

            <ConfirmDialog
                title='เกิดข้อผิดพลาด'
                visible={errorMessage !== null}
                // onTouchOutside={() => setErrorMessage('errorMessage', null)}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () => setState('errorMessage', null)
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} >
                <View>
                    <Text>{errorMessage}</Text>
                </View>
            </ConfirmDialog>
        </View>
    )
}

export default Map

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerWrap: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center'    
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(130,4,150, 0.9)'
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(130,4,150, 0.3)',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'rgba(130,4,150, 0.5)'
    }
})