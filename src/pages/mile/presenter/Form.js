import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

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
        
            <Item style={styles.row}>
                <AntDesign name='dashboard' size={24} color='#2E858E' style={styles.icon} />
                <Input 
                    style={styles.input}
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
        padding: 5,
        flexDirection: 'row',
    },
    row : {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        borderBottomWidth: 1.2,
        borderBottomColor: '#C9D9CF',
        paddingBottom: 8,
        paddingHorizontal: 6,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#1F2A21',
        paddingVertical: 6,
    }
})

