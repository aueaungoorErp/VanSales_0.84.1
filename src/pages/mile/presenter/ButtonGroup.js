import React from 'react'
import { View, StyleSheet } from 'react-native'
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom'
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage'

const Form = (props) => {

    const { buttonListItems, renderItem, errorMessage } =  props

    return (
        <View style={styles.container} >
            <View style={styles.messageBox}>
                <ITextWithErrorMessage message={errorMessage} />
            </View>
            <IButtonGroupCustom 
                listItems={buttonListItems} 
                renderItem={renderItem} 
                style={iButtonGroupCustomStyles} />
        </View>
    )
}

export default Form

const styles = StyleSheet.create({
    container: {

    },
    messageBox: {
        marginVertical: 15,
        // height: 30
    }
})

const iButtonGroupCustomStyles = StyleSheet.create({
    container: {
        flex: null,
        height: 60, 
        flexDirection: 'row',
        justifyContent: null
    }
})
