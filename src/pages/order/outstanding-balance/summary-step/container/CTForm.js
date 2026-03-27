import React from 'react'
import { connect } from 'react-redux'
import Form from '../presenter/Form'


class CTForm extends React.Component { 
    _isMounted = false

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Form outstandingBalance={this.props.outstandingBalance.create} />
        )
    }
}

const mapStateToProps = (state) => ({
    outstandingBalance: state.outstandingBalance
})

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTForm)