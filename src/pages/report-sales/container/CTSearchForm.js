import React, { Component }from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import SearchForm from '../presenter/SearchForm'
import { setReportSaleInitialState, getSalesTarget } from '../../../action/report'

class CTSearchForm extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            dateFrom: moment().format('DD/MM/YYYY'),
            dateTo: moment().format('DD/MM/YYYY'),
            dialogMessage: null,
            isLoading: false,
            loadingMessage: '',
            errorMessage: null,
        }

        this._onDateFromChange = this._onDateFromChange.bind(this)
        this._onDateToChange = this._onDateToChange.bind(this)
    }

    componentDidMount = () => {
        this._isMounted = true
        this.props.setReportSaleInitialState()
        this._onPress()
    }

    componentWillUnmount = (props) => {
        this._isMounted = false
    }

    _onDateFromChange = (value) => {
        this._isMounted && 
        this.setState(oldState => {
            return {
                dateFrom: value
            }
        })
    }

    _onDateToChange = (value) => {
        this._isMounted && 
        this.setState(oldState => {
            return {
                dateTo: value
            }
        })
    }
    
    _onPress = async () => {
        try {
            await this._setState('isLoading', true)
            await this._setState('loadingMessage', 'กำลังโหลดข้อมูลรายงาน...')
            await this._setState('errorMessage', null)
            
            await this.props.getSalesTarget({
                FROM: moment(this.state.dateFrom, 'DD/MM/YYYY').add(1, 'days').toJSON(),
                TO: moment(this.state.dateTo, 'DD/MM/YYYY').add(1, 'days').toJSON()
            })
            
        } catch (error) {
            await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error)
        }

        await this._setState('loadingMessage', '')
        await this._setState('isLoading', false)
    }

    _setState = async (key, value) => {
        this._isMounted && 
        await this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    _setDialogMessage = (value) => {
        this._isMounted && 
        this.setState(oldState => {
            return {
                dialogMessage: value
            }
        })
    }

    render() {
        
        return (
            <SearchForm 
                dateFrom={this.state.dateFrom}
                dateTo={this.state.dateTo}
                onDateFromChange={this._onDateFromChange}
                onDateToChange={this._onDateToChange}
                onPress={this._onPress}
                setDialogMessage={this._setDialogMessage}
                setState={this._setState}
                dialogMessage={this.state.dialogMessage}
                errorMessage={this.state.errorMessage}
                isLoading={this.state.isLoading}
                loadingMessage={this.state.loadingMessage} />
        )
    }
}

const mapStateToProps = (state) => ({
    report: state.report
})

const mapDispatchToProps = (dispatch) => {
    return {
        setReportSaleInitialState: () => dispatch(setReportSaleInitialState()),
        getSalesTarget: (data) => dispatch(getSalesTarget(data))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTSearchForm)