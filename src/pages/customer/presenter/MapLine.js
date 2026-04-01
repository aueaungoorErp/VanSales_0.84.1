import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import IPatternCurrentMarkerItem from '../../../component/item/IPatternCurrentMarkerItem'
import IList from '../../../component/list/IList'

const Map = (props) => {
    const { 
        region, 
        listItems, 
        getMapInstance, 
        getMarkersInstance, 
        onRegionChangeComplete,
        renderItem,
        errorMessage,
        isLoading,
        setState,
        onRefresh,
        refreshing } = props
        
    const _renderCurrentMarker = (item, index) => {
        return (
            <IPatternCurrentMarkerItem 
                item={item} 
                key={index} 
                getMarkersInstance={getMarkersInstance} />
        )
    }

    const validMarkers = listItems.filter((item) => {
        const latitude = item?.coordinate?.latitude
        const longitude = item?.coordinate?.longitude

        return Number.isFinite(latitude) && Number.isFinite(longitude)
    })

    const markerII = validMarkers.map((item) => {
        return { latitude: item.coordinate.latitude, longitude: item.coordinate.longitude }
    })

    const markerElements = validMarkers.map((marker, index) => {
        if (marker.currentLocation) {
            return _renderCurrentMarker(marker, index)
        }

        return (
            <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                pinColor='red'
                ref={instance => getMarkersInstance(instance)}
            />
        )
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
                        }
                    ]}> 

                    <MapView 
                        region={region}
                        style={styles.map}
                        ref={map => getMapInstance(map)}
                        onRegionChangeComplete={(region) => {onRegionChangeComplete(region)}} >
                        {markerElements}

                        {markerII.length > 1 ? (
                            <Polyline
                                coordinates={markerII}
                                strokeColor="#2B60DE"
                                strokeColors={[
                                    '#7F0000',
                                    '#00000000',
                                    '#B24112',
                                    '#E5845C',
                                    '#238C23',
                                    '#7F0000'
                                ]}
                                strokeWidth={6}
                            />
                        ) : null}

                    </MapView>    
                </View>
            </View>

            <View style={{ flex: 0.5 }}>
                <IList 
                    data={listItems} 
                    renderItem={renderItem}
                    refreshing={refreshing}
                    onRefresh={onRefresh} />
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
    }
    // markerWrap: {
    //     width: 80,
    //     height: 80,
    //     alignItems: 'center',
    //     justifyContent: 'center'    
    // },
    // marker: {
    //     width: 8,
    //     height: 8,
    //     borderRadius: 4,
    //     backgroundColor: 'rgba(130,4,150, 0.9)'
    // },
    // ring: {
    //     width: 24,
    //     height: 24,
    //     borderRadius: 12,
    //     backgroundColor: 'rgba(130,4,150, 0.3)',
    //     position: 'absolute',
    //     borderWidth: 1,
    //     borderColor: 'rgba(130,4,150, 0.5)'
    // }
})