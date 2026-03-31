import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'
import AntDesign from 'react-native-vector-icons/AntDesign'

const IMap = (props) => {

    const { style, region, markers } = props
    
    const _renderCurrentMarker = (marker, index) => {
        return (
            <Marker key={index} coordinate={marker.coordinate}>
                <AntDesign
                    name='user'
                    color='#517fa4'
                    size={40} />
                 <Callout style={{width: 100}}>
                    <Text>{marker.title}</Text>
                    <Text>{marker.description}</Text>
                </Callout>
            </Marker>
        )
    }
    
    return (
        <View >
            <View style={[styles.container, style && style.mapContainer ? style.mapContainer : null, style && style.container ? style.container : null]}>
                <MapView
                    region={region}
                    style={styles.map} >
                    
                    {
                        markers.map((marker, index) => {
                            return (
                                _renderCurrentMarker(marker, index)
                            )
                        })
                    }

                </MapView>
            </View>
        </View>
    )
}

export default IMap

const styles = StyleSheet.create({
    container: {
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    }
})