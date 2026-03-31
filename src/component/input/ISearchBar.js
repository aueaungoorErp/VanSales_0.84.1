import React from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainTheme } from '../../constant/lov'


const ISearchBar = (props) => (
    <View style={[styles.ContainerStyle, props.style && props.style.containerStyle ? props.style.containerStyle : null]}>
        <View style={[styles.InputContainerStyle, props.style && props.style.inputContainerStyle ? props.style.inputContainerStyle : null]}>
            <AntDesign name='search1' size={20} color={MainTheme.colorButtonBorder} style={{marginHorizontal: 8}} />
            <TextInput
                placeholder={props.placeholder ? props.placeholder : null}
                placeholderTextColor='#999'
                style={[styles.InputStyle, props.style && props.style.inputStyle ? props.style.inputStyle : null, { fontSize: hp('2%'), flex: 1 }]}
                value={props.value ? props.value : ''}
                editable={props.editable}
                returnKeyType={props.returnKeyType ? props.returnKeyType : null}
                onSubmitEditing={props.onSubmitEditing ? (val) => props.onSubmitEditing(val) : null}
                onChange={props.onChange ? (val) => props.onChange(val) : null}
                onChangeText={(val) => {props.onChangeText ? props.onChangeText(val) : null}}
            />
            {props.value ? (
                <TouchableOpacity onPress={() => props.onClear ? props.onClear() : null} style={{paddingHorizontal: 8}}>
                    <AntDesign name='closecircleo' color={MainTheme.colorButtonBorder} size={15} />
                </TouchableOpacity>
            ) : null}
        </View>
    </View>
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
