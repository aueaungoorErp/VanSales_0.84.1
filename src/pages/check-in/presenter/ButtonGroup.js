import React from 'react'
import { View, StyleSheet } from 'react-native'
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom'

const Form = (props) => {

    const { buttonListItems, renderItem, errorMessage } =  props

    return (
        <View style={styles.container} >
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