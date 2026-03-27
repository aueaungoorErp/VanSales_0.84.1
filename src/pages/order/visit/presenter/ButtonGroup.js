import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import IButtonGroupCustom from '../../../../component/button/IButtonGroupCustom'
import ITextWithSuccessMessage from '../../../../component/text/ITextWithSuccessMessage'
import ITextWithErrorMessage from '../../../../component/text/ITextWithErrorMessage'
import ILoading from '../../../../component/loading/ILoading'

const ButtonGroup = (props) => {

    const { listItems, renderItem, successMessage, errorMessage, isLoading} = props
    
    return (
        <View>
            <View style={styles.messageBox}>
                <ITextWithSuccessMessage message={successMessage} />
                <ITextWithErrorMessage message={errorMessage} />
                <ILoading isLoading={isLoading} />
            </View>

            <IButtonGroupCustom listItems={listItems} renderItem={renderItem} style={iButtonGroupCustomStyles} />

        </View>
    )
}

export default ButtonGroup

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
