import React from 'react'
import { View, StyleSheet } from 'react-native'
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage'
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage'
import ILoading from '../../../component/loading/ILoading'
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom'

const ButtonGroupSCR = (props) => {
    const { 
        successMessage,
        errorMessage,
        isLoading,
        listItems,
        renderItem } = props

    return (
        <View>
            <View style={styles.messageBox}>
                    <ITextWithSuccessMessage message={successMessage} />
                    <ITextWithErrorMessage message={errorMessage} />
                    <ILoading isLoading={isLoading} />
                </View>
                
                <IButtonGroupCustom 
                    listItems={listItems} 
                    renderItem={renderItem} 
                    style={iButtonGroupCustomStyles} />
       </View>
    )
}
export default ButtonGroupSCR

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