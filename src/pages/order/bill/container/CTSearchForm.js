import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchForm from '../presenter/SearchForm'
import moment from 'moment'
import { setInitialState, billSearchListItems, setCriteria, billClearListItems } from '../../../../action/bill'

class CTSearchForm extends Component { 
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
        if (!this.props.bill.isLoading) {
            try { 
                await this.props.setCriteria({
                    ...this.props.bill.criteria,
                    dateFrom: moment(this.state.dateFrom, 'DD-MM-YYYY').add(1, 'days').toJSON(),
                    dateTo: moment(this.state.dateTo, 'DD-MM-YYYY').add(1, 'days').toJSON()
                })

                this._setState('dialogMessage', 'กำลังโหลดข้อมูล...')
                this.props.billClearListItems()
                this.props.billSearchListItems()
            } catch (error) {
                this._setState('dialogMessage', error)
            }

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
    bill: state.bill
})

const mapDispatchToProps = (dispatch) => {
    return {
        setInitialState: () => dispatch(setInitialState()),
        setCriteria: (criteria) => dispatch(setCriteria(criteria)),
        billSearchListItems: (dateFrom, dateTo) => {
            dispatch(billSearchListItems(dateFrom, dateTo))
        },
        billClearListItems: () => {
            dispatch(billClearListItems())
        }
        // searchCustomerList: () => {
		// 	dispatch(searchCustomerList())
        // },
        // clearCustomerList: () => {
        //     dispatch(clearCustomerList())
        // }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTSearchForm)