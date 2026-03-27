import React from 'react'
import { View, StyleSheet } from 'react-native'
import BackHandlerHOC from '../../../hoc/BackHandlerHOC'
import CTDetailForm from '../container/CTDetailForm'
import CTDetailFormSCR from '../container/CTDetailFormSCR'
import CTButtonGroupSCR from '../container/CTButtonGroupSCR'
import { MainTheme } from '../../../constant/lov'
import Navigator from '../../../services/Navigator'

const EditTo = (props) => {
    const { routes, index } = Navigator.getCurrentRoute()
    const { actionType } = routes[index].params

    return (
        <View style={styles.container}>
            {
                actionType === 'edit' ?
                    <CTDetailForm goodsCodeEditable={false} />
                    :
                    <View style={{ flex: 1}}>
                        <CTDetailFormSCR actionType={actionType} />
                        <CTButtonGroupSCR actionType={actionType} />
                    </View>
            }
        </View>
    )
}

export default BackHandlerHOC(EditTo)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      backgroundColor: MainTheme.colorSecondary
    }
})