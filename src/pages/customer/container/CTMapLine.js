import React from 'react'
import { connect } from 'react-redux'
import { Linking } from 'react-native'
import MapLine from '../presenter/MapLine'
import  { getCurrentPosition } from '../../../action/geolocation'
import { getARCustomerLine, setCustomerInfo, findCustomerById } from '../../../action/customer'
import IPatternCusCoordListItem from '../../../component/list-item/IPatternCusCoordListItem'
import { setInitialState as setMileInitialState } from '../../../action/mile'
import { setInitialState as setCheckInInitialState } from '../../../action/check-in'
import { getUserToken } from '../../../utils/Token'
import Navigator from '../../../services/Navigator'

class CTMapLine extends React.Component {
    _isMounted = false 

    constructor(props) {
        super(props)

        this.state = {
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
            markers: [],
            refreshing: false
        }
    }

    componentDidMount = async () => {
        this._isMounted = true
        this.index = 0
        await this._getCurrentPosition()
        await this._getARCustomerLine()
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
    
    _getARCustomerLine = async () => {
        try {
            await this._setState('refreshing', true)
            await this._getCurrentPosition()
            const userToken = await getUserToken()
            const result = await this.props.getARCustomerLine()
            let additionalData;

            if (userToken.VANCONFIG.VANCNF_AR_LIMIT === 2) {
                ({ Vans0107: additionalData } = result);
            } else {
                ({ Vans0104: additionalData } = result);
            }


            console.log("_getARCustomerLine2.1", result)
            console.log("_getARCustomerLine2.22", additionalData);

            // ตรวจสอบว่า additionalData เป็น array หรือไม่
            if (Array.isArray(additionalData)) {
                // ถ้าเป็น array ก็สามารถใช้ .filter ได้
                const filteredResult = additionalData.filter(item => item.ADDB_GPS_LAT_S !== "");
                let markers = [this.state.currentMarker]
                let gonII = 0.001
                const customers = filteredResult.map(item => {
                    gonII += gonII
                    return {
                        ...item,
                        ADDB_GPS_LAT_S: this.props.geolocation.position.latitude * 1 + gonII,
                        ADDB_GPS_LONG_S: this.props.geolocation.position.longitude * 1 + gonII,
                        title: item.ADDB_COMPANY,
                        description: item.ADDB_COMPANY,
                        coordinate: {
                            latitude: item.ADDB_GPS_LAT_S !== null ? parseFloat(item.ADDB_GPS_LAT_S) + gonII : this.props.geolocation.position.latitude * 1 + gonII,
                            longitude: item.ADDB_GPS_LONG_S !== null ? parseFloat(item.ADDB_GPS_LONG_S) + gonII : this.props.geolocation.position.longitude * 1 + gonII
                        }
                    }
                })
                markers = markers.concat(customers)
                await this._setState('markers', markers)
            } else {
                console.log("additionalData is not an array");
            }
        } catch (error) {
            await this._setState('errorMessage', error)
        }

        await this._setState('refreshing', false)
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
    }

    _goToGoogleMaps = (item) => {
        const url = `http://maps.google.com/maps?daddr=${item.coordinate.latitude},${item.coordinate.longitude}`
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

    _onRefresh = async () => {
        await this._getARCustomerLine()
    }
    
    render() {
        this.markers = []

        return (
            <MapLine 
                region={this.state.region} 
                listItems={this.state.markers}
                getMapInstance={this._getMapInstance} 
                getMarkersInstance={this._getMarkersInstance}
                onRegionChangeComplete={this._onRegionChangeComplete}
                renderItem={this._renderItem}
                setState={this._setState}
                errorMessage={this.state.errorMessage}
                isLoading={this.state.isLoading}
                onRefresh={this._onRefresh}
                refreshing={this.state.refreshing} />
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
        getARCustomerLine: () => dispatch(getARCustomerLine()),
        findCustomerById: (id) => dispatch(findCustomerById(id)),
        setCustomerInfo: (data) => {
			dispatch(setCustomerInfo(data))
        }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTMapLine)