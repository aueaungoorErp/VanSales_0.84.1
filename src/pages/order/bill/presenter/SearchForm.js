import React from 'react'
import { StyleSheet, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IDatePicker from '../../../../component/input/IDatePicker'
import { MainTheme } from '../../../../constant/lov'

const SearchForm = (props) => {
    const { dateFrom, dateTo, onSearch, dialogMessage, setState } = props

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.sectionInline}>
                    <View style={styles.dateField}>
                        <IDatePicker
                            label='จาก'
                            value={dateFrom}
                            onDateChange={(value) => { setState ? setState('dateFrom', value) : null }} />
                    </View>

                    <View style={styles.dateField}>
                        <IDatePicker
                            label='ถึง'
                            value={dateTo}
                            onDateChange={(value) => {setState ? setState('dateTo', value) : null}} />
                    </View>

                    <View style={styles.searchButtonWrap}>
                        <AntDesign
                            name='search1'
                            color={MainTheme.colorSecondary}
                            size={20}
                            onPress={() => onSearch ? onSearch() : null}
                            style={styles.searchIcon} />
                    </View>
                </View>
            </View>
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
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    sectionInline: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    dateField: {
        flex: 0.45,
        marginHorizontal: 5,
        justifyContent: 'flex-end',
    },
    searchButtonWrap: {
        flex: 0.1,
        minHeight: 38,
        marginLeft: 4,
        borderRadius: 12,
        backgroundColor: MainTheme.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    searchIcon: {
        textAlign: 'center',
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
        // paddingTop: 2,
        // paddingBottom: 2,
        // justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    disabled: {
        backgroundColor: '#FFF'
    }
})