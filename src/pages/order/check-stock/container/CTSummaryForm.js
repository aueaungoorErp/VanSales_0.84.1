import React from 'react'
import { connect } from 'react-redux'
import SummaryForm from '../presenter/SummaryForm'

class CTSummaryForm extends React.Component {

    render() {
        return (
            <SummaryForm order={this.props.order} />
        )
    }
}

const mapStateToProps = (state) => ({
    order: state.order
})

const mapDispatchToProps = (dispatch) => {
    return { 
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTSummaryForm)