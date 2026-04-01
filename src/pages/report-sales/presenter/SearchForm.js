import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IDatePicker from '../../../component/input/IDatePicker'
import { MainTheme } from '../../../constant/lov'

const SearchForm = (props) => {
    const { 
        dateFrom, 
        dateTo, 
        onDateFromChange, 
        onDateToChange, 
        style, 
        onPress,
        errorMessage,
        isLoading,
        loadingMessage,
        setState } = props

    return (
        <View style={[styles.container, style && style.container ? style.container : null]}>
            

            <View style={styles.searchCard}>

                <View style={styles.controlsRow}>
                    <View style={styles.fieldsRow}>
                    <View style={styles.fieldCard}>
                        <Text style={styles.fieldLabel} allowFontScaling={false}>จาก</Text>
                        <IDatePicker
                            value={dateFrom}
                            hideBorder
                            inputTextStyle={styles.dateValueText}
                            onDateChange={onDateFromChange} />
                    </View>
                    <View style={styles.fieldCard}>
                        <Text style={styles.fieldLabel} allowFontScaling={false}>ถึง</Text>
                        <IDatePicker
                            value={dateTo}
                            hideBorder
                            inputTextStyle={styles.dateValueText}
                            onDateChange={onDateToChange} />
                    </View>

                    </View>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.actionButton}
                        onPress={() => onPress ? onPress() : null}>
                        <AntDesign name='search1' color={MainTheme.colorSecondary} size={20} style={styles.actionIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <ProgressDialog
                visible={isLoading}
                message={loadingMessage}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />

            <ConfirmDialog
                title='เกิดข้อผิดพลาด'
                visible={errorMessage !== null}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () => setState('errorMessage', null)
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} >
                <View>
                    <Text>{errorMessage}</Text>
                </View>
            </ConfirmDialog>
        </View>
    )
}

export default SearchForm

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingHorizontal: 14,
        paddingTop: 4,
        paddingBottom: 10,
    },
    heroCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EAF6EF',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#D6EAD9',
        marginBottom: 12,
    },
    heroBadge: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: MainTheme.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    heroCopy: {
        flex: 1,
    },
    eyebrow: {
        fontSize: 12,
        color: '#6A8D76',
        fontWeight: '700',
        marginBottom: 2,
    },
    heroTitle: {
        fontSize: 22,
        color: '#1F3B2F',
        fontWeight: '700',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 13,
        color: '#587060',
        lineHeight: 19,
    },
    searchCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E1EAE4',
        paddingHorizontal: 14,
        paddingVertical: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 15,
        color: '#355244',
        fontWeight: '700',
        marginBottom: 12,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    fieldsRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 12,
    },
    fieldCard: {
        flex: 1,
        backgroundColor: '#F7FAF8',
        borderWidth: 1,
        borderColor: '#DEE9E3',
        borderRadius: 14,
        paddingHorizontal: 12,
        justifyContent: 'center',
        marginHorizontal: 4,
        height: 55,
        gap:0
    },
    fieldLabel: {
        fontSize: 13,
        color: '#4E685A',
        fontWeight: '700',
    },
    dateValueText: {
        fontSize: 13,
    },
    actionButton: {
        width: 60,
        minHeight: 50,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 0,
        backgroundColor: MainTheme.colorPrimary,
    },
    actionIcon: {
        marginRight: 0,
    },
    dateIcon: {
        position: 'absolute',
        right: 0,
        top: 4,
        marginLeft: 0,
        height: 22
    },
    dateInput: {
        height: 35,
        borderWidth: 0,
        borderColor: '#d6d7da',
        borderBottomWidth: 1,
        alignItems: 'flex-start'
    },
    disabled: {
        backgroundColor: '#FFF'
    }
})

const customIDatePickerWithLabelStyle = StyleSheet.create({
    container: {
        flex: 0.5
    },
    
})

const datePickerStyle = StyleSheet.create({
    container: {
        flex: 0.5
    }
})