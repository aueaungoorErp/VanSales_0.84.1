import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Item = ({ children, style }) => <View style={style}>{children}</View>

const Input = React.forwardRef(({ value, style, ...props }, ref) => (
    <TextInput
        ref={ref}
        value={value === null || value === undefined ? '' : String(value)}
        style={style}
        underlineColorAndroid="transparent"
        {...props}
    />
))

const Forms = (props) => {
    const { photo, ontakePicturePress, value, onChangeText, isLoading, setIsLoading } = props

    return (
        <View style={styles.container}>
        {
            // <IUpload 
            //     rounded={true}
            //     photo={photo} 
            //     ontakePicturePress={ontakePicturePress} />
        }

            <Item>
                <Ionicons name='ios-speedometer' size={24} color='#000000' />
                <Input 
                    // ref={ (ref) => ref ? ref._root.focus() : null }
                    placeholder='เลขไมล์รถ' 
                    placeholderTextColor='#d6d7da' 
                    value={value} 
                    keyboardType='numeric'
                    onChangeText={onChangeText}
                    maxLength={7} />
            </Item>
            
        </View>
    )
    
}

export default Forms

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        padding: 5
    }
})

