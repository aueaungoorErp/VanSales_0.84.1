import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import { MainTheme } from '../../constant/lov'

const IUpload = (props) => {
    const { photo, ontakePicturePress } =  props

    return (
        <View style={styles.container}>
            <View>
                {
                    photo ? 
                        <Avatar
                            size='xlarge'
                            rounded
                            source={{uri: photo}}
                            icon={{name: 'image', type: 'font-awesome'}}
                            onPress={() => console.log('Works!')}
                            activeOpacity={0.7} />
                        :
                        <Avatar
                            size='xlarge'
                            rounded
                            icon={{name: 'image', type: 'font-awesome'}}
                            onPress={() => console.log('Works!')}
                            activeOpacity={0.7} />

                }

                <View style={styles.takePhotoSection} >
                    <Icon
                        name='camera'
                        type='font-awesome'
                        color={MainTheme.colorPrimary}
                        containerStyle={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => {ontakePicturePress ? ontakePicturePress() : null}} />
                </View>
            </View>
        </View>
    )
}

export default IUpload

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    takePhotoSection: {
        justifyContent: 'center', alignItems: 'center',
        width: 45, 
        height: 45,
        position: 'absolute', 
        bottom: 0,
        alignSelf: 'flex-end',
        borderRadius: 45/2,
        backgroundColor: '#F2F3F4'
        
    }
})