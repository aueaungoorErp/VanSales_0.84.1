import React, { Component} from 'react'
import { connect } from 'react-redux'
import { Keyboard } from 'react-native'
import Form from '../presenter/Form'
import Navigator from '../../../services/Navigator'
import { setInitialState, addPhoto, setMileage, setIsSubmit } from '../../../action/mile'

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

        Keyboard.dismiss() 
    }

    _onChangeText = async (value) => {
        this.props.setMileage(this._numberOnly(value))
        await this.props.setIsSubmit(false)
    }

    _numberOnly(text) {
        let newText = ''
        let numbers = '0123456789.'
    
        for (var i = 0; i < text.length; i++) {
            if ( numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i]
            }
        }   
        
        newText = this._removeLeaderZeros(newText)

        return newText
    }

    _removeLeaderZeros(text) {
        return text.replace(/^0+/, '')
    }

    render() {
        return (
            <Form 
                value={this.props.mile.item.mileage} 
                onChangeText={this._onChangeText}
                photo={this.props.mile.item.photo}
                ontakePicturePress={this._ontakePicturePress}
                setIsLoading={this.props.setIsLoading}
                isLoading={this.props.mile.isLoading} />
        )
    }
}

const mapStateToProps = (state) => ({
    mile: state.mile
})

const mapDispatchToProps = (dispatch) => {
    return {
        setInitialState: () => {
            dispatch(setInitialState())
        },
        addPhoto: (uri) => {
			dispatch(addPhoto(uri))
        },
        setMileage: (value) => {
            dispatch(setMileage(value))
        },
        setIsSubmit: (bool) => {
            dispatch(setIsSubmit(bool))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTForm)