import React, { Component} from 'react'
import { connect } from 'react-redux'
import { Keyboard } from 'react-native'
import Form from '../presenter/Form'
import Navigator from '../../../services/Navigator'
import { addPhoto, setMileage, setIsSubmit, initializeMileScreen, isMileageLessThanLatest, getMileageLessThanLatestMessage } from '../../../action/mile'

class CTForm extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.initializeMileScreen()
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
        const latestMileage = this.props.mile.latestMileage;
        const enteredMileage = this.props.mile.item.mileage;
        const showMileageWarning = isMileageLessThanLatest(
            enteredMileage,
            latestMileage,
        );

        return (
            <Form 
                value={enteredMileage} 
                onChangeText={this._onChangeText}
                photo={this.props.mile.item.photo}
                ontakePicturePress={this._ontakePicturePress}
                isLoading={this.props.mile.isLoading}
                showMileageWarning={showMileageWarning}
                mileageWarningMessage={getMileageLessThanLatestMessage(latestMileage)} />
        )
    }
}

const mapStateToProps = (state) => ({
    mile: state.mile
})

const mapDispatchToProps = (dispatch) => {
    return {
        addPhoto: (uri) => {
			dispatch(addPhoto(uri))
        },
        setMileage: (value) => {
            dispatch(setMileage(value))
        },
        setIsSubmit: (bool) => {
            dispatch(setIsSubmit(bool))
        },
        initializeMileScreen: () => {
            return dispatch(initializeMileScreen())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTForm)