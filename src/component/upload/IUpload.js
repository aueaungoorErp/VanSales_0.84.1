import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import AntDesign from 'react-native-vector-icons/AntDesign'
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
                            icon={{name: 'picture', type: 'antdesign'}}
                            onPress={() => console.log('Works!')}
                            activeOpacity={0.7} />
                        :
                        <Avatar
                            size='xlarge'
                            rounded
                            icon={{name: 'picture', type: 'antdesign'}}
                            onPress={() => console.log('Works!')}
                            activeOpacity={0.7} />

                }

                <View style={styles.takePhotoSection} >
                    <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                        <AntDesign
                            name='camera'
                            color={MainTheme.colorPrimary}
                            size={24}
                            onPress={() => {ontakePicturePress ? ontakePicturePress() : null}} />
                    </View>
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