import React from 'react'
import { View, StyleSheet } from 'react-native'
import IList from '../../../component/list/IList'
import { MainTheme } from '../../../constant/lov'

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
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      backgroundColor: MainTheme.colorSecondary,
      padding: 5
    },
    buttonStyle: {
  
    }
  
})
