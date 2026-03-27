import React, { Component } from 'react'
import { connect } from 'react-redux'
import HeaderDetail from '../../presenter/drop-point/HeaderDetail'

const CTHeaderDetail = (props) => {
    return (
        <HeaderDetail header={props.order.header} />
    )
}

const mapStateToProps = (state) => ({
    order: state.order, 
    customer: state.customer
})

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTHeaderDetail)