import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'
import { ListItem, CheckBox } from 'react-native-elements'
import ListItems from '../presenter/ListItems'
import { getMasterDataSurveyForm } from '../../../../action/masterData'
import { MainTheme, mainDivider } from '../../../../constant/lov'
import { setVdiAns } from '../../../../action/order'

class CTListItems extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            successMessage: null,
            errorMessage: null,
            buttonDisabled: false
        }
    }

    componentDidMount = (props) => {
        this._getMasterDataSurveyForm()
    }
    
    _getMasterDataSurveyForm = async () => {
        try { 
            this._setIsLoading(true)
            this._setErrorMessage(null)
            this._setSuccessMessage(null)
            await this.props.getMasterDataSurveyForm()
            
        } catch (error) {
            this._setErrorMessage('ไม่สามารถโหลดข้อมูลแบบสำรวจได้เพราะ : ' + error)
        }
        this._setIsLoading(false)
    }

    _setIsLoading = (value) => {
        this.setState(oldState => {
            return {
                isLoading: value
            }
        })
    }

    _setSuccessMessage = (value) => {
        this.setState(oldState => {
            return {
                successMessage: value
            }
        })
    }

    _setErrorMessage = (value) => {
        this.setState(oldState => {
            return {
                errorMessage: value
            }
        })
    }

    _setButtonDisabled = (bool) => {
        this.setState(oldState => {
            return {
                buttonDisabled: bool
            }
        })
    }

    _onRefresh = () =>{
        
    }

    _header = () => {
        return (
            <ListItem
                title={
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 0.7, alignSelf: 'center'}}>
                        </View>

                        <View style={{flex: 0.15}}>
                            <Text>
                                { 
                                    this.props.masterData.SVF.item && this.props.masterData.SVF.item.SVF_ANS_YES 
                                    ? this.props.masterData.SVF.item.SVF_ANS_YES : null 
                                }
                            </Text>
                        </View>

                        <View style={{flex: 0.15}}>
                            <Text>
                                { 
                                    this.props.masterData.SVF.item && this.props.masterData.SVF.item.SVF_ANS_YES 
                                    ? this.props.masterData.SVF.item.SVF_ANS_NO : null 
                                }
                            </Text>
                        </View>
                    </View>
                }
                
                titleNumberOfLines={1}
                hideChevron
                bottomDivider />
            
        )
    }

    _renderItem = ({ item, index }) => {
        return (
            <ListItem
                title={
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 0.7, alignSelf: 'center'}}>
                            <Text> {item.SFQ_VALUE} </Text>
                        </View>
                        <View style={{flex: 0.15}}>
                            <CheckBox 
                                checked={this.props.order.survey.VDI_ANS[index] == 1 ? true : false}
                                checkedColor={MainTheme.colorPrimary}
                                containerStyle={styles.checkBoxStyle}
                                onPress={() => {this._setVdiAns(parseInt(item.VDI_ANS_MAP) - 1, 1)}} />
                        </View>
                        <View style={{flex: 0.15}}>
                            <CheckBox  
                                checked={this.props.order.survey.VDI_ANS[index] === 0 ? true : false}
                                checkedColor={MainTheme.colorPrimary}
                                containerStyle={styles.checkBoxStyle}
                                onPress={() => {this._setVdiAns(parseInt(item.VDI_ANS_MAP) - 1, 0)}} />
                        </View>
                    </View>
                }
                titleNumberOfLines={1}
                hideChevron
                containerStyle={mainDivider}
                bottomDivider />
        )
    }

    _setVdiAns = (index, value) => {
        this.props.setVdiAns(index, value)
    }

    render() {
        return (
            <ListItems 
                header={this._header}
                listItems={this.props.masterData.SVF.item.SVF_QUESTIONS}
                renderItem={this._renderItem}
                refreshing={this.state.isLoading}
                errorMessage={this.state.errorMessage}
                onRefresh={this._onRefresh} />
        )
    }
}

const mapStateToProps = (state) => ({
    masterData: state.masterData,
    order: state.order
})

const mapDispatchToProps = (dispatch) => {
    return {
        getMasterDataSurveyForm: () => dispatch(getMasterDataSurveyForm()),
        setVdiAns: (index, value) => dispatch(setVdiAns(index, value))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems)

const styles = StyleSheet.create({
    checkBoxStyle: { 
        backgroundColor: MainTheme.colorSecondary, 
        borderWidth: 0,  
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0
    }
})