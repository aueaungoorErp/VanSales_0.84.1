import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { MainTheme } from '../../../../constant/lov'
import IDatePicker from '../../../../component/input/IDatePicker'

const SearchForm = (props) => {
    const { dateFrom, dateTo, onSearch, dialogMessage, setState } = props

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.sectionInline}>
                    <View style={{flex: 0.45, marginHorizontal: 5}}>
                        <IDatePicker
                            label='จาก'
                            value={dateFrom}
                            onDateChange={(value) => { setState ? setState('dateFrom', value) : null }} />
                    </View>

                    <View style={{flex: 0.45, marginHorizontal: 5}}>
                        <IDatePicker
                            label='ถึง'
                            value={dateTo}
                            onDateChange={(value) => {setState ? setState('dateTo', value) : null}} />
                    </View>
                    <View style={[styles.sectionInline, {flex: 0.1}]}>
                        <Icon
                            name='ios-search' 
                            color={MainTheme.colorPrimary}
                            size={30} 
                            type={'ionicon'}
                            onPress={() => onSearch ? onSearch() : null} />

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
        // paddingTop: 2,
        // paddingBottom: 2,
        // justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    disabled: {
        backgroundColor: '#FFF'
    }
})