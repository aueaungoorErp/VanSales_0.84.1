import _ from 'lodash'
import React from 'react'
import { Text } from 'react-native'
import MapView from 'react-native-maps'
import AntDesign from 'react-native-vector-icons/AntDesign'

class IPatternCurrentMarkerItem extends React.Component {
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
        const { item, getMarkersInstance } = this.props

        return (
            <MapView.Marker coordinate={item.coordinate} ref={instance => getMarkersInstance(instance)}>
                <AntDesign
                    name='user'
                    color='#517fa4'
                    size={40} />
                 <MapView.Callout style={{width: 100}}>
                    <Text>{item.title}</Text>
                </MapView.Callout>
            </MapView.Marker>
        )
    }
}

export default IPatternCurrentMarkerItem