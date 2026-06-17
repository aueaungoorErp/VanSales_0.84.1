import React, { useEffect, useRef } from 'react'
import { Alert, View, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { mainContainer, MainTheme } from '../../../constant/lov'
import CTForm from '../container/CTForm'
import CTButtonGroup from '../container/CTButtonGroup'
import CTMap from '../container/CTMap'
import CTHeader from '../../user/container/CTHeader'
import {
    assessLongdoApiKeyAvailability,
    getLongdoApiKeyAlertMessage,
} from '../../../services/longdomap'
import { getUserToken } from '../../../utils/Token'

const Index = (props) => {
    const alertReasonRef = useRef(null)
    const checkLongdoApiKeys = React.useCallback(() => {
        let mounted = true

        const run = async () => {
            const userToken = await getUserToken()
            const vanCode = String(userToken?.VANCONFIG?.VANCNF_MACHINE || '').trim()
            const availability = await assessLongdoApiKeyAvailability(vanCode)

            if (!mounted || availability.ok) {
                if (availability.ok) {
                    alertReasonRef.current = null
                }
                return
            }

            if (alertReasonRef.current === availability.reason) {
                return
            }

            alertReasonRef.current = availability.reason
            Alert.alert('แจ้งเตือน', getLongdoApiKeyAlertMessage(availability.reason))
        }

        void run()

        return () => {
            mounted = false
        }
    }, [])

    useFocusEffect(checkLongdoApiKeys)

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CTHeader />
            </View>
            <View style={styles.body} >
                <View style={styles.mapSection}>
                    <CTMap />
                </View>
                <View style={styles.detailSection}>
                    <CTForm />
                </View>
            </View>
            
            <CTButtonGroup />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer,
    header: {
        flex: 0.3, 
        flexDirection: 'column',
        backgroundColor: MainTheme.colorQuinary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        flex: 0.7
    },
    detailSection: {
        flex: 0.5,
        overflow: 'hidden'
    },
    mapSection: {
        flex: 0.5, 
        overflow: 'hidden'
    }
})
