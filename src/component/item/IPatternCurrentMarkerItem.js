import React from 'react'
import { Marker } from 'react-native-maps'

const IPatternCurrentMarkerItem = ({ item, getMarkersInstance }) => (
    <Marker
        coordinate={item.coordinate}
        title={item.title}
        description={item.description}
        pinColor='#517fa4'
        ref={instance => getMarkersInstance(instance)}
    />
)

export default IPatternCurrentMarkerItem