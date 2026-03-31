import { StyleSheet, Text, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainTheme } from "../../constant/lov"

const ITextWithIcon = (props) => {
    const { iconName, iconType, iconSize, value, isDisplay, style } = props

    const renderDom = (
        <View style={[styles.container, style && style.container ? style.container : null]} > 
            <AntDesign 
                name={iconName || 'infocirlceo'} 
                size={iconSize ? iconSize : 20}
                color={MainTheme.colorPrimary} 
                style={[styles.iconStyle, style && style.iconStyle ? style.iconStyle : null]} />

            <Text style={[styles.textStyle, style && style.textStyle ? style.textStyle : null]}>{value}</Text>
        </View>
    )

    return isDisplay ? renderDom : null;
} 

export default ITextWithIcon

const styles = StyleSheet.create({
    container: {
        height: 40, 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 5
    },
    iconStyle: {

    },
    textStyle: {
        marginLeft: 5
    }
})