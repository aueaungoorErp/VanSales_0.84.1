import React from 'react'
import { StyleSheet } from 'react-native'
import { Icon, SearchBar} from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { MainTheme } from '../../constant/lov'


const ISearchBar = (props) => (
    <SearchBar
        ref={search => searchBar = search}
        round={props.round ? props.round : false}
        lightTheme={props.lightTheme ? props.lightTheme : false}
        searchIcon={props.searchIcon ? props.searchIcon : {size: 24, color: MainTheme.colorButtonBorder}}
        placeholder={props.placeholder ? props.placeholder : null}
        // placeholderTextColor={MainTheme.placeholder}
        showLoading={props.showLoading ? props.showLoading : false}
        inputContainerStyle={[styles.InputContainerStyle, props.style && props.style.inputContainerStyle ? props.style.inputContainerStyle : null]}
        inputStyle={[styles.InputStyle, props.style && props.style.inputStyle ? props.style.inputStyle : null, { fontSize: hp('2%') } ]}
        containerStyle={[styles.ContainerStyle, props.style && props.style.containerStyle ? props.style.containerStyle : null]}
        value={props.value ? props.value : null}
        editable={props.editable} 
        returnKeyType={props.returnKeyType ? props.returnKeyType : null}
        onSubmitEditing={props.onSubmitEditing ? (val) => props.onSubmitEditing(val) : null}
        onChange={props.onChange ? (val) => props.onChange(val) : null}
        onChangeText={(val) => {props.onChangeText ? props.onChangeText(val) : null}}
        onClear={props.onClear ? () => props.onClear() : null}
        onCancel={props.onCancel ? () => props.onCancel() : null}
        clearIcon={
            <Icon 
                type='font-awesome' 
                name='times-circle' 
                color={MainTheme.colorButtonBorder } 
                size={15} 
                underlayColor={MainTheme.colorSecondary} 
                onPress={() => props.onClear()} />
        } />
)

export default ISearchBar

const styles = StyleSheet.create({
    Container: {
        backgroundColor: MainTheme.colorSecondary,
        borderRadius: 5,
        marginVertical: 3,
        borderWidth: .5,
        borderColor: '#000'
    },
    ContainerStyle: {
        borderTopWidth: 0, 
        borderBottomWidth: 0, 
        borderRadius: 5,
        marginTop: 3,
        marginBottom: 3,
        backgroundColor: MainTheme.colorSecondary,
        
    },
    InputContainerStyle: {
        borderWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: MainTheme.colorButtonBorder,
        backgroundColor: MainTheme.colorSecondary
    },
    InputStyle: {
        fontSize: 12,
        color: '#000000'
        // backgroundColor: MainTheme.colorSecondary,
        // borderRadius: 5,
        // borderWidth: .5,
    }
})
