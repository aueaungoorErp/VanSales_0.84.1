import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import Form from '../presenter/Form'
import { setOrderVisitVdiVisit } from '../../../../action/order'

const CTForm = (props) => {
    
    const _setVanVitRItem = async (value) => {
        await props.setOrderVisitVdiVisit(value)
    }

    return (
        <View >
            <Form 
                vanVitRListItems={props.masterData.VANVISR.listItems}
                vanVitRItem={props.order.visit.item.VDI_VISIT}
                setVanVitRItem={_setVanVitRItem} />
        </View>
    )
    
}

const mapStateToProps = (state) => ({
    order: state.order,
    masterData: state.masterData
})

const mapDispatchToProps = (dispatch) => {
    return {
        setOrderVisitVdiVisit: (value) => dispatch(setOrderVisitVdiVisit(value))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTForm)
