import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { mainDivider } from '../../../constant/lov'
import { strings } from '../../../locales/i18n'

const Container = ({children}) => <View style={{flex: 1}}>{children}</View>
const Content = ({children}) => <ScrollView>{children}</ScrollView>
const List = ({children}) => <View>{children}</View>
const ListItem = ({children, onPress, style, itemDivider}) => {
    const content = (
        <View style={[{minHeight: 44, flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16}, itemDivider ? {backgroundColor: '#f5f5f5'} : null, style]}>
            {children}
        </View>
    )

    return onPress ? <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity> : content
}
const Body = ({children}) => <View style={{flex: 1}}>{children}</View>
const Right = ({children}) => <View style={{marginLeft: 12, alignItems: 'flex-end', justifyContent: 'center'}}>{children}</View>

const MenuListItems = (props) => {
    const { listItems, onPress } = props
    
    return (
        <Container>
            <Content>
                <List>
                    <ListItem itemDivider>
                        <Text style={{ fontSize: hp('2%') }} allowFontScaling={false} >{strings('report.title')}</Text>
                    </ListItem>            

                    {
                        listItems.map((item, i) => 
                            <ListItem key={i} onPress={() => onPress(item)} style={mainDivider} >
                                <Body>
                                    <Text style={{ fontSize: hp('2%') }} allowFontScaling={false} >{item.title}</Text>
                                </Body>
                                <Right>
                                    <AntDesign name='right' color='#666' size={24} />
                                </Right>
                            </ListItem>
                        )
                    }        

                </List>
            </Content>
        </Container>
    )
}

export default MenuListItems