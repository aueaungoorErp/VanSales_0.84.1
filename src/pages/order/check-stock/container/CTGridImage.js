import React from 'react'
import { connect } from 'react-redux'
import { View, Image, TouchableOpacity, Alert, Dimensions, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import GridImage from '../presenter/GridImage'
import { MainTheme, mainDivider } from '../../../../constant/lov'
import { removeStockImageItem } from '../../../../action/order'

class CTGridImage extends React.Component {

    constructor(props) {
        super(props)
    }

    _onPress = async (index) => {
        await this.props.removeStockImageItem(index)
    }

    _renderItem = ({ item, index }) => {

        return (
            <View style={[ styles.itemContainer, mainDivider]}>
                <Image style={styles.imageStyle} resizeMode="cover" source={{uri: item }} />
                <View style={styles.removeImageSection}>
                    <Icon
                        name='close'
                        type='font-awesome'
                        color={MainTheme.colorSecondary}
                        size={30}
                        iconStyle={{marginTop: -3}}
                        onPress={() => this._onPress(index)} />
                </View>
            </View>
        )
    }

    render() {
        const itemDimension = Dimensions.get('window').width > 450 ? 170 : 130

        return(
            <GridImage 
                itemDimension={itemDimension}
                listItems={this.props.order.stock.imageItems}
                renderItem={this._renderItem} />
        )
    }
}

const mapStateToProps = (state) => ({
    order: state.order
})

const mapDispatchToProps = (dispatch) => {
    return {
		removeStockImageItem: (index) => dispatch(removeStockImageItem(index))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTGridImage)

const styles = StyleSheet.create({
    itemContainer: {
        borderRadius: 5,
        height: 200,
        marginBottom: 10
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
