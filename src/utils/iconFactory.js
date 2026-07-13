import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const ICON_COMPONENTS = {
    AntDesign,
    antdesign: AntDesign,
    'ant-design': AntDesign,
    MaterialCommunityIcons,
    'material-community': MaterialCommunityIcons,
    'material-design': MaterialCommunityIcons,
    MaterialDesignIcons: MaterialCommunityIcons,
    Entypo,
    entypo: Entypo,
    Feather,
    feather: Feather,
    FontAwesome,
    fontawesome: FontAwesome,
    'font-awesome': FontAwesome,
    FontAwesome5,
    fontawesome5: FontAwesome5,
    'font-awesome-5': FontAwesome5,
    Ionicons,
    ionicon: Ionicons,
    ionicons: Ionicons,
    MaterialIcons,
    material: MaterialIcons,
    materialIcons: MaterialIcons,
    Foundation,
    foundation: Foundation,
}

const ICON_NAME_ALIASES = {
    bluetooth: 'scan1',
    'step-forward': 'stepforward',
    'ios-search': 'search',
}

const ICON_TYPE_OVERRIDES = {
    server: 'material-design',
    fingerprint: 'material-design',
    'qrcode-scan': 'material-design',
}

export const resolveVectorIconComponent = (type, fallback = AntDesign) => {
    if (!type) {
        return fallback
    }

    return ICON_COMPONENTS[type] || fallback
}

export const resolveIconType = (iconName, iconType) => {
    if (iconType) {
        return iconType
    }

    return ICON_TYPE_OVERRIDES[iconName] || 'ant-design'
}

export const resolveIconName = (iconName) => {
    if (!iconName) {
        return 'questioncircleo'
    }

    return ICON_NAME_ALIASES[iconName] || iconName
}

export const VectorIcon = ({
    type,
    name,
    size = 24,
    color = '#333',
    style,
    solid,
    ...rest
}) => {
    const resolvedType = resolveIconType(name, type)
    const IconComponent = resolveVectorIconComponent(resolvedType, AntDesign)
    const resolvedName = resolveIconName(name)

    return (
        <IconComponent
            name={resolvedName}
            size={size}
            color={color}
            style={style}
            solid={solid}
            {...rest}
        />
    )
}
