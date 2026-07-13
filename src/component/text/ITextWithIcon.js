import { StyleSheet, Text, View } from 'react-native'
import { MainTheme } from "../../constant/lov"
import { VectorIcon } from '../../utils/iconFactory'

const ITextWithIcon = (props) => {
    const { iconName, iconType, iconSize, value, isDisplay, style } = props

    const renderDom = (
        <View style={[styles.container, style && style.container ? style.container : null]} > 
            <VectorIcon
                name={iconName || 'infocirlceo'}
                type={iconType || 'ant-design'}
                size={iconSize ? iconSize : 20}
                color={MainTheme.colorPrimary}
                style={[styles.iconStyle, style && style.iconStyle ? style.iconStyle : null]}
            />

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
