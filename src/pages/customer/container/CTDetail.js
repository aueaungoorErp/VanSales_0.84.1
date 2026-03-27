
import React from 'react'
import { connect } from 'react-redux'
import Detail from '../presenter/Detail'

const CTDetail = (props) => {
    return (
        <Detail customer={props.customer.item} />
    )
}

const mapStateToProps = (state) => ({
    customer: state.customer
})

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTDetail)