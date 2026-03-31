import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const ICON_COMPONENTS = {
    AntDesign,
    'ant-design': AntDesign,
    Entypo,
    entypo: Entypo,
    Feather,
    feather: Feather,
    FontAwesome,
    'font-awesome': FontAwesome,
    FontAwesome5,
    'font-awesome-5': FontAwesome5,
    Ionicons,
    ionicon: Ionicons,
    ionicons: Ionicons,
    MaterialCommunityIcons,
    'material-community': MaterialCommunityIcons,
    MaterialIcons,
    material: MaterialIcons,
    materialIcons: MaterialIcons,
}

export const resolveVectorIconComponent = (type, fallback = AntDesign) => {
    if (!type) {
        return fallback
    }

    return ICON_COMPONENTS[type] || fallback
}