import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainTheme } from '../../../constant/lov'
import { strings } from '../../../locales/i18n'

const Container = ({children}) => <View style={styles.container}>{children}</View>
const Content = ({children}) => <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView>
const List = ({children}) => <View>{children}</View>
const ListItem = ({children, onPress, style, itemDivider}) => {
    const content = (
        <View style={[
            styles.baseRow,
            itemDivider ? styles.headerCard : styles.menuCard,
            style,
        ]}>
            {children}
        </View>
    )

    return onPress ? <TouchableOpacity onPress={onPress} activeOpacity={0.75}>{content}</TouchableOpacity> : content
}
const Body = ({children}) => <View style={styles.body}>{children}</View>
const Right = ({children}) => <View style={styles.right}>{children}</View>

const MenuListItems = (props) => {
    const { listItems, onPress } = props
    
    return (
        <Container>
            <Content>
                <List>
                    <ListItem itemDivider>
                        <View style={styles.headerContainer}>
                            <AntDesign name='setting' size={26} color={MainTheme.colorPrimary} />
                            <Text style={styles.headerTitle} allowFontScaling={false}>{strings('report.title')}</Text>
                        </View>
                    </ListItem>            

                    {
                        listItems.map((item, i) => 
                            <ListItem key={i} onPress={() => onPress(item)}>
                                <Body>
                                    <Text style={styles.itemTitle} allowFontScaling={false} >{item.title}</Text>
                                    <Text style={styles.itemSubtitle} allowFontScaling={false}>แตะเพื่อเปิดรายงานนี้</Text>
                                </Body>
                                <Right>
                                    <View style={styles.chevronBadge}>
                                        <AntDesign name='right' color={MainTheme.colorPrimary} size={18} />
                                    </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7F6',
    },
    scrollContent: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 20,
    },
    baseRow: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    headerCard: {
        backgroundColor: '#EAF6EF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#D6EAD9',
        marginBottom: 10,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E3E8E6',
        marginBottom: 10,
    },
    body: {
        flex: 1,
    },
    right: {
        marginLeft: 12,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    eyebrow: {
        fontSize: hp('1.35%'),
        color: '#6A8D76',
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: hp('2.25%'),
        color: '#1F3B2F',
        fontWeight: '700',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: hp('1.55%'),
        color: '#587060',
    },
    itemTitle: {
        fontSize: hp('1.95%'),
        color: '#22312B',
        fontWeight: '700',
        marginBottom: 2,
    },
    itemSubtitle: {
        fontSize: hp('1.45%'),
        color: '#718076',
    },
    chevronBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2FBF7',
    },
    headerContainer : {
        flexDirection:'row',
        alignItems:'center',
        gap:10
    }
})