import moment from 'moment'
import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
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

   

    _renderActionButton = ({ icon, label, onPress, variant = 'primary', compact = false, iconType = 'ant-design' }) => {
        const isPrimary = variant === 'primary'
        const IconComponent = iconType === 'font-awesome-5' ? FontAwesome5 : AntDesign

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                style={[
                    styles.actionButton,
                    compact ? styles.actionButtonCompact : null,
                    isPrimary ? styles.actionButtonPrimary : styles.actionButtonSecondary,
                ]}
                onPress={onPress}>
                <IconComponent
                    name={icon}
                    size={18}
                    color={isPrimary ? MainTheme.colorSecondary : MainTheme.colorPrimary}
                    style={[styles.actionIcon, compact ? styles.actionIconCompact : null]}
                />
                {!compact ? (
                    <Text
                        style={[
                            styles.actionLabel,
                            isPrimary ? styles.actionLabelPrimary : styles.actionLabelSecondary,
                        ]}
                        allowFontScaling={false}>
                        {label}
                    </Text>
                ) : null}
            </TouchableOpacity>
        )
    }
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.formCard}>
                    <View style={styles.cardHeaderRow}>
                        <View style={[,{flexDirection: 'column'}]} > 
                            <Text allowFontScaling={false} style={styles.sectionTitle}>รายงานสรุปการขาย</Text> 
                            <Text allowFontScaling={false} style={styles.sectionTitle}>ตามประเภทสินค้า</Text> 
                            </View>
                       
                        <View style={styles.actionRow}>
                            {this._renderActionButton({
                                icon: 'search1',
                                label: 'ค้นหารายงาน',
                                onPress: () => this.props.onSearch ? this.props.onSearch(this.state.dateFrom, this.state.dateTo) : null,
                                compact: true,
                            })}

                            {
                                this.props.printEnabled ?
                                    this.props.printerType === 'BLUETOOTH' ?
                                        this._renderActionButton({
                                            icon: 'printer',
                                            label: 'พิมพ์ผ่านเครื่องพิมพ์',
                                            onPress: () => this.props.printerReport ? this.props.printerReport() : null,
                                            variant: 'secondary',
                                            compact: true,
                                        })
                                    :
                                        this._renderActionButton({
                                            icon: 'file-pdf',
                                            label: 'ส่งออก PDF',
                                            onPress: () => this.props.printPDF ? this.props.printPDF() : null,
                                            variant: 'secondary',
                                            compact: true,
                                            iconType: 'font-awesome-5',
                                        })
                                : null
                            }
                        </View>
                    </View>

                    <View style={styles.sectionInline}>
                        <View style={styles.fieldCard}>
                            <IDatePicker
                                label='จาก'
                                value={this.state.dateFrom}
                                hideBorder
                                onDateChange={this._onDateFromChange} />
                        </View>

                        <View style={[styles.fieldCard, this.props.hideRight ? styles.fieldCardSingle : null]}>
                            {
                                !this.props.hideRight ?
                                    <IDatePicker
                                        label='ถึง'
                                        value={this.state.dateTo}
                                        hideBorder
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
                                                top: 14,
                                                right: 10,
                                            },
                                            inputAndroid: {
                                                color: '#000000',
                                                paddingTop: 15,
                                                paddingBottom: 12,
                                                paddingHorizontal: 4,
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
                                                size={20}
                                                color={MainTheme.colorPrimary} />
                                        }} />
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
        paddingHorizontal: 14,
        paddingTop: 4,
        paddingBottom: 8,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#E1EAE4',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 8,
    },
    sectionTitle: {
        flex: 1,
        fontSize: hp('1.75%'),
        color: '#355244',
        fontWeight: '700',
        marginBottom: 0,
        paddingRight: 10,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    sectionInline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginHorizontal: -2,
    },
    fieldCard: {
        flex: 1,
        minHeight: 58,
        backgroundColor: '#F7FAF8',
        borderWidth: 1,
        borderColor: '#DEE9E3',
        borderRadius: 14,
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    fieldCardSingle: {
        opacity: 0,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexShrink: 0,
        paddingTop: 2,
    },
    actionButton: {
        flex: 1,
        minHeight: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
    },
    actionButtonCompact: {
        flex: 0,
        width: 46,
        minHeight: 46,
        borderRadius: 23,
        paddingHorizontal: 0,
    },
    actionButtonPrimary: {
        backgroundColor: MainTheme.colorPrimary,
        marginRight: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },
    actionButtonSecondary: {
        backgroundColor: '#F3FAF6',
        borderWidth: 1,
        borderColor: '#D8E4DE',
        marginLeft: 0,
    },
    actionIcon: {
        marginRight: 8,
    },
    actionIconCompact: {
        marginRight: 0,
    },
    actionLabel: {
        fontSize: hp('1.65%'),
        fontWeight: '700',
    },
    actionLabelPrimary: {
        color: MainTheme.colorSecondary,
    },
    actionLabelSecondary: {
        color: MainTheme.colorPrimary,
    },
    disabled: {
        backgroundColor: '#FFF'
    }
})
