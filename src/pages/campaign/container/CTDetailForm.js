import React, { Component } from 'react'
import { connect } from 'react-redux'
import DetailForm from '../presenter/DetailForm'

class CTDetailForm extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount = (props) => {
        this._isMounted = true
    }
    
    componentWillUnmount = (props) => {
        this._isMounted = false
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

        return (
            <DetailForm 
                campaignARCPGNType={this.props.campaignARCPGNType.item} />
        )
    }
}

const mapStateToProps = (state) => ({
    campaignARCPGNType: state.campaignARCPGNType,
})

const mapDispatchToProps = (dispatch) => {
    return {
       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTDetailForm)