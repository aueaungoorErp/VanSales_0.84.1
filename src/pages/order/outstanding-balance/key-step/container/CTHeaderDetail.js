import React, { Component } from 'react'
import { connect } from 'react-redux'
import HeaderDetail from '../presenter/HeaderDetail'

const CTHeaderDetail = (props) => {
    return (
        <HeaderDetail header={props.order.header} customer={props.customer.item} outstandingBalance={props.outstandingBalance.preProcess} />
    )
}

const mapStateToProps = (state) => ({
    order: state.order, 
    customer: state.customer,
    outstandingBalance: state.outstandingBalance
})

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTHeaderDetail)