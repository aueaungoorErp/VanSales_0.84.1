import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { setInitialState, clearListItems, setCriteria, searchList, setCheckNumber } from '../../../../action/outstanding-balance'
import SearchForm from '../presenter/SearchForm'

class CTSearchForm extends React.Component { 
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            dateFrom: moment().format('DD/MM/YYYY'),
            dateTo: moment().format('DD/MM/YYYY'),
            dialogMessage: null
        }
    }

    componentDidMount = (props) => {
        this._isMounted = true
        this._initialState()
    }
    
    componentWillUnmount = (props) => {
        this._isMounted = false
    }

    _initialState = async () => {
        await this.props.setInitialState()
        this._onSearch()
    }

    _setState = async (key, value) => {
        this._isMounted && 
        await this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    _onSearch = async () => {
        if (!this.props.outstandingBalance.isLoading) {
            try { 
                await this.props.setCriteria({
                    ...this.props.outstandingBalance.criteria,
                    dateFrom: moment(this.state.dateFrom, 'DD/MM/YYYY').add(1, 'days').toJSON(),
                    dateTo: moment(this.state.dateTo, 'DD/MM/YYYY').add(1, 'days').toJSON()
                })

                this._setState('dialogMessage', 'กำลังโหลดข้อมูล...')
                this.props.clearListItems()
                this.props.searchList()
            } catch (error) {
                this._setState('dialogMessage', error)
            }

            await this.props.setCheckNumber(0)
            this._setState('dialogMessage', null)
        }
    }

    render() {
        return (
            <SearchForm 
                dialogMessage={this.state.dialogMessage}
                dateFrom={this.state.dateFrom}
                dateTo={this.state.dateTo}
                setState={this._setState}
                onSearch={this._onSearch} />
        )
    }
}

const mapStateToProps = (state) => ({
    outstandingBalance: state.outstandingBalance
})

const mapDispatchToProps = (dispatch) => {
    return {
        setInitialState: () => dispatch(setInitialState()),
        setCriteria: (criteria) => dispatch(setCriteria(criteria)),
        clearListItems: () => {
            dispatch(clearListItems())
        },
        searchList: () => {
			dispatch(searchList())
        },
        setCheckNumber: (number) => dispatch(setCheckNumber(number))
        // clearCustomerList: () => {
        //     dispatch(clearCustomerList())
        // }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTSearchForm)