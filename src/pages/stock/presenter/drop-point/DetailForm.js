import React from 'react'
import { View, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import ITextWithLabel from '../../../../component/text/ITextWithLabel'

const DetailForm = (props) => {
    const { style, item} = props

    return (
        <View style={styles.container}>

            <ITextWithLabel 
                label='รหัสสินค้า' 
                value={item.SKU_CODE}
                style={iTextInputStyles}
                isDisplay={true} />

            <ITextWithLabel 
                label='ชื่อสินค้า' 
                value={item.SKU_NAME}
                style={iTextInputStyles}
                isDisplay={true} />

            <ITextWithLabel 
                // label='ประเภท' 
                // value={item.ICDEPT_THAIDESC}
                style={iTextInputStyles}
                isDisplay={true} />

            <ITextWithLabel 
                // label='ราคาต่อหน่วย' 
                // value={item.ARPLU_U_PRC.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                style={iTextInputStyles}
                isDisplay={true} />

        </View>
    )
}

export default DetailForm

const styles = StyleSheet.create({
    container: {
        height: 120, 
        flexDirection: "column"
    }
})

const iTextInputStyles = StyleSheet.create({
    container: {
        height: 30, 
        flex: 1
    },
    label: {
        flex: 0.2,
        fontSize: hp('2%')
    },
    textInput: {
        flex: 0.8,
        fontSize: hp('2%')
    }
})