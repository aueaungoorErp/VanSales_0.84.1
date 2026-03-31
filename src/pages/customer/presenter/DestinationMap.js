import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import IPatternCurrentMarkerItem from '../../../component/item/IPatternCurrentMarkerItem'

const Map = (props) => {
    const { 
        region, 
        listItems, 
        getMapInstance, 
        getMarkersInstance, 
        onRegionChangeComplete,
        errorMessage,
        isLoading,
        setState,
        goToCoordinate,
        goToGoogleMaps,
        onRefresh,
        customerSkip ,
        skipConfirmDialog } = props

    // console.log('sdvd', listItems)
    //console.log("marker.currentLocation >>>" , listItems);

        
    const _renderCurrentMarker = (item, index) => {
        return (
            <IPatternCurrentMarkerItem 
                item={item} 
                key={index} 
                getMarkersInstance={getMarkersInstance} />
        )
    }


    return (
        <View style={{ flex: 1 }} >
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

                </MapView>    
            </View>
            
            {/* <View style={{
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position:'absolute', 
                    bottom: 40, 
                    right: 15,
                    borderRadius: 40/2,
                    backgroundColor: '#FFFFFF'
                }}
                elevation={5} >
                <Icon active name='location-on' type='MaterialIcons' style={{ color: 'orange' }} fontSize={50} onPress={() => goToCoordinate(0)} />
            </View>
            
            {

                listItems.length > 1 ?
                    <View style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position:'absolute', 
                        bottom: 90, 
                        right: 15,
                        borderRadius: 40/2,
                        backgroundColor: '#FFFFFF'
                    }}
                    elevation={5} >
                    <Icon active name='my-location' type='MaterialIcons' style={{ color: 'orange' }} fontSize={50} onPress={() => goToCoordinate(1)} />
                </View> 
                : null
            } */}
            
            
            
            <View 
                style={{
                    flexDirection: 'row',
                    height: 150,
                }} >
                    <View style={{ flex: 0.9 }}>
                        {
                            listItems.length > 1 ? 
                                <View style={{
                                        flex: 1,
                                        padding: 15,
                                    }}
                                    elevation={5} >

                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{ listItems[1].AR_CODE }</Text>
                                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{ listItems[1].AR_NAME }</Text>
                                        <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >
                                            { listItems[1].ADDB_ADDB_1 ? listItems[1].ADDB_ADDB_1 + " " : null }
                                            { listItems[1].ADDB_ADDB_2 ? listItems[1].ADDB_ADDB_2 + " " : null }
                                            { listItems[1].ADDB_ADDB_3 ? listItems[1].ADDB_ADDB_3 + " " : null }
                                            { listItems[1].ADDB_SUB_DISTRICT ? listItems[1].ADDB_SUB_DISTRICT + " " : null }
                                            { listItems[1].ADDB_DISTRICT ? listItems[1].ADDB_DISTRICT + " " : null }
                                            { listItems[1].ADDB_PROVINCE ? listItems[1].ADDB_PROVINCE + " " : null }
                                            { listItems[1].ADDB_POST ? listItems[1].ADDB_POST + " " : null }
                                        </Text>
                                    </View>
                                </View>
                                : null
                        }
                    </View>
                    <View style={{ flex: 0.1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                        {
                            listItems.length > 1 ? 
                                <View style={{
                                        width: 35,
                                        height: 35,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // position:'absolute', 
                                        // bottom: 30, 
                                        // right: 15,
                                        borderRadius: 35/2,
                                        backgroundColor: '#FFFFFF'
                                    }}
                                    elevation={5} >
                                    <MaterialCommunityIcons name='radar' size={24} color='orange' onPress={() => goToGoogleMaps(listItems[1])} />
                                </View>
                                : null
                        }

                        {
                            listItems.length > 1 ? 
                                <View style={{
                                        width: 35,
                                        height: 35,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // position:'absolute', 
                                        // bottom: 80, 
                                        // right: 15,
                                        borderRadius: 35/2,
                                        backgroundColor: '#FFFFFF'
                                    }}
                                    elevation={5} >
                                    <MaterialCommunityIcons name='skip-next' size={24} color='orange' onPress={() => setState('skipConfirmDialog', true)} />
                                </View> 
                                : null
                        }

                        <View style={{
                                width: 35,
                                height: 35,
                                alignItems: 'center',
                                justifyContent: 'center',
                                // position:'absolute', 
                                // bottom: listItems.length > 1 ? 130 : 30, 
                                // right: 15,
                                borderRadius: 35/2,
                                backgroundColor: '#FFFFFF'
                            }}
                            elevation={5} >
                            <MaterialIcons name='refresh' color='orange' size={30} onPress={() => onRefresh(false)} />
                        </View>
                    </View>
                    
            </View>


            {/* {
                listItems.length > 1 ? 
                    <View style={{
                            width: '75%',
                            height: 100,
                            position:'absolute', 
                            bottom: 30, 
                            left: 45,
                            padding: 15,
                            backgroundColor: '#FFFFFF'
                        }}
                        elevation={5} >

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{ listItems[1].AR_CODE }</Text>
                            <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{ listItems[1].AR_NAME }</Text>
                            <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >
                                { listItems[1].ADDB_ADDB_1 ? listItems[1].ADDB_ADDB_1 + " " : null }
                                { listItems[1].ADDB_ADDB_2 ? listItems[1].ADDB_ADDB_2 + " " : null }
                                { listItems[1].ADDB_ADDB_3 ? listItems[1].ADDB_ADDB_3 + " " : null }
                                { listItems[1].ADDB_PROVINCE ? listItems[1].ADDB_PROVINCE + " " : null }
                                { listItems[1].ADDB_POST ? listItems[1].ADDB_POST + " " : null }
                            </Text>
                        </View>
                    </View>
                    : null
            } */}

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

            <ConfirmDialog
                title='คุณต้องการข้ามไปยังลูกค้ารายถัดไป'
                visible={skipConfirmDialog}
                // onTouchOutside={() => setErrorMessage('errorMessage', null)}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () =>  listItems.length > 1 ?     customerSkip(listItems[1].AR_CODE) : null
                }}
                negativeButton={{
                    title: 'ยกเลิก',
                    titleStyle: { color: '#000000' },
                    onPress: () => setState('skipConfirmDialog', false)
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