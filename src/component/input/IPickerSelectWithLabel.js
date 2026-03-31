import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Item = ({children, style}) => <View style={style}>{children}</View>;

const Form = ({children, style}) => <View style={style}>{children}</View>;

const IPickerSelectWithLabel = (props) => {
    const { label, items, onValueChange, selectedValue, placeholder, enabled, mode } = props

    return (
        <>
            <Item style={styles.container}>
                <Form style={styles.form}>
                    <Text style={{ fontSize: hp('1.7%') ,textAlignVertical:'bottom' }} allowFontScaling={false}>{label}</Text>
                    <Picker
                        note
                        mode="dropdown"
                        style={styles.picker}
                        itemStyle={{ fontSize : 8, color : 'blue' }}
                        enabled={enabled}
                        iosIcon={<AntDesign name='down' size={20} color="#000000" />}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={selectedValue}
                        onValueChange={(value) => {
                            onValueChange ? onValueChange(value) : null
                        }}
                   
                    >
                        <Picker.Item label={placeholder} value={null} style={{ fontSize: 12 }}/>
                        {
                            _items = items.map((item, index) => {
                                return <Picker.Item key={index} label={item.label} value={item.value} style={{ fontSize: 12, height:20 }} />
                            })
                        }
                    </Picker>
                </Form>
            </Item>
        </>
    )
}

export default IPickerSelectWithLabel

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 0,
        borderColor: '#d6d7da',
        flexDirection: 'row',
    },
    form: {
        margin: 2,
        padding: 0,
        flexDirection: 'row',
    },
    inputSection: {
        flex: 0.8
    },
    pickerContainer: {
        flex: 0.8
    },
    picker: {
        height:30 , 
        marginLeft: 17,
      },

})
