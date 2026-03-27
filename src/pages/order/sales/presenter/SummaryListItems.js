import React from 'react'
import { ScrollView, View, StyleSheet,Text } from 'react-native'
import IList from '../../../../component/list/IList'

const SummaryListItems = (props) => {

    const { header, footer, listItems, renderItem, orderType  } = props

    return (
        <View style={{ flex: 1 }}>
        

            {
                orderType !== 'โอนย้ายสินค้า' ? 
                <ScrollView horizontal style={{flex: 1}}>
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
                        stickyHeaderIndices={[0]} />
            }
            
        </View>
    )
}

export default SummaryListItems

