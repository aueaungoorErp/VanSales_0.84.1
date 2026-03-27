import React from 'react'
import Navigator from '../../../services/Navigator'
import MenuListItems from '../presenter/MenuListItems'
import { reportMenu } from '../../../constant/lov'

const CTMenuListItems = (props) => {

    const _onPress = (item) => {
        Navigator.navigate(item.screen, {
            params: item
        })
    }

    return (
        <MenuListItems listItems={reportMenu} onPress={_onPress} />
    )
}

export default CTMenuListItems