import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import { ProgressDialog, ConfirmDialog } from 'react-native-simple-dialogs'
import IList from '../../../component/list/IList'
import IPatternCurrentMarkerItem from '../../../component/item/IPatternCurrentMarkerItem'

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

    const markerII = listItems.filter(item => item.ADDB_GPS_LAT_S !== null && item.ADDB_GPS_LONG_S!== null).map((item, index) => { 
        return { latitude: item.coordinate.latitude, longitude: item.coordinate.longitude }
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

                        {
                            
                            markers = listItems.filter(item => item.ADDB_GPS_LAT_S !== null && item.ADDB_GPS_LONG_S!== null).map((marker, index) => {
                                if (marker.currentLocation) {
                                    return (
                                        _renderCurrentMarker(marker, index)
                                    )
                                } else {
                                    return (
                                        <MapView.Marker key={index} coordinate={marker.coordinate} ref={instance => getMarkersInstance(instance)}>
                                            <MapView.Callout style={{width: 100}}>
                                                <Text>{marker.title}</Text>
                                            </MapView.Callout>
                                        </MapView.Marker>
                                    )
                                }
                            })
                        }

                        <MapView.Polyline
                            coordinates={markerII}
                            strokeColor="#2B60DE" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeColors={[
                                '#7F0000',
                                '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                                '#B24112',
                                '#E5845C',
                                '#238C23',
                                '#7F0000'
                            ]}
                            strokeWidth={6} >

                        </MapView.Polyline>

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