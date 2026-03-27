import React from 'react'
import { connect } from 'react-redux'
import HeaderDetail from '../presenter/HeaderDetail'

const CTHeaderDetail = (props) => {
    return (
        <HeaderDetail header={props.order.header} customer={props.customer.item} />
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