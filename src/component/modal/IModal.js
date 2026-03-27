import React from "react"
import { Modal, StyleSheet, View } from 'react-native'

const IModal = (props) => {
    const { 
        visible, 
        animationType, 
        onClose,
        transparent,
        childrenWrapperStyle,
        children } = props;

    const renderDom = (

        <Modal
            animationType={animationType ? animationType : 'slide'}
            transparent={transparent}
            visible={visible}
            onRequestClose={() => { onClose ? onClose() : null}} >

            <View style={[styles.childrenWrapper, childrenWrapperStyle]}>
                {children}
            </View>

        </Modal>

    )

    return renderDom 
}

export default IModal

const styles = StyleSheet.create({
    childrenWrapper: {
        flex: 1,
    },
    containner: {
        borderWidth: 1,
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    ImageStyle: {
        width: 30, 
        height:30
    },
    TextStyle: {
        fontSize: 18,
    }
})
