import React from 'react'
import { StyleSheet, View } from 'react-native'
import IList from '../../../component/list/IList'

const ListItems = (props) => {

    const { items, renderItem, printingType } = props

    return (
        <View style={styles.container}>
            {
                printingType === 'BLUETOOTH' ? <IList data={items} renderItem={renderItem} horizontal={false} /> : null
            }
        </View>
    )
}

export default ListItems

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      backgroundColor: '#F4F6F8',
      padding: 5
    },
    buttonStyle: {
  
    }
  
})
