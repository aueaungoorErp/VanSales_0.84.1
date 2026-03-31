import React from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import { removeStockImageItem } from '../../../../action/order'
import { MainTheme, mainDivider } from '../../../../constant/lov'
import GridImage from '../presenter/GridImage'

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
                    <AntDesign
                        name='close'
                        color={MainTheme.colorSecondary}
                        size={30}
                        style={{marginTop: -3}}
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
