import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
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
    const {
        value,
        onChangeText,
        showMileageWarning,
        mileageWarningMessage,
    } = props

    return (
        <View style={styles.container}>
            <Item
                style={[
                    styles.row,
                    showMileageWarning ? styles.rowWarning : null,
                ]}>
                <AntDesign
                    name='dashboard'
                    size={24}
                    color={showMileageWarning ? '#D64545' : '#2E858E'}
                    style={styles.icon}
                />
                <Input
                    style={[
                        styles.input,
                        showMileageWarning ? styles.inputWarning : null,
                    ]}
                    placeholder='เลขไมล์รถ'
                    placeholderTextColor='#d6d7da'
                    value={value}
                    keyboardType='numeric'
                    onChangeText={onChangeText}
                    maxLength={7}
                />
            </Item>

            {showMileageWarning ? (
                <Text style={styles.warningText} allowFontScaling={false}>
                    {mileageWarningMessage}
                </Text>
            ) : null}
        </View>
    )
}

export default Forms

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        padding: 5,
        width: '100%',
    },
    row : {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        minHeight: 48,
        borderBottomWidth: 1.2,
        borderBottomColor: '#C9D9CF',
        paddingBottom: 8,
        paddingHorizontal: 6,
    },
    rowWarning: {
        borderBottomColor: '#D64545',
        backgroundColor: '#FFF5F5',
        borderRadius: 8,
        paddingTop: 6,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#1F2A21',
        paddingVertical: 6,
    },
    inputWarning: {
        color: '#D64545',
    },
    warningText: {
        marginTop: 8,
        marginHorizontal: 6,
        fontSize: 14,
        color: '#D64545',
        fontWeight: '600',
    },
})
