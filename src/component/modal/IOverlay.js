import React from "react"
import { StyleSheet } from 'react-native'
import Overlay from 'react-native-modal-overlay'

const IOverlay = (props) => {
    const { 
        visible, 
        containerStyle, 
        childrenWrapperStyle, 
        closeOnTouchOutside, 
        animationDuration, 
        animationType, 
        onClose, 
        children } = props;

    const renderDom = (
        <Overlay 
            visible={visible}
            closeOnTouchOutside={closeOnTouchOutside}
            animationType={animationType ? animationType : "zoomIn"}
            // animationOutType={animationType ? animationType : "zoomOut"}
            containerStyle={containerStyle ? containerStyle : { backgroundColor: 'rgba(37, 8, 10, 0.78)' }}
            childrenWrapperStyle={childrenWrapperStyle ? childrenWrapperStyle : { backgroundColor: '#eee' }}
            animationDuration={animationDuration ? animationDuration : 500}
            onClose={() => { onClose ? onClose() : null}} >

           {children}
        </Overlay>
    )

    return renderDom 
}

export default IOverlay

const styles = StyleSheet.create({
    containner: {
        borderWidth: 1
    },
    ImageStyle: {
        width: 30, 
        height:30
    },
    TextStyle: {
        fontSize: 18,
    }
})
