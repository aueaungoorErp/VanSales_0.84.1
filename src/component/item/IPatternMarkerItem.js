import React from 'react'
import { Marker } from 'react-native-maps'

const IPatterntMarkerItem = ({ item, getMarkersInstance }) => (
    <Marker
        coordinate={item.coordinate}
        title={item.title}
        description={item.description}
        pinColor='red'
        ref={instance => getMarkersInstance(instance)}
    />
)

export default IPatterntMarkerItem
