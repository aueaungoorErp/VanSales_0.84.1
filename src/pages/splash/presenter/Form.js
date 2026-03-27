import React from 'react'
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Progress from 'react-native-progress'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { MainTheme } from '../../../constant/lov'

const Form = (props) => {
    const { titleProgress, movingUpDown, vanMoving, errorMessage, refresh, goToScreen, progress } = props

    return (
        <View style={styles.Container}> 
            <View style={{ flex: 0.7, justifyContent: 'space-evenly' }}> 
                <Image
                    style={
                        {
                            width: 500, 
                            height: 350, 
                            alignSelf: 'center'
                        }
                    }
                    resizeMode='contain'
                    source={require('../../../images/Icon_App.png')} />
            </View>

            <View style={{ flex: 0.3, width: 350, paddingVertical: 5  }}> 
                <Progress.Bar progress={progress} width={350} />
                {/* <Animated.View
                    style={{
                        top: movingUpDown,
                        marginBottom: 5,
                        height: 30,
                        width: 40,
                        justifyContent: 'center',
                        marginLeft: vanMoving
                    }} >
                    <Icon 
                        name='van-utility' 
                        type='MaterialCommunityIcons' 
                        style={{ fontSize: 40, color: 'rgba(0, 122, 255, 1)' }} />
                </Animated.View> */}
                {/* <View style={{ height: 10, backgroundColor: 'rgba(0, 122, 255, 1)', borderRadius: 5 }} /> */}
                <Text style={{ marginVertical: 5, fontSize: hp('1.3%') }} allowFontScaling={false} >{titleProgress}</Text>
            </View>
            <Modal
                transparent
                visible={errorMessage !== null}
                animationType='fade'
                onRequestClose={() => {}}>
                <View style={styles.modalOverlay}>
                    <View style={styles.dialogCard}>
                        <Text style={styles.dialogTitle}>เกิดข้อผิดพลาด</Text>
                        <View>
                            <Text style={styles.dialogMessage}>{errorMessage}</Text>
                        </View>
                        <View style={styles.dialogButtonRow}>
                            <TouchableOpacity
                                style={[styles.dialogButton, styles.secondaryDialogButton]}
                                onPress={() => refresh()}>
                                <Text style={styles.secondaryDialogButtonText}>ลองใหม่อีกครั้ง</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.dialogButton, styles.primaryDialogButton]}
                                onPress={() => goToScreen('Login')}>
                                <Text style={styles.primaryDialogButtonText}>ไปหน้า Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
      </View>
    )
}

export default Form

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: MainTheme.colorPrimary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    dialogCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 20,
    },
    dialogTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 12,
    },
    dialogMessage: {
        fontSize: 15,
        color: '#333333',
        marginBottom: 16,
    },
    dialogButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    dialogButton: {
        minWidth: 110,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6,
        marginLeft: 10,
        alignItems: 'center',
    },
    primaryDialogButton: {
        backgroundColor: MainTheme.colorPrimary,
    },
    secondaryDialogButton: {
        backgroundColor: MainTheme.colorSecondary,
        borderWidth: 1,
        borderColor: MainTheme.colorPrimary,
    },
    primaryDialogButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    secondaryDialogButtonText: {
        color: MainTheme.colorPrimary,
        fontWeight: 'bold',
    },
})