import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProfileDetailForm from '..//presenter/ProfileDetailForm'

class CTProfileDetailForm extends Component {
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
        console.log("this.props.customer.item" , this.props.customer.item )
        return (
            <ProfileDetailForm customer={this.props.customer.item}/>
        )
    }
}

const mapStateToProps = (state) => ({
    customer: state.customer
})

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTProfileDetailForm)