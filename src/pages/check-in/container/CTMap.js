import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { getCurrentPosition } from '../../../action/geolocation'
import IMap from '../../../component/map/IMap' 

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%', 
        height: '100%'
    }
}) 

class CTMap extends Component {
    constructor(props) {
        super(props)

        this._isMounted = false

        this.state = {
            region: {
                latitude: this.props.geolocation.position.latitude * 1,
                longitude: this.props.geolocation.position.longitude * 1,
                latitudeDelta: 0.04864195044303443,
                longitudeDelta: 0.040142817690068
            },
            markers: [
                {
                    title: 'ตำแหน่งของคุณ',
                    // description: 'ตำแหน่งของคุณ',
                    coordinate: {
                        latitude: this.props.geolocation.position.latitude * 1, 
                        longitude: this.props.geolocation.position.longitude * 1
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
        if (prevProps.geolocation.position.latitude !== this.props.geolocation.position.latitude ||
            prevProps.geolocation.position.longitude !== this.props.geolocation.position.longitude) {
            let markers = this.state.markers
            markers[0].coordinate = {
                latitude: this.props.geolocation.position.latitude * 1,
                longitude: this.props.geolocation.position.longitude * 1
            }
                    
            this._isMounted && 
            this.setState(oldState => {
                return {
                    region: {
                        ...this.state.region,
                        latitude: this.props.geolocation.position.latitude * 1,
                        longitude: this.props.geolocation.position.longitude * 1
                    },
                    markers: markers
                }
            })
        }
    }   

    _getCurrentPosition = async () => {
        try {
            await this.props.getCurrentPosition()
            let markers = this.state.markers
            markers[0].coordinate = {
                latitude: this.props.geolocation.position.latitude * 1,
                longitude: this.props.geolocation.position.longitude * 1
            }
            
            this._isMounted && 
            this.setState(oldState => {
                return {
                    region: {
                        ...this.state.region,
                        latitude: this.props.geolocation.position.latitude * 1,
                        longitude: this.props.geolocation.position.longitude * 1
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


