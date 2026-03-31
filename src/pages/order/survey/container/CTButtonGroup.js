import React from 'react'
import { connect } from 'react-redux'
import { Alert, TouchableOpacity, Text } from 'react-native'
import ButtonGroup from '../presenter/ButtonGroup'
import { surveyFormButtonGroup, MainTheme } from '../../../../constant/lov'
import Navigator from '../../../../services/Navigator'
import { setErrorMessage, createDocSurvey } from '../../../../action/order'
import { genenrateDocServeyToServer } from '../../../../utils/Order'

const CTButtonGroup = (props) => {

    const _renderItem = (item, key) => (
        <TouchableOpacity key={key} style={[item.buttonStyle, item.containerStyle, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}, props.masterData.SVF.item.SVF_QUESTIONS.length <= 0 && item.title === 'ยืนยัน'  ? true : false  ? { backgroundColor: MainTheme.colorNonary, borderRadius: 0 } : null]} onPress={() => {_onPress(item)}} disabled={props.masterData.SVF.item.SVF_QUESTIONS.length <= 0 && item.title === 'ยืนยัน'  ? true : false } activeOpacity={0.7}>
              <Text style={item.titleStyle}>{item.title}</Text>
            </TouchableOpacity>
    )

    const _onPress = (item) => {
        if (item.methodType === 'function') {
            if (item.methodName === 'confirm') {
                _createDocSurvey()
            } else if (item.methodName === 'cancel') {
                Navigator.back()
            }
        }
    }

    const _createDocSurvey = async () => {
        try {
            props.setErrorMessage(true)
            await props.createDocSurvey(
                genenrateDocServeyToServer(
                    props.customer.item.INFO.AR_KEY, 
                    props.order.survey.VDI_ANS,
                    props.mile.item.mileage, 
                    props.geolocation.position
                )
            )
            props.setErrorMessage(false)
            _alertDialog()
        } catch (error) {
            props.setErrorMessage('เกิดข้อผิดพลาด: ' +  error)
        }
    }

    const _alertDialog = (item) => Alert.alert(
        'ประกาศ',
        'บันทึกรายการเรียบร้อย',
        [
            {
                text: 'ตกลง', onPress: () => Navigator.navigate('OrderChoice')
            }
        ],
        { cancelable: false }
    )

    const _setMessage= (value) => {
        props.setErrorMessage(value)
    }

    return (
        <ButtonGroup 
            listItems={surveyFormButtonGroup}
            renderItem={_renderItem}
            message={props.order.errorMessage}
            setMessage={_setMessage} />
    )
}

const mapStateToProps = (state) => ({
    masterData: state.masterData,
    order: state.order,
    customer: state.customer,
    mile: state.mile,
    geolocation: state.geolocation
})

const mapDispatchToProps = (dispatch) => {
    return {
        createDocSurvey: (data) => dispatch(createDocSurvey(data)), 
        setErrorMessage: (value) => {
            dispatch(setErrorMessage(value))
        }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTButtonGroup)