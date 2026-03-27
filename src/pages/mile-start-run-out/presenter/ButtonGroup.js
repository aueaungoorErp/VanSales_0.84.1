import React from 'react'
import { View, StyleSheet } from 'react-native'
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom'
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage'
import ILoading from '../../../component/loading/ILoading'

const Form = (props) => {

    const { buttonListItems, renderItem, errorMessage, isLoading } =  props

    return (
        <View style={styles.container} >
            <View style={styles.messageBox}>
                <ITextWithErrorMessage message={errorMessage} />
            </View>
            <View style={styles.messageBox}>
                <ILoading isLoading={isLoading} />
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
