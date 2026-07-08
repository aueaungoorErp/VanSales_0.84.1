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
import IDateTimePicker from './IDateTimePicker'

class IDurationDateSearchForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            dateFrom: moment().format(this.props.useDateTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY'),
            dateTo: moment().format(this.props.useDateTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY')
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
                    size={16}
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
        const reportTitle = this.props.title || 'รายงานสรุปการขายประเภทสินค้า'
        const inlineActionsWithFields = this.props.inlineActionsWithFields === true
        const titleFullWidth = this.props.titleFullWidth === true
        const useDateTime = this.props.useDateTime === true
        const DateFieldComponent = useDateTime ? IDateTimePicker : IDatePicker
        const dateFieldProps = useDateTime
            ? {
                onDateTimeChange: this._onDateFromChange,
            }
            : {
                onDateChange: this._onDateFromChange,
            }
        const dateToFieldProps = useDateTime
            ? {
                onDateTimeChange: this._onDateToChange,
            }
            : {
                onDateChange: this._onDateToChange,
            }

        const actionButtons = (
            <View style={[
                styles.actionRow,
                inlineActionsWithFields ? styles.actionRowInline : null,
            ]}>
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
        )

        return (
            <View style={styles.container}>
                <View style={styles.formCard}>
                    <View style={styles.cardHeaderRow}>
                        <View style={[
                            styles.titleWrap,
                            titleFullWidth ? styles.titleWrapFullWidth : null,
                        ]}>
                            <Text
                                allowFontScaling={false}
                                style={styles.sectionTitle}>
                                {reportTitle}
                            </Text>
                        </View>

                        {!inlineActionsWithFields ? actionButtons : null}
                    </View>

                    <View style={[
                        styles.sectionInline,
                        inlineActionsWithFields ? styles.sectionInlineWithActions : null,
                    ]}>
                        <View style={styles.fieldCard}>
                            <DateFieldComponent
                                label='จาก'
                                value={this.state.dateFrom}
                                hideBorder
                                {...dateFieldProps} />
                        </View>

                        {
                            !this.props.hideRight || this.props.showDropdown ? (
                                <View style={[styles.fieldCard, this.props.hideRight ? styles.fieldCardSingle : null]}>
                                    {
                                        !this.props.hideRight ?
                                            <DateFieldComponent
                                                label='ถึง'
                                                value={this.state.dateTo}
                                                hideBorder
                                                {...dateToFieldProps} />
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
                            ) : null
                        }

                        {inlineActionsWithFields ? actionButtons : null}
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
        paddingHorizontal: 0,
        paddingTop: 4,
        paddingBottom: 8,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#E1EAE4',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: hp('1.75%'),
        color: '#355244',
        fontWeight: '700',
        marginBottom: 0,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        width: '100%',
    },
    titleWrap: {
        flex: 1,
        paddingRight: 12,
        justifyContent: 'center',
    },
    titleWrapFullWidth: {
        paddingRight: 0,
    },
    sectionInline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginHorizontal: -2,
    },
    sectionInlineWithActions: {
        alignItems: 'center',
    },
    fieldCard: {
        flex: 1,
        minHeight: 42,
        backgroundColor: '#F7FAF8',
        borderWidth: 1,
        borderColor: '#DEE9E3',
        borderRadius: 14,
        paddingHorizontal: 8,
        paddingVertical: 2,
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
        marginLeft: 'auto',
        paddingTop: 2,
    },
    actionRowInline: {
        marginLeft: 6,
        paddingTop: 0,
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
        width: 38,
        minHeight: 38,
        borderRadius: 19,
        paddingHorizontal: 0,
    },
    actionButtonPrimary: {
        backgroundColor: MainTheme.colorPrimary,
        marginRight: 6,
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
