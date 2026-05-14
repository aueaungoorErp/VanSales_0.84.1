import React, { Component } from 'react'
import { getSettingConfig, getUserToken } from '../../../utils/Token'
import Header from '../presenter/Header'

class CTHeader extends Component {

    componentDidMount() {
        this._getUserToken()
    }

    constructor(props) {
        super(props)
        this.state = {
            userToken: null
        }
    }

    _getUserToken = async () => {
        const userToken = await getUserToken()
        const settingConfig = await getSettingConfig()
        const mergedUserToken = {
            ...(userToken ?? {}),
            COMPANYINFO: userToken?.COMPANYINFO ?? settingConfig?.COMPANYINFO ?? null,
            SALESMAN: userToken?.SALESMAN ?? settingConfig?.SALESMAN ?? null,
            VANCONFIG: userToken?.VANCONFIG ?? settingConfig?.VANCONFIG ?? null,
        }

        if (userToken || settingConfig) {
            await this.setState(oldState => {
                return {
                    userToken: mergedUserToken
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