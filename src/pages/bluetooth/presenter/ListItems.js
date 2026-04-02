import React from 'react'
import { StyleSheet, View } from 'react-native'

const ListItems = (props) => {

    const { items, renderItem, printingType } = props

    return (
        <View style={styles.container}>
            {
                printingType === 'BLUETOOTH' ? items.map((item, index) => (
                    <View key={item.address || index}>
                        {renderItem({ item })}
                    </View>
                )) : null
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
