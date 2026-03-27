import React from 'react'
import { connect } from 'react-redux'
import { setModal } from '../../../action/product'
import SearchSection from '../presenter/SearchSection'

const CTSearchSection = (props) => {

    const _onSearchIconPress = () => {

    }

    const _setModal = (bool) => {
        props.setModal(bool)
    }

    return (
        <SearchSection 
            visible={props.product.isModalOpen}
            onSearchIconPress={_onSearchIconPress}
            setModel={_setModal} 
            children={props.children}/>
    )
}

const mapStateToProps = (state) => ({
    product: state.product
})

const mapDispatchToProps = (dispatch) => {
    return {
        setModal: (bool) => {
			dispatch(setModal(bool))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTSearchSection)

