import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ProgressDialog } from 'react-native-simple-dialogs'
import ErrorMessage from '../../../../component/announce/ErrorMessage'
import IButtonGroup from '../../../../component/button/IButtonGroup'
import IGrid from '../../../../component/grid/IGrid'
import IList from '../../../../component/list/IList'
import { MainTheme } from '../../../../constant/lov'

const ListItems = (props) => {
    const { 
        renderListItem, 
        renderGridItem, 
        listItems, 
        listStyle, 
        buttons, 
        selectedIndex, 
        updateIndex, 
        errorMessage,
        isLoading,
        setIsLoading } = props
    
    const _renderList = () => {
        return (
            
            <IList 
                data={listItems} 
                renderItem={renderListItem} 
                style={listStyle} />
        )
    }

    const _renderGrid = () => {
        return (
            <IGrid 
                itemDimension={130}
                sections={[{data: listItems}]} 
                renderItem={renderGridItem} 
                style={listStyle} />
        )
    }

    const _renderItem = () => {
        return (
            selectedIndex === 0 ? _renderList() : _renderGrid()
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleSection}>
                <IButtonGroup
                    buttons={buttons}
                    selectedIndex={selectedIndex}
                    onPress={(value) => { updateIndex ? updateIndex(value) : null }}
                    containerStyle={styles.containerStyle}
                    buttonStyle={styles.buttonStyle}
                    selectedButtonStyle={{ backgroundColor: MainTheme.colorPrimary }}
                    selectedTextStyle={{ color: MainTheme.inActivePrimary }}
                    textStyle={{color: MainTheme.colorPrimary}}
                    containerBorderRadius={50} />
            </View>

            {
                !errorMessage ? _renderItem() : null
            }
            <ErrorMessage isDisplaying={errorMessage} message={errorMessage} iconName='warning' type='antdesign' />

            <ProgressDialog
                visible={isLoading}
                message='กำลังโหลดข้อมูล...'
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />

        </View>
    )
}

export default ListItems

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleSection: {
        alignItems: 'flex-end'
    },
    containerStyle: {
        flex: 0.2,
        height:40, 
        borderRadius: 6,
        borderColor: MainTheme.colorPrimary
    },
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary
    }
})