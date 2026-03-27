import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import IButtonGroupCustom from '../../../../component/button/IButtonGroupCustom'
// import Overlay from 'react-native-modal-overlay'
import { ProgressDialog } from 'react-native-simple-dialogs'

const ButtonGroup = (props) => {

    const { listItems, renderItem, message, setMessage} = props
    
    return (
        <View>
            <IButtonGroupCustom listItems={listItems} renderItem={renderItem} style={iButtonGroupCustomStyles} />
{/* 
            <Overlay 
                    visible={message != null}
                    closeOnTouchOutside 
                    animationType="zoomIn"
                    containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                    childrenWrapperStyle={{backgroundColor: '#eee'}}
                    animationDuration={500}
                    onClose={() => {
                        setMessage(null)
                    }}>
                    <Text>{message}</Text>
                </Overlay> */}
            <ProgressDialog
                visible={message}
                message={'กรุณารอสักครู่'}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />
        </View>
    )
}

export default ButtonGroup

const iButtonGroupCustomStyles = StyleSheet.create({
    container: {
        flex: null,
        height: 60, 
        flexDirection: 'row',
        justifyContent: null
    }
})
