import React from "react"
import { Modal, Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const IOS_STATUS_BAR_FALLBACK = 36

const getModalTopPadding = (topInset) => {
    if (Platform.OS !== 'ios') {
        return topInset
    }

    if (topInset > 0) {
        return Math.max(topInset - 8, 24)
    }

    return IOS_STATUS_BAR_FALLBACK
}

const IModal = (props) => {
    const {
        visible,
        animationType,
        onClose,
        transparent,
        childrenWrapperStyle,
        children } = props;
    const insets = useSafeAreaInsets()
    const topPadding = getModalTopPadding(insets.top)

    const renderDom = (

        <Modal
            animationType={animationType ? animationType : 'slide'}
            transparent={transparent}
            visible={visible}
            onRequestClose={() => { onClose ? onClose() : null}} >

            <View
                style={[
                    styles.childrenWrapper,
                    childrenWrapperStyle,
                    {
                        paddingTop: topPadding,
                        paddingBottom: insets.bottom,
                        paddingLeft: insets.left,
                        paddingRight: insets.right,
                    },
                ]}>
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
