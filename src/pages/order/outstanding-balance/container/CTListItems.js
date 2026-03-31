import React from 'react'
import { Text, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { clearListItems, searchList, setCheckNumber, setError, setListItems } from '../../../../action/outstanding-balance'
import { CheckBox, ListItem } from '../../../../component/elements'
import { MainTheme, mainDivider } from '../../../../constant/lov'
import { toBuddhistYear } from '../../../../utils/Date'
import ListItems from '../presenter/ListItems'

class CTListItems extends React.Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            errorMessage: null,
            dialogMessage: null
        }
    }

    componentDidMount = (props) => {
        this._isMounted = true
    }
    
    componentWillUnmount = (props) => {
        this._isMounted = false
    }

    _setState = (key, value) => {
        this._isMounted &&
        this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    _onRefresh = async () => {
        this.props.clearListItems()
        await this.props.searchList()
        await this.props.setCheckNumber(0)
    }
    
    _onScroll = async (event) => {
        const frameHeight = event.nativeEvent.layoutMeasurement.height
        const contentHeight = event.nativeEvent.contentSize.height
        const maxOffset = 0.95 * parseInt(contentHeight - frameHeight)
        const currentOffset = parseInt(event.nativeEvent.contentOffset.y)
        currentOffset >= maxOffset && !this.props.outstandingBalance.origin.isLoading ? await this.props.searchList(true) : null

    }

    _actionHandler = () => {
        this.props.setError(false)
    }

    _header = () => {
        return (
            <ListItem
                title={
                    <View style={{flexDirection: 'row'}} >
                        <CheckBox 
                            checked={this.props.outstandingBalance.origin.listItems.length === this.props.outstandingBalance.origin.checkNumber}
                            checkedColor={'#0020C2'}
                            uncheckedColor={'#0020C2'}
                            containerStyle={{
                                backgroundColor: MainTheme.colorPrimary, 
                                borderWidth: 0,  
                                marginRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0
                            }}
                            onPress={() => {this._checkboxAll()}} />
                        <Text style={{ width: 150, marginLeft: 5, alignSelf: 'center', fontSize: hp('1.7%') }} allowFontScaling={false} >เลขที่</Text>
                        <Text style={{ width: 100, marginLeft: 5, alignSelf: 'center', textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >ยอดรวม</Text>
                        <Text style={{ width: 100, marginLeft: 5, alignSelf: 'center', textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >ยอดค้างชำระ</Text>
                        <Text style={{ width: 100, marginLeft: 5, alignSelf: 'center', fontSize: hp('1.7%') }} allowFontScaling={false} >วันที่</Text>
                    </View>
                }
                containerStyle={{backgroundColor: MainTheme.colorPrimary}}
                titleNumberOfLines={1} /> 
        )
    }

    _actionHandler = () => {
        this.props.setError(false)
    }

    _checkboxAll = async () => {
        const { listItems } = this.props.outstandingBalance.origin
        let bool = true
        let checkNumber = this.props.outstandingBalance.origin.listItems.length

        if (this.props.outstandingBalance.origin.listItems.length === this.props.outstandingBalance.origin.checkNumber) {
            bool = false
            checkNumber = 0
        } 

        await this.props.setCheckNumber(checkNumber)

        const newListItems = listItems.map(item => ({
            ...item,
            isChecked: bool
        }))

        await this.props.setListItems(newListItems)
    }

    _checkbox = async (item, index) => {
        const { listItems } = this.props.outstandingBalance.origin

        item = {
            ...item,
            isChecked: !item.isChecked
        }

        const checkNumber = this.props.outstandingBalance.origin.checkNumber + (item.isChecked ? 1 : -1 )
        await this.props.setCheckNumber(checkNumber)

        listItems[index] = item
        await this.props.setListItems(listItems)
    }

    _renderItem = ({ item, index }) => {
        
        return (
            <ListItem
                title={
                    <View style={{flexDirection: 'row'}} >
                        <CheckBox 
                            checked={item.isChecked}
                            checkedColor={MainTheme.colorPrimary}
                            containerStyle={{
                                backgroundColor: MainTheme.colorSecondary, 
                                borderWidth: 0,  
                                marginRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0
                            }}
                            onPress={() => {this._checkbox(item, index)}} />
                        <Text style={{ width: 150, marginLeft: 5, alignSelf: 'center', fontSize: hp('1.7%') }} allowFontScaling={false} >{item.DI_REF}</Text>
                        <Text style={{ width: 100, marginLeft: 5, alignSelf: 'center', textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >{item.ARD_A_AMT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                        <Text style={{ width: 100, marginLeft: 5, alignSelf: 'center', textAlign: 'right', fontSize: hp('1.7%') }} allowFontScaling={false} >{item.OUTSTANDING.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                        <Text style={{ width: 100, marginLeft: 5, alignSelf: 'center', fontSize: hp('1.7%') }} allowFontScaling={false} >{toBuddhistYear(item.DI_DATE)}</Text>
                    </View>
                }
                containerStyle={[{ backgroundColor: MainTheme.colorSecondary }, mainDivider]}
                bottomDivider
                titleNumberOfLines={1} /> 
        )
    }

    render() {
        return (
            <ListItems 
                header={this._header}
                listItems={this.props.outstandingBalance.origin.listItems}
                renderItem={this._renderItem}
                errorMessage={this.state.errorMessage}
                onScroll={this._onScroll}
                refreshing={this.props.outstandingBalance.origin.isLoading}
                onRefresh={this._onRefresh}
                dialogMessage={this.state.dialogMessage}
                setState={this._setState}
                isError={this.props.outstandingBalance.origin.isError && this.props.outstandingBalance.origin.listItems.length == 0}
                isNotFound={this.props.outstandingBalance.origin.isNotFound && this.props.outstandingBalance.origin.listItems.length == 0}
                isSnackBarVisible={this.props.outstandingBalance.origin.isError && this.props.outstandingBalance.origin.listItems.length > 0}
                actionHandler={this._actionHandler} />
        )
    }
}

const mapStateToProps = (state) => ({
    outstandingBalance: state.outstandingBalance
})

const mapDispatchToProps = (dispatch) => {
    return {
        setInitialState: (data) => dispatch(setInitialState(data)),
        searchList: (nextPage) => dispatch(searchList(nextPage)),
        clearListItems: () => {
            dispatch(clearListItems())
        },
        setError: (bool) => {
            dispatch(setError(bool))
        },
        setListItems: (listItems) => dispatch(setListItems(listItems)),
        setCheckNumber: (number) => dispatch(setCheckNumber(number))
     }
}

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems)