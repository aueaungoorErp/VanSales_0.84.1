import React from 'react'
import { connect } from 'react-redux'
import DetailForm from '../presenter/DetailForm'

const CTDetail = (props) => {
    return (
        <DetailForm data={props.report.sales.item}/>
    )
}

const mapStateToProps = (state) => ({
    report: state.report
})

const mapDispatchToProps = (dispatch) => {
    return {
        
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTDetail)



