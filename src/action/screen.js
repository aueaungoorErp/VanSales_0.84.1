import * as types from '../constant/screen'
import Screen from '../services/Screen'
import { Dimensions } from 'react-native'

export const stateChange = () => {
    return (dispatch) => {
        dispatch({ 
            type: types.SCREEN_STATE_CHANGE,
            payload: {
                dimensions: Dimensions.get('window'),
                isPortrait: Screen.isPortrait(),
                isLandscape: Screen.isLandscape(),
                isPhone: Screen.isPhone(),
                isTablet: Screen.isTablet()
            }
        })
    }
}