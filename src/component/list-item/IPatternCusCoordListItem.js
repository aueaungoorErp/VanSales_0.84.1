import _ from 'lodash'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainTheme } from '../../constant/lov'

class IPatternCusCoordListItem extends React.Component {
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
        const { item, index, goToCoordinate, goToGoogleMaps, goToOrder } = this.props

        return (
            <View style={{backgroundColor: MainTheme.colorSecondary, paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e1e8ee'}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{ flex: 0.35 }}>
                            <Text style={{ marginLeft: 5}}>{item.AR_CODE}</Text>
                            <Text style={{ marginLeft: 5}}>{item.title}</Text>
                        </View>
                        <View style={{ flex: 0.35, flexDirection: 'row' }}>
                            <Text style={{ marginLeft: 5 }}>{item.DISTANCE_TEXT}</Text>
                        </View>
                        <View style={{ flex: 0.4, flexDirection: 'row' }}>
                            {
                                item.currentLocation === undefined ?
                                    <TouchableOpacity 
                                        onPress={() => { goToOrder(item)} }
                                        style={{flex: 1, height: 35, alignItems: 'center', justifyContent: 'center' , marginRight: 1}} >
                                        <Image
                                            style={{width: 35, height: 35, alignSelf: 'center'}}
                                            resizeMode='contain'
                                            source={require('../../images/Order.png')} />
                                    </TouchableOpacity>
                                    : <View style={{ flex: 1}}/>
                                
                            }
                            
                            {
                                item.ADDB_GPS_LAT_S !== null && item.ADDB_GPS_LONG_S!== null ?
                                <TouchableOpacity 
                                    onPress={() => { goToCoordinate(index)} }
                                    style={{flex: 1, height: 35, alignItems: 'center', justifyContent: 'center',marginRight: 1}} >
                                    <AntDesign name='scan1' size={20} color={MainTheme.colorPrimary} />
                                </TouchableOpacity>
                                : <View style={{ flex: 1}}/>
                            }

                            {
                                //item.currentLocation === undefined && item.ADDB_GPS_LAT_S !== null && item.ADDB_GPS_LONG_S!== null ?

                               item.ADDB_GPS_LAT_S !== null && item.ADDB_GPS_LONG_S!== null ?
                                    <TouchableOpacity 
                                        onPress={() => { goToGoogleMaps(item)} }
                                        style={{flex: 1, height: 30, alignItems: 'center', justifyContent: 'center'}} >
                                        <AntDesign name='enviromento' size={20} color={MainTheme.colorPrimary} />
                                    </TouchableOpacity>
                                    : <View style={{ flex: 1}}/>
                                
                            }

                            
                        </View>
                    </View>
            </View>
        )
    }
}

export default IPatternCusCoordListItem