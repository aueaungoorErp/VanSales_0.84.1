import React from 'react'
import { View, Text } from 'react-native'
import IList from '../../../component/list/IList'
import ErrorMessage from '../../../component/announce/ErrorMessage'
import SnackBar from 'react-native-snackbar-component'
import { ProgressDialog, ConfirmDialog } from 'react-native-simple-dialogs'

const ListItems = (props) => {
    const { header, listItems, renderItem } = props


    return (
        <View style={{ flex: 1 }}>
           <IList header={header} data={listItems} renderItem={renderItem} />
        </View>
    )
}

export default ListItems
