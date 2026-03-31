import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
            
            <View style={{flexDirection: 'row'}}>
                <View style={styles.sectionInline}>

                    <View style={{flex: 0.45, marginHorizontal: 5}}>
                        <IDatePicker
                                label='จาก'
                                value={dateFrom}
                                onDateChange={onDateFromChange} />
                    </View>
                    <View style={{flex: 0.45, marginHorizontal: 5}}>
                        <IDatePicker
                                label='ถึง'
                                value={dateTo}
                                onDateChange={onDateToChange} />
                    </View>

                    <View style={[styles.sectionInline, {flex: 0.1}]}>
                        <AntDesign
                            name='search1' 
                            color={MainTheme.colorPrimary}
                            size={40} 
                            onPress={() => onPress ? onPress() : null} />
                    </View>
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
        marginTop: 5,
        marginBottom: 20,
    },
    sectionInline: {
        flex: 1,
        height: 30, 
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
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