import React from 'react'
import { StyleSheet, View } from 'react-native'
import { MainTheme } from '../../../../constant/lov'


const SearchForm = (props) => {
    const { value, setState, onSearch, onRefresh } = props
  
    return (
        <View style={styles.container}>
       
            <View style={{ borderBottomWidth: 0.5, width: '100%', borderColor: MainTheme.colorButtonBorder }}></View>
        </View>
    )

}

export default SearchForm

const styles = StyleSheet.create({
    container: {
    }
})