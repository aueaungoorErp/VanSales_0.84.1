import React from 'react'
import { Modal, Text, View, StyleSheet } from 'react-native'
import IButtonGroupRNECustom from '../../../../component/button/IButtonGroupRNECustom'
import QRCode from 'react-native-qrcode-svg'

const ButtonGroup = (props) => {

    const { listItems, renderItem, setState, errorMessage, loadingMessage, qrCode, qrLogo, isQRCodeDialogOpen, qrCodePay } = props

    return (
        <View>
            <IButtonGroupRNECustom 
                renderItem={renderItem}
                listItems={listItems}
                setState={setState}
                errorMessage={errorMessage}
                loadingMessage={loadingMessage} />
            
            <Modal
                animationType="fade"
                transparent={true}
                visible={isQRCodeDialogOpen}
                onRequestClose={() => {
                    setState ? setState('isQRCodeDialogOpen', false) : null
                }}>
                <View 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        backgroundColor: 'rgba(0, 0, 0, 0.30)', 
                        alignItems: 'center', 
                        justifyContent: 'center'
                    }} >

                    <View style={{ width: '80%', height: '80%', backgroundColor: '#FFFFFF', borderRadius: 5 }}>
                        <View 
                            style={{ 
                                flex: 0.1,
                                // width: '100%', 
                                backgroundColor: '#2554C7', 
                                borderTopRightRadius: 5, 
                                borderTopLeftRadius: 5, 
                                alignItems: 'center', 
                                padding: 10,
                                alignItems: 'center', 
                                justifyContent: 'center'
                            }}>
                            <Text style={{ color: '#FFFFFF'}}>Thai QR Payment</Text>
                        </View>
                        <View style={{ flex: 0.1, alignItems: 'center', padding: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>Thai QR Payment</Text>
                        </View>
                        <View 
                            style={{ 
                                flex: 0.6, 
                                // width: '100%', 
                                backgroundColor: '#FFFFFF', 
                                alignItems: 'center',
                                justifyContent: 'center', 
                                // paddingTop: 15, 
                                // paddingBottom: 30,
                            }}>
                                {/* <View style={{ position: 'absolute', zIndex: 998, width: 60, height: 60, borderRadius: 60/2, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{  }}>QR</Text>
                                </View> */}
                                
                                <QRCode
                                    value={qrCode}
                                    size={240}
                                    logo={qrLogo}
                                    logoSize={60}
                                    logoBackgroundColor='transparent' />
                                {/* <View style={{ flex: 0.6, borderWidth: 1, backgroundColor: 'red' }}>
                                    <QRCode
                                        value={qrCode}
                                        size={240}
                                        bgColor='#000000'
                                        fgColor='white'/>
                                </View> */}
                        </View>
                        <View style={{ flex: 0.2, width: '100%', backgroundColor: '#FFFFFF', paddingBottom: 30, borderBottomRightRadius: 5, borderBottomLeftRadius: 5 }}>
                            {/* <View style={{
                                flexDirection: 'row', 
                                justifyContent: 'space-between', 
                                marginHorizontal:10,
                                paddingVertical: 10, 
                                borderBottomWidth: 0.3, 
                                borderTopWidth: 0.3 
                            }}>
                                <Text>เลขที่บัญชี</Text>
                                <Text>260-210-5460</Text>
                            </View> */}
                            <View style={{ 
                                flexDirection: 'row', 
                                justifyContent: 'space-between', 
                                marginHorizontal:10,
                                paddingVertical: 10, 
                                borderBottomWidth: 0.3
                            }}>
                                <Text>จำนวนเงิน</Text>
                                <Text>{ qrCodePay ? qrCodePay : '0' } บาท</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ButtonGroup

