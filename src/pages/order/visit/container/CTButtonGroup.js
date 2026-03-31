import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Alert, TouchableOpacity, Text } from 'react-native'
import ButtonGroup from '../presenter/ButtonGroup'
import { visitFormButtonGroup } from '../../../../constant/lov'
import Navigator from '../../../../services/Navigator'
import { genenrateDocVisitToServer } from '../../../../utils/Order'
import { addVisitImageItem, removeAllVisitImageItems, createDocVisit } from '../../../../action/order'
import { searchMasterDataVanVisRList } from '../../../../action/masterData'

class CTButtonGroup extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            vanVitRItem: null,
            isLoading: false,
            successMessage: null,
            errorMessage: null,
            buttonDisabled: false
        }
    }

    componentDidMount(props) {
        this._isMounted = true
        this._searchMasterDataVanVisRList()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    _searchMasterDataVanVisRList = async () => {
        try { 
            this._setIsLoading(true)
            this._setErrorMessage(null)
            this._setSuccessMessage(null)
            await this.props.searchMasterDataVanVisRList()
            
        } catch (error) {
            this._setErrorMessage('ไม่สามารถโหลดข้อมูลธนาคารได้เพราะ : ' + error)
        }

        this._setIsLoading(false)
    }

    _alertDialog = (item) => Alert.alert(
        'ประกาศ',
        'บันทึกรายการเรียบร้อย',
        [
            {
                text: 'ตกลง', onPress: () => Navigator.navigate('OrderChoice')
            }
        ],
        { cancelable: false }
    )

    _renderItem = (item, key) => (
        <TouchableOpacity key={key} style={[item.buttonStyle, item.containerStyle, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}]} onPress={() => {this._onPress(item)}} disabled={this.state.buttonDisabled} activeOpacity={0.7}>
              <Text style={item.titleStyle}>{item.title}</Text>
            </TouchableOpacity>
    )

    _onPress = async (item) => {
        if (item.methodType === 'function') {
            if ( item.methodName === 'confirm') {
                this._createDocVisit()
            } else if (item.methodName === 'cancel') {
                await this.props.removeAllVisitImageItems()
                Navigator.navigate('OrderChoice')
            }
        } else if (item.methodType === 'newPage') {
            if (item.screen === 'Camera') {
                Navigator.navigate(item.screen, {
                    takePicture: async (data) => {
                        await this.props.addVisitImageItem(data.uri)
                    }
                })
            }
        } else if (item.methodType === 'newPage') {
        
        }
    }

    _createDocVisit = async () => {
        try {
            if (this.props.order.visit.item.VDI_VISIT !== null) {
                this._setIsLoading(true)
                this._setErrorMessage(null)
                this._setSuccessMessage(null)
                this._setButtonDisabled(true)
                await this.props.createDocVisit(
                    genenrateDocVisitToServer(
                        this.props.customer.item.INFO.AR_KEY, 
                        this.props.order.visit.item.VDI_VISIT,
                        this.props.mile.item.mileage, 
                        this.props.geolocation.position
                    )
                )
                
                this._alertDialog()
            } else {
                this._setButtonDisabled(false)
                this._setErrorMessage('กรุณาเลือกเหตุผลการเยี่ยม')
            }
        } catch (error) {
            this._setErrorMessage(error)
        }
        this._setButtonDisabled(false)
        this._setIsLoading(false)
    }
    
    _setIsLoading = (value) => {
        this._isMounted = false
        this.setState(oldState => {
            return {
                isLoading: value
            }
        })
    }

    _setSuccessMessage = (value) => {
        this._isMounted = false
        this.setState(oldState => {
            return {
                successMessage: value
            }
        })
    }

    _setErrorMessage = (value) => {
        this._isMounted = false
        this.setState(oldState => {
            return {
                errorMessage: value
            }
        })
    }

    _setButtonDisabled = (bool) => {
        this._isMounted = false
        this.setState(oldState => {
            return {
                buttonDisabled: bool
            }
        })
    }

    render() {
        return (
            <ButtonGroup 
                listItems={visitFormButtonGroup}
                renderItem={this._renderItem}
                message={this.props.order.errorMessage} 
                successMessage={this.state.successMessage} 
                errorMessage={this.state.errorMessage} 
                isLoading={this.state.isLoading} />
        )
    }
}

const mapStateToProps = (state) => ({
    order: state.order,
    customer: state.customer,
    mile: state.mile,
    geolocation: state.geolocation
})

const mapDispatchToProps = (dispatch) => {
    return {
        searchMasterDataVanVisRList: () => dispatch(searchMasterDataVanVisRList()),
        addVisitImageItem: (uri) => dispatch(addVisitImageItem(uri)),
        removeAllVisitImageItems: () => dispatch(removeAllVisitImageItems()),
        createDocVisit: (data) => dispatch(createDocVisit(data))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTButtonGroup)