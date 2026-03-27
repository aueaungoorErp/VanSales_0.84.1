import React from 'react'
import { connect } from 'react-redux'
import { Animated, Easing, Linking } from 'react-native'
import Map from '../presenter/Map'
import  { getCurrentPosition } from '../../../action/geolocation'
import { searchCustomerNearBy, setCustomerInfo, findCustomerById } from '../../../action/customer'
import IPatternCusCoordListItem from '../../../component/list-item/IPatternCusCoordListItem'
import { distanceSelectItems } from '../../../constant/lov'
import { setInitialState as setMileInitialState } from '../../../action/mile'
import { setInitialState as setCheckInInitialState } from '../../../action/check-in'
import { getUserToken } from '../../../utils/Token'
import Navigator from '../../../services/Navigator'

class CTMap extends React.Component {
    _isMounted = false 

    constructor(props) {
        super(props)

        this.state = {
            distance: 10,
            focus: 0,
            prevFocus: -1,
            errorMessage: null,
            isLoading: false,
            region: {
                latitude: this.props.geolocation.position.latitude * 1,
                longitude: this.props.geolocation.position.longitude * 1,
                latitudeDelta: 0.04864195044303443,
                longitudeDelta: 0.040142817690068
            },
            currentMarker: {
                title: 'ตำแหน่งของคุณ',
                // description: 'I am here!',
                coordinate: {
                    latitude: this.props.geolocation.position.latitude * 1, 
                    longitude: this.props.geolocation.position.longitude * 1
                },
                currentLocation: true
            },
            markers: []
        }
    }

    componentDidMount = async () => {
        this._isMounted = true
        this.index = 0
        this.animatedValue = new Animated.Value(0)
        await this._getCurrentPosition()
        // await this._searchCustomerNearBy()
    }

    componentWillUnmount = (props) => {
        this._isMounted = false
    }


    _getCurrentPosition = async () => {
        await this.props.getCurrentPosition()
        let currentMarker = this.state.currentMarker

        currentMarker.coordinate = {
            latitude: this.props.geolocation.position.latitude * 1,
            longitude: this.props.geolocation.position.longitude * 1
        }

        await this.setState(oldState => {
            return {
                region: {
                    ...this.state.region,
                    latitude: this.props.geolocation.position.latitude * 1,
                    longitude: this.props.geolocation.position.longitude * 1
                },
                currentMarker: currentMarker,
                markers: [currentMarker]
            }
        })
    }
    
    _searchCustomerNearBy = async () => {
        try {
            const criteria = {
                C_LAT: this.props.geolocation.position.latitude,
                C_LNT: this.props.geolocation.position.longitude,
                radius: this.state.distance
            }

            await this._setState('isLoading', true)
            await this._getCurrentPosition()
            const result = await this.props.searchCustomerNearBy(criteria)
            const { RESULT_DATA } = result
            const { RESULT } = RESULT_DATA
            let markers = [this.state.currentMarker]

            const customers =  RESULT.map(item => (
                { 
                    ...item, 
                    title: item.ADDB_COMPANY,
                    description: item.ADDB_COMPANY,
                    coordinate: {
                        latitude: item.ADDB_GPS_LAT_S ? parseFloat(item.ADDB_GPS_LAT_S) : this.props.geolocation.position.latitude * 1, 
                        longitude: item.ADDB_GPS_LONG_S ? parseFloat(item.ADDB_GPS_LONG_S) : this.props.geolocation.position.longitude * 1,
                    }
                })
            )
            
            markers = markers.concat(customers)
            await this._setState('markers', markers)

        } catch (error) {
            await this._setState('errorMessage', error)
        }

        await this._setState('isLoading', false)
    }

    _onRegionChangeComplete = (region) => {
        this.setState(oldState => {
            return {
                region: region
            }
        })
    }

    _renderItem = ({ item, index }) => {
        
        return (
            <IPatternCusCoordListItem 
                item={item} 
                index={index}
                goToCoordinate={this._goToCoordinate}
                goToGoogleMaps={this._goToGoogleMaps}
                goToOrder={this._goToOrder} />
        )
    }

    _getMapInstance = (instance) => {
        this.map = instance
    }

    _getMarkersInstance = (instance) => {
        instance ? this.markers = [...this.markers, instance] : null
    }

    _goToOrder = async (item) => {
        try {
            this._setState('isLoading', true)
            this.props.setCustomerInfo(item)
            await this.props.findCustomerById(item.AR_KEY)
            await this._setState('isLoading', false)
            
            this.props.setMileInitialState()
            this.props.setCheckInInitialState()
            
            const userToken = await getUserToken()

            if (this.props.screen === 'profile') {
                Navigator.navigate('CustomerProfileDetail')
                return
            }

            if (userToken.VANCONFIG.VANCNF_FORCE_MILE == 1) {
                Navigator.navigate('Mile')
                return
            }

            if (userToken.VANCONFIG.VANCNF_FORCE_GPS == 1) {
                Navigator.navigate('CheckIn')
                return
            }
            
            Navigator.navigate('OrderChoice')

        } catch (error) {
            this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error)
        }

        await this._setState('isLoading', false)
    }

    _goToCoordinate = async (index) => {
        await this._setState('prevFocus', this.state.focus)
        await this._setState('focus', index)

        clearTimeout(this.regionTimeout)

        this.regionTimeout = setTimeout(() => {
            const { coordinate } = this.state.markers[index]
            this.map.animateToRegion(
                {
                    ...coordinate,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta,
                },
                350
            )
            this.markers[index].showCallout()
        }, 10)

        this.animatedValue.setValue(0)

        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 800,
                easing: Easing.linear
            }
        ).start()
    }

    _goToGoogleMaps = (item) => {
        //http://maps.google.com/maps?saddr=My+Location&daddr=${item.coordinate.latitude},${item.coordinate.longitude}
        const url = `http://maps.google.com/maps?daddr=${item.coordinate.latitude},${item.coordinate.longitude}`
        // console.log(url)
        Linking.openURL(url)
    }

    _setState = async (key, value) => {
        this._isMounted &&
        await this.setState(oldState => {
          return { 
            [key]: value
          }
        })
      }

    render() {
        this.markers = []

        const focusScale = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2]
        })
    
        const unFocusScale = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 1]
        })
    
        const focusOpacity = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.35, 1]
        })
    
        const unFocusOpacity = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 0.35]
        })
          
        return (
            <Map 
                focus={this.state.focus}
                prevFocus={this.state.prevFocus}
                region={this.state.region} 
                listItems={this.state.markers}
                getMapInstance={this._getMapInstance} 
                getMarkersInstance={this._getMarkersInstance}
                onRegionChangeComplete={this._onRegionChangeComplete}
                renderItem={this._renderItem}
                setState={this._setState}
                focusScale={focusScale}
                unFocusScale={unFocusScale}
                focusOpacity={focusOpacity}
                unFocusOpacity={unFocusOpacity}
                errorMessage={this.state.errorMessage}
                isLoading={this.state.isLoading}
                distance={this.state.distance}
                distanceSelectItems={distanceSelectItems}
                searchCustomerNearBy={this._searchCustomerNearBy} />
        )
    }
}

const mapStateToProps = (state) => ({
    geolocation: state.geolocation,
    screen: state.screen,
    customer: state.customer
})

const mapDispatchToProps = (dispatch) => {
    return {
        setMileInitialState: () => {
            dispatch(setMileInitialState())
        },
        setCheckInInitialState: () => {
            dispatch(setCheckInInitialState())
        },
        getCurrentPosition: () => dispatch(getCurrentPosition()),
        searchCustomerNearBy: (criteria) => dispatch(searchCustomerNearBy(criteria)),
        findCustomerById: (id) => dispatch(findCustomerById(id)),
        setCustomerInfo: (data) => {
			dispatch(setCustomerInfo(data))
        }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTMap)