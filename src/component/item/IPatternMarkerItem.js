import React from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import _ from 'lodash'

class IPatterntMarkerItem extends React.Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            item: null
        }
    }

    componentDidMount() {
        this._isMounted = true
        this._setState('item', this.props.scrChooseItem)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    shouldComponentUpdate = async (nextProps, nextState) => {

        if (!_.isEqual(nextProps.item, this.props.item)) {
            await this._setState('item', nextProps.item)
            return true
        }   

        return false
    }

    _setState = async (key, value) =>  {
        this._isMounted && 
        await this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    render() {
        const { item, getMarkersInstance, opacityStyle, scaleStyle } = this.props

        return (
            <MapView.Marker coordinate={item.coordinate} ref={instance => getMarkersInstance(instance)}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                    <Animated.View style={[styles.ring, scaleStyle]} />
                    <View style={styles.marker} />
                </Animated.View>
                <MapView.Callout style={{width: 100}}>
                    <Text>{item.title}</Text>
                </MapView.Callout>
            </MapView.Marker>
        )
    }
}

export default IPatterntMarkerItem

const styles = StyleSheet.create({
    markerWrap: {
        width: 80,
        height: 80,
        alignItems: "center",
        justifyContent: "center"    
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255, 0, 0, 0.9)"
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(255, 0, 0, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(255, 0, 0, 0.5)"
    }
})