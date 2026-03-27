import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navigator from '../../../services/Navigator'
import Form from '../presenter/Form'
import { setInitialState, addPhoto, setIsLoading, setIsSubmit } from '../../../action/check-in'
import { setMessage } from '../../../action/geolocation'

class CTForm extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount(props) {
        // this.props.setInitialState()
    }

    _ontakePicturePress = () => {
        Navigator.navigate('Camera', {
            takePicture: async (data) => {
                await this.props.addPhoto(data.uri)
                await this.props.setIsSubmit(false)
                Navigator.back()
            }
        })
    }

    render() {
        return (
            <Form 
                photo={this.props.checkin.item.photo}
                customer={this.props.customer.item}
                ontakePicturePress={this._ontakePicturePress}
                setIsLoading={this.props.setIsLoading}
                isLoading={this.props.checkin.isLoading}
                position={this.props.geolocation.position}
                // dialogMessage={this.props.geolocation.message}
                setMessage={this.props.setMessage} />
        )
    }
}

const mapStateToProps = (state) => ({
    checkin: state.checkin,
    customer: state.customer,
    geolocation: state.geolocation
})

const mapDispatchToProps = (dispatch) => {
    return {
        setInitialState: () => {
            dispatch(setInitialState())
        },
        addPhoto: (uri) => {
			dispatch(addPhoto(uri))
        },
        setIsLoading: (bool) => {
            dispatch(setIsLoading(bool))
        },
        setMessage: (message) => dispatch(setMessage(message)),
        setIsSubmit: (bool) => dispatch(setIsSubmit(bool))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTForm)