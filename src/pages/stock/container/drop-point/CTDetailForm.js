
import React from 'react'
import { connect } from 'react-redux'
import DetailForm from '../../presenter/drop-point/DetailForm'

const CTDetailForm = (props) => {

    return (
        <DetailForm item={props.product.item} />
    )
}

const mapStateToProps = (state) => ({
    product: state.product
})

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTDetailForm)