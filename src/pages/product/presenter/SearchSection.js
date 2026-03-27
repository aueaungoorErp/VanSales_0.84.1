import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import IModal from '../../../component/modal/IModal'
import { MainTheme } from '../../../constant/lov'

const SearchSection = (props) => {
    const { children, setModel, visible } = props

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', padding: 5}}>
                <TouchableOpacity onPress={() => setModel ? setModel(true) : null}>
                    <Image
                        style={{width: 50, height: 50, alignSelf: 'center'}}
                        resizeMode='contain'
                        source={require('../../../images/Zoom.png')} />
                </TouchableOpacity>
            </View>

            <IModal
                childrenWrapperStyle={{padding: 5, backgroundColor: MainTheme.colorSecondary}}
                visible={visible}
                onClose={() => setModel ? setModel(false) : null} >

                {children}

            </IModal>
            
        </View>
    )
}

export default SearchSection

const styles = StyleSheet.create({
    container: {

    }
})