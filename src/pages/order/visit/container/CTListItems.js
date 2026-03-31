import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import { removeVisitImageItem } from '../../../../action/order'
import { MainTheme, mainDivider } from '../../../../constant/lov'
import ListItems from '../presenter/ListItems'

const CTListItems = (props) => {
    
    _renderItem = ({ item, index }) => {
        return (
            <View style={[ styles.itemContainer, mainDivider]}>
                <Image style={styles.imageStyle} source={{uri: item }} />
                <View style={styles.removeImageSection}>
                    <AntDesign
                        name='close'
                        color={MainTheme.colorSecondary}
                        size={30}
                        style={{marginTop: -3}}
                        onPress={() => _onPress(index)} />
                </View>
            </View>
        )
    }
    
    const _onPress = async (index) => {
        await props.removeVisitImageItem(index)
    }
    
    return (
        <ListItems listItems={props.order.visit.imageItems} renderItem={_renderItem} numColumns={3} />
    )
}

const mapStateToProps = (state) => ({
    order: state.order
})

const mapDispatchToProps = (dispatch) => {
    return {
		removeVisitImageItem: (index) => dispatch(removeVisitImageItem(index))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems)

const styles = StyleSheet.create({
    itemContainer: {
        borderRadius: 5,
        height: 150,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    imageContainer: {

    },
    imageStyle: {
        height: 200
    },
    removeImageSection: {
        width: 25, 
        height: 25, 
        justifyContent: 'center', 
        position: 'absolute', 
        alignSelf: 'flex-end', 
        backgroundColor: MainTheme.colorDanger
    }
})