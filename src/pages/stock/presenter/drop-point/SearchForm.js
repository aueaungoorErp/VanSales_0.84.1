import React from 'react'
import { StyleSheet, View } from 'react-native'
import { MainTheme } from '../../../../constant/lov'


const SearchForm = (props) => {
    const { value, setState, onSearch, onRefresh } = props
  
    return (
        <View style={styles.container}>
        {
            // <View style={{flexDirection: 'row', justifyContent: 'center',  alignItems: 'center' }}>
            //     <View style={{ flex: 0.8 }}>
            //         <ISearchBar 
            //             value={value}
            //             round={true} 
            //             lightTheme={false} 
            //             placeholder="รหัส, จุดกระจายสินค้า" 
            //             returnKeyType='search' 
            //             onChangeText={(value) => setState ? setState('textSearch', value) : null}
            //             onSubmitEditing={() => onSearch ? onSearch() : null}
            //             onClear={() => {setState ?   setState('textSearch', null) : null}} />
            //     </View>

            //     <TouchableOpacity 
            //         onPress={() => { onSearch ? onSearch() : null}}
            //         style={{flex: 0.1, height: 35}} >
            //         <Icon name='search1' type='AntDesign' style={{ color: MainTheme.colorQuaternary }} />
            //     </TouchableOpacity>

            //     <TouchableOpacity 
            //         onPress={() => { onRefresh ? onRefresh() : null}}
            //         style={{flex: 0.1, height: 35}} >
            //         <Icon name='cycle' type='Entypo' style={{ color: MainTheme.colorTertiary }} />
            //     </TouchableOpacity>
            // </View>
        }
            <View style={{ borderBottomWidth: 0.5, width: '100%', borderColor: MainTheme.colorButtonBorder }}></View>
        </View>
    )

}

export default SearchForm

const styles = StyleSheet.create({
    container: {
    }
})