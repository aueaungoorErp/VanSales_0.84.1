import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import MapView, { Marker, Callout } from 'react-native-maps'

const IMap = (props) => {

    const { style, region, markers } = props
    
    const _renderCurrentMarker = (marker, index) => {
        return (
            <Marker key={index} coordinate={marker.coordinate}>
                <Icon
                    name='shield-account'
                    type='material-community'
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