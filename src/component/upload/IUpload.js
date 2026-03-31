import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainTheme } from '../../constant/lov'

const IUpload = (props) => {
    const { photo, ontakePicturePress } =  props

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.avatarContainer}>
                    {photo ? (
                        <Image
                            source={{uri: photo}}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <AntDesign name='picture' size={50} color='#bbb' />
                    )}
                </View>

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
    avatarContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#F2F3F4',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
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