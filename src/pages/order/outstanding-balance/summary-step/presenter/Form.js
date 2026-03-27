import React from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import IPatternChequePaymentSummaryItem from '../../../../../component/item/IPatternChequePaymentSummaryItem'
import { mainContainer } from '../../../../../constant/lov'

const Container = ({ children }) => <View style={{ flex: 1 }}>{children}</View>
const Content = ({ children }) => <ScrollView>{children}</ScrollView>
const Item = ({ style, children }) => <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
const Input = ({ style, ...props }) => <TextInput {...props} style={[{ flex: 1, color: '#000000', paddingVertical: 8, paddingHorizontal: 0 }, style]} />
const Index = (props) => {
    const { outstandingBalance } = props
    console.log('golfxxx', outstandingBalance)
    return (
        <Container>
            <Content>
                {
                    outstandingBalance.header.VPH_CASH_AMT ? 
                    <Item style={styles.rowSection}>
                        <Text style={{ flex: 0.2 }}>เงินสด</Text>
                        <Item style={styles.inputSection}>
                            <Input editable={false} style={{ textAlign: 'right' }} value={outstandingBalance.header.VPH_CASH_AMT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                        </Item>
                    </Item> : null
                }

                {
                    outstandingBalance.header.VPH_TRANSFER_AMT ? 
                    <Item style={styles.rowSection}>
                        <Text style={{ flex: 0.2 }}>โอน</Text>
                        <Item style={styles.inputSection}>
                            <Input editable={false} style={{ textAlign: 'right' }} value={outstandingBalance.header.VPH_TRANSFER_AMT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                        </Item>
                    </Item> : null
                }

                {
                    outstandingBalance.header.VPH_TRANSFER_QR_AMT ? 
                    <Item style={styles.rowSection}>
                        <Text style={{ flex: 0.2 }}>QRCode</Text>
                        <Item style={styles.inputSection}>
                            <Input editable={false} style={{ textAlign: 'right' }} value={outstandingBalance.header.VPH_TRANSFER_QR_AMT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                        </Item>
                    </Item> : null
                }

                {
                    outstandingBalance.header.VPH_CHEQUE1_NO ? 
                    <IPatternChequePaymentSummaryItem 
                        title={'เช็ค1'} 
                        VPH_CHEQUE_BANK={outstandingBalance.header.VPH_CHEQUE1_BANK}
                        VPH_CHEQUE_DATE={outstandingBalance.header.VPH_CHEQUE1_DATE}
                        VPH_CHEQUE_NO={outstandingBalance.header.VPH_CHEQUE1_NO}
                        VPH_CHEQUE_AMT={outstandingBalance.header.VPH_CHEQUE1_AMT} /> : null
                }

                {
                    outstandingBalance.header.VPH_CHEQUE2_NO ? 
                    <IPatternChequePaymentSummaryItem 
                        title={'เช็ค2'} 
                        VPH_CHEQUE_BANK={outstandingBalance.header.VPH_CHEQUE2_BANK}
                        VPH_CHEQUE_DATE={outstandingBalance.header.VPH_CHEQUE2_DATE}
                        VPH_CHEQUE_NO={outstandingBalance.header.VPH_CHEQUE2_NO}
                        VPH_CHEQUE_AMT={outstandingBalance.header.VPH_CHEQUE2_AMT} /> : null
                }

                {
                    outstandingBalance.header.VPH_CHEQUE3_NO ? 
                    <IPatternChequePaymentSummaryItem 
                        title={'เช็ค3'} 
                        VPH_CHEQUE_BANK={outstandingBalance.header.VPH_CHEQUE3_BANK}
                        VPH_CHEQUE_DATE={outstandingBalance.header.VPH_CHEQUE3_DATE}
                        VPH_CHEQUE_NO={outstandingBalance.header.VPH_CHEQUE3_NO}
                        VPH_CHEQUE_AMT={outstandingBalance.header.VPH_CHEQUE3_AMT} /> : null
                }
                
            </Content>
        </Container>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer,
    rowSection: {
        borderBottomWidth: 0,
        borderColor: '#d6d7da',
        flexDirection: 'row',
        marginRight: 10
    },
    inputSection: {
        flex: 0.8
    }
})
