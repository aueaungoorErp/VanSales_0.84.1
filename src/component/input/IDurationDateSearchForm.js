import moment from 'moment'
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainTheme } from '../../constant/lov'
import IDatePicker from './IDatePicker'

class IDurationDateSearchForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            dateFrom: moment().format('DD/MM/YYYY'),
            dateTo: moment().format('DD/MM/YYYY')
        }

        this._onDateFromChange = this._onDateFromChange.bind(this)
        this._onDateToChange = this._onDateToChange.bind(this)

    }

    _onDateFromChange = (value) => {
        this.setState(oldState => {
            return {
                dateFrom: value
            }
        })
    }

    _onDateToChange = (value) => {
        this.setState(oldState => {
            return {
                dateTo: value
            }
        })
    }
    
    render() {
        console.log("จาก :" , this.state.dateFrom);
        console.log("ถึง :" , this.state.dateTo);
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: hp('2%'), marginBottom: 5 , marginLeft: 5 }} allowFontScaling={false} >{this.props.title}</Text>
                
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.sectionInline}>
                        <View style={{flex: 0.5, marginHorizontal: 5}}>
                            <IDatePicker
                                label='จาก'
                                value={this.state.dateFrom}
                                onDateChange={this._onDateFromChange} />
                        </View>

                        
                        <View style={{ 
                            flex: 0.5, 
                            marginHorizontal: 5, 
                            borderBottomColor: '#d6d7da', 
                            borderBottomWidth: this.props.showDropdown ? 0.5 : 0.0,
                            height: 50,
                        }} >
                            {
                                !this.props.hideRight ?
                                    <IDatePicker
                                        label='ถึง'
                                        value={this.state.dateTo}
                                        onDateChange={this._onDateToChange} />
                                : null
                            }
                            {
                                this.props.showDropdown ?
                                    <RNPickerSelect
                                        items={this.props.selectItems}
                                        onValueChange={(value) => { this.props.setState ? this.props.setState('selected', value) : null }}
                                        style={{
                                            iconContainer: {
                                                top: 10,
                                                right: 5,
                                            }, 
                                            inputAndroid: {
                                                color: '#000000',
                                                paddingTop: 15,
                                                fontSize: hp('1.7%')
                                            }
                                        }}
                                        value={this.props.selected}
                                        placeholder={{
                                            label: 'เลือก',
                                            value: null         
                                        }}
                                        textInputProps={{ underlineColorAndroid: 'cyan' }}
                                        useNativeAndroidPickerStyle={false}
                                        
                                        Icon={() => {
                                            return <AntDesign
                                                        name='down'
                                                        size={25}
                                                        color={MainTheme.colorPrimary} />
                                        }} />
                                : null
                            }
                        </View>
                        <View style={[styles.sectionInline, {flex: 0.2}]}>
                            <Icon
                                name='ios-search' 
                                color={MainTheme.colorPrimary}
                                size={30} 
                                type={'ionicon'}
                                onPress={() => this.props.onSearch ? this.props.onSearch(this.state.dateFrom, this.state.dateTo) : null} />

                            {
                                this.props.printEnabled ?
                                    this.props.printerType === 'BLUETOOTH' ?
                                        <Icon
                                            name='printer' 
                                            color={MainTheme.colorPrimary}
                                            size={30} 
                                            type={'simple-line-icon'}
                                            onPress={() => this.props.printerReport ? this.props.printerReport() : null} />
                                        :
                                        <Icon
                                            style={
                                                {
                                                    width: 30, 
                                                    height: 30, 
                                                    alignSelf: 'center'
                                                }
                                            }
                                            color={MainTheme.colorPrimary}
                                            name='file-pdf'
                                            type='material-community'
                                            onPress={() => this.props.printPDF ? this.props.printPDF() : null} />
                                    : null
                            }

                        </View>
                    </View>

                </View>

                <ProgressDialog
                    visible={this.props.isLoading}
                    message={this.props.loadingMessage}
                    animationType={'fade'}
                    dialogStyle={{ borderRadius: 5 }} />

                <ConfirmDialog
                    title='เกิดข้อผิดพลาด'
                    visible={this.props.errorMessage !== null}
                    positiveButton={{
                        title: 'ตกลง',
                        titleStyle: { color: '#000000' },
                        onPress: () => this.props.setStateFromParent('errorMessage', null)
                    }}
                    animationType={'fade'}
                    dialogStyle={{ borderRadius: 5 }} >
                    <View>
                        <Text>{this.props.errorMessage}</Text>
                    </View>
                </ConfirmDialog>
            </View>
        )
    }
}

export default IDurationDateSearchForm

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginTop: 5,
        marginBottom: 20,
    },
    sectionInline: {
        flex: 1,
        height: 30, 
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    dateIcon: {
        position: 'absolute',
        right: 0,
        top: 4,
        marginLeft: 0,
        height: 22
    },
    dateInput: {
        height: 35,
        borderWidth: 0,
        borderColor: '#d6d7da',
        borderBottomWidth: 1,
        // paddingTop: 2,
        // paddingBottom: 2,
        // justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    disabled: {
        backgroundColor: '#FFF'
    }
})
