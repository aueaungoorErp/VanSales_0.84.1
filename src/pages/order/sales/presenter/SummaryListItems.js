import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import IList from '../../../../component/list/IList'

const SummaryListItems = (props) => {

    const { header, footer, listItems, renderItem, orderType  } = props

    return (
        <View style={styles.container}>
        

            {
                orderType !== 'โอนย้ายสินค้า' ? 
                <ScrollView horizontal style={styles.horizontalScroll} contentContainerStyle={styles.horizontalScrollContent}>
                    <IList 
                        header={header} 
                        footer={footer}
                        data={listItems} 
                        renderItem={renderItem}
                        stickyHeaderIndices={[0]} />
                </ScrollView>
                :
                <IList 
                        header={header} 
                        footer={footer}
                        data={listItems} 
                        renderItem={renderItem}
                        stickyHeaderIndices={[0]}
                        style={{flatListStyle: styles.flatList}} />
            }
            
        </View>
    )
}

export default SummaryListItems

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E3E8E6',
        overflow: 'hidden',
        marginBottom: 10,
    },
    horizontalScroll: {
        flex: 1,
    },
    horizontalScrollContent: {
        paddingBottom: 6,
    },
    flatList: {
        flex: 1,
    },
})

