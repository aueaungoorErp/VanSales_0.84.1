import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { getCurrentPosition } from '../../../action/geolocation'
import IMap from '../../../component/map/IMap'

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%', 
        height: '100%'
    }
}) 

const DEFAULT_LAT = 13.7563;  // Bangkok default
const DEFAULT_LNG = 100.5018;

class CTMap extends Component {
    constructor(props) {
        super(props)

        this._isMounted = false

        const lat = this.props.geolocation.position.latitude != null ? this.props.geolocation.position.latitude * 1 : DEFAULT_LAT;
        const lng = this.props.geolocation.position.longitude != null ? this.props.geolocation.position.longitude * 1 : DEFAULT_LNG;

        this.state = {
            region: {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.04864195044303443,
                longitudeDelta: 0.040142817690068
            },
            markers: [
                {
                    title: 'ตำแหน่งของคุณ',
                    // description: 'ตำแหน่งของคุณ',
                    coordinate: {
                        latitude: lat, 
                        longitude: lng
                    },
                    currentLocation: true
                }
            ]
        }
    }

    componentDidMount() {
        this._isMounted = true
        this._isMounted && this._getCurrentPosition()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidUpdate = (prevProps) => {
        const prevLat = prevProps.geolocation.position.latitude;
        const prevLng = prevProps.geolocation.position.longitude;
        const curLat = this.props.geolocation.position.latitude;
        const curLng = this.props.geolocation.position.longitude;

        if (curLat != null && curLng != null && (prevLat !== curLat || prevLng !== curLng)) {
            let markers = this.state.markers
            markers[0].coordinate = {
                latitude: curLat * 1,
                longitude: curLng * 1
            }
                    
            this._isMounted && 
            this.setState(oldState => {
                return {
                    region: {
                        ...this.state.region,
                        latitude: curLat * 1,
                        longitude: curLng * 1
                    },
                    markers: markers
                }
            })
        }
    }   

    _getCurrentPosition = async () => {
        try {
            await this.props.getCurrentPosition()
            const lat = this.props.geolocation.position.latitude;
            const lng = this.props.geolocation.position.longitude;
            if (lat == null || lng == null) return;

            let markers = this.state.markers
            markers[0].coordinate = {
                latitude: lat * 1,
                longitude: lng * 1
            }
            
            this._isMounted && 
            this.setState(oldState => {
                return {
                    region: {
                        ...this.state.region,
                        latitude: lat * 1,
                        longitude: lng * 1
                    },
                    markers: markers
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    render() {
        return (
            <IMap 
                region={this.state.region}
                markers={this.state.markers}
                style={styles} />
        )
    }
}

const mapStateToProps = (state) => ({
    geolocation: state.geolocation,
    screen: state.screen
})

const mapDispatchToProps = (dispatch) => {
    return {
        getCurrentPosition: () => dispatch(getCurrentPosition())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTMap)


