import React from 'react'
import { connect } from 'react-redux'
import { Linking } from 'react-native'
import DestinationMap from '../presenter/DestinationMap'
import { getCurrentPosition } from '../../../action/geolocation'
import { setCustomerType } from '../../../action/customer-type'
import { getCustomerNextDestination, setKeyword, clearCustomerList, customerSkip } from '../../../action/customer'
import { getARCustomerLine, setCustomerInfo, findCustomerById } from '../../../action/customer'


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
            refreshing: false,
            skipConfirmDialog: false
        }
    }

    componentDidMount = async () => {
        this._isMounted = true
        await this._getCurrentPosition()
        await this._getCustomerNextDestination()
    }

    componentWillMount = async () => {
        this.index = 0
    }

    componentWillUnmount = (props) => {
        this._isMounted = false
    }


    _getCurrentPosition = async () => {
        console.log("_getCurrentPosition 1");
        await this.props.getCurrentPosition()
        let currentMarker = this.state.currentMarker
        console.log("_getCurrentPosition 2 ", currentMarker);
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

    _getCustomerNextDestination = async (arCode) => {
        try {
            await this._setState('isLoading', true)
            let markers = [this.state.currentMarker]

            console.log("_getCustomerNextDestination 1.1" , this.state.markers);
            const result = await this.props.getCustomerNextDestination(arCode)

            console.log("getCustomerNextDestination result", result)
            console.log("this.state.markers", this.state.markers)

            //const customer = result [1]
            const customer = result[0] 

            const destination = {
                ...customer,
                title: customer?.ADDB_COMPANY,
                description: customer?.ADDB_COMPANY,
                coordinate: {
                    latitude: customer?.ADDB_GPS_LAT_S !== null ? parseFloat(customer?.ADDB_GPS_LAT_S) : this.props.geolocation.position.latitude * 1,
                    longitude: customer?.ADDB_GPS_LONG_S !== null ? parseFloat(customer?.ADDB_GPS_LONG_S) : this.props.geolocation.position.longitude * 1
                }
            }

            markers.push(destination)
            await this._setState('markers', markers)

            console.log("this.state.markers33", this.state.markers)
            console.log("_getCustomerNextDestination 1" , this.state.markers);

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

    _getMapInstance = (instance) => {
        this.map = instance
    }

    _getMarkersInstance = (instance) => {
        instance ? this.markers = [...this.markers, instance] : null
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

    _onRefresh = async (value) => {
        await this._getCurrentPosition()
        //await this._getARCustomerLine()
        
        console.log('_customerSkip >> 3.1 ', value)

        await this._getCustomerNextDestination(value)
    }

    _customerSkip = async (value) => {
        this._setState('skipConfirmDialog', false)
       //await this._getARCustomerLine()
        // console.log('_customerSkip >> 1 ', this.state.markers[0].AR_CODE)
        // console.log('_customerSkip >> 2 ', this.state.markers[1].AR_CODE)
        console.log('_customerSkip >> 3.0 ', this.state.markers[1].AR_CODE)


        try {
            await this._setState('isLoading', true)
            //await this.props.customerSkip(this.state.markers[1].AR_CODE)
            console.log('_customerSkip >> 4 ', this.state.markers[1].AR_CODE)
        } catch (error) {
            await this._setState('errorMessage', error)
            await this._setState('isLoading', false)
            return
        }
        // console.log('_customerSkip >> 2 ', this.state.markers[1].AR_CODE)
        await this._onRefresh(value)
    }



    // _BK_customerSkip = async () => {
    //     this._setState('skipConfirmDialog', false)
    //     try {
    //         await this._setState('isLoading', true)
    //         await this.props.customerSkip(this.state.markers[1].AR_CODE)
    //     } catch (error) {
    //         await this._setState('errorMessage', error)
    //         await this._setState('isLoading', false)
    //         return 
    //     }

    //     await this._onRefresh()
    // }


    _getARCustomerLine = async () => {
        try {
            await this._setState('refreshing', true)
            await this._getCurrentPosition()
            const result = await this.props.getARCustomerLine()
            console.log("_getARCustomerLine2.1", result)
            const { additionalData } = result
            console.log("_getARCustomerLine2.2", additionalData)

            // const { RESULT } = additionalData
            // console.log("_getARCustomerLine2.3" , RESULT)

            console.log("markers 4", this.state.currentMarker)



            let markers = [this.state.currentMarker]

            let gonII = 0.001

            const customers = additionalData.map(item => {
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
            console.log("markers 6", markers)

        } catch (error) {
            await this._setState('errorMessage', error)
        }

        await this._setState('refreshing', false)
    }



    _goToOrder = async (item) => {
        console.log('_goToOrder >> ', item)
        try {
            this._setState('isLoading', true)
            this.props.setCustomerInfo(item)
            await this.props.findCustomerById(item.AR_KEY)
            await this._setState('isLoading', false)

            // this.props.setMileInitialState()
            // this.props.setCheckInInitialState()

            //const userToken = await getUserToken()

            // if (this.props.screen === 'profile') {
            //     Navigator.navigate('CustomerProfileDetail')
            //     return
            // }

            // if (userToken.VANCONFIG.VANCNF_FORCE_MILE == 1) {
            //     Navigator.navigate('Mile')
            //     return
            // }

            // if (userToken.VANCONFIG.VANCNF_FORCE_GPS == 1) {
            //     Navigator.navigate('CheckIn')
            //     return
            // }

            // Navigator.navigate('OrderChoice')

        } catch (error) {
            this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error)
        }

        await this._setState('isLoading', false)
    }





    render() {
        this.markers = []

        return (
            <DestinationMap
                region={this.state.region}
                listItems={this.state.markers}
                getMapInstance={this._getMapInstance}
                getMarkersInstance={this._getMarkersInstance}
                onRegionChangeComplete={this._onRegionChangeComplete}
                setState={this._setState}
                skipConfirmDialog={this.state.skipConfirmDialog}
                errorMessage={this.state.errorMessage}
                isLoading={this.state.isLoading}
                onRefresh={this._onRefresh}
                goToCoordinate={this._goToCoordinate}
                goToGoogleMaps={this._goToGoogleMaps}
                customerSkip={this._customerSkip} />
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
        getCurrentPosition: () => dispatch(getCurrentPosition()),
        getARCustomerLine: () => dispatch(getARCustomerLine()),
        findCustomerById: (id) => dispatch(findCustomerById(id)),
        setCustomerInfo: (data) => {
            dispatch(setCustomerInfo(data))
        },
        setCustomerType: (value) => {
            dispatch(setCustomerType(value))
        },
        clearCustomerList: () => {
            dispatch(clearCustomerList())
        },
        setKeyword: (criteria) => {
            dispatch(setKeyword(criteria))
        },
        getCustomerNextDestination: (value) => dispatch(getCustomerNextDestination(value)),
        customerSkip: (id) => dispatch(customerSkip(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTMapLine)