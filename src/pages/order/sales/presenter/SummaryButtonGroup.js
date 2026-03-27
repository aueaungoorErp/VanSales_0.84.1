import React from 'react'
import { View, StyleSheet } from 'react-native'
import IButtonGroupCustom from '../../../../component/button/IButtonGroupCustom'
import ITextWithErrorMessage from '../../../../component/text/ITextWithErrorMessage'
import ILoading from '../../../../component/loading/ILoading'

const ButtonGroup = (props) => {

    const { listItems, renderItem, isLoading, errorMessage } = props
    
    return (
        <View>
            <View style={styles.messageBox}>
                    <ITextWithErrorMessage message={errorMessage} />
                    <ILoading isLoading={isLoading} />
                </View>
            <IButtonGroupCustom listItems={listItems} renderItem={renderItem} style={iButtonGroupCustomStyles} />
        </View>
    )
}

export default ButtonGroup

const styles = StyleSheet.create({
    messageBox: {
        height: 30,
        margin: 15
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
