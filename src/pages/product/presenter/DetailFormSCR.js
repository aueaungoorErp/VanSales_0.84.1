import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import IList from '../../../component/list/IList'
import ErrorMessage from '../../../component/announce/ErrorMessage'

const DetailFormSCR = (props) => {
    const { 
        header, 
        listItems, 
        renderItem,
        refreshing,
        onRefresh,
        errorMessage
     } = props

    return (
        <View style={{flex: 1}}>
            <ScrollView horizontal>
                <IList 
                    header={header} 
                    data={listItems} 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    renderItem={renderItem}
                    stickyHeaderIndices={[0]} />
            </ScrollView>
            
            <ErrorMessage isDisplaying={errorMessage} message={errorMessage} iconName='warning' type='font-awesome' />
        </View>
    )
}

export default DetailFormSCR

const styles = StyleSheet.create({
    messageBox: {
        height: 30,
        margin: 15
    }
})

const iButtonGroupCustomStyles = StyleSheet.create({
    container: {
        flex: null,
        height: 60, 
        flexDirection: 'row',
        justifyContent: null
    }
})
