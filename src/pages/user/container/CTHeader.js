import React, { Component } from 'react'
import { getUserToken } from '../../../utils/Token'
import Header from '../presenter/Header'

class CTHeader extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userToken: null
        }
        this._getUserToken()
    }

    _getUserToken = async () => {
        const userToken = await getUserToken()

        if (userToken) {
            await this.setState(oldState => {
                return {
                    userToken: userToken
                }
            })
        } 
    }

    render() {
        return (
            <Header userToken={this.state.userToken} />
        )
    }
}

export default CTHeader