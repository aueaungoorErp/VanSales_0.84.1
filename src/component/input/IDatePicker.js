import moment from 'moment'
import 'moment/locale/th'
import React, { Component } from 'react'
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Calendar } from 'react-native-toggle-calendar'
import IOverlay from '../../component/modal/IOverlay'
import { MainTheme } from '../../constant/lov'
import { toBuddhistYear } from '../../utils/Date'
import { resolveVectorIconComponent } from '../../utils/iconFactory'

const Item = ({ style, children }) => (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
)

const Input = ({ style, ...props }) => (
    <TextInput
        {...props}
        style={[{ flex: 1, color: '#000000', paddingVertical: 8, paddingHorizontal: 0 }, style]}
    />
)

const Icon = ({ type, name, style, size, fontSize, color, onPress }) => {
    const IconComponent = resolveVectorIconComponent(type, resolveVectorIconComponent('AntDesign'))
    return (
        <IconComponent
            name={name}
            size={size ?? fontSize ?? style?.fontSize ?? 20}
            color={color ?? style?.color ?? MainTheme.colorPrimary}
            style={style}
            onPress={onPress}
        />
    )
}

moment.locale('th')

class IDatePicker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            current: moment().format('YYYY-MM-DD'),
            date: moment().format('YYYY-MM-DD')
        }
    }

    componentDidMount = (props) => {
        this._setBeginState()
        
    }

    _setBeginState = async () => {
        const { value } = this.props
        if (value) { await this._setState('date', moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')) }
    }

    _setState = async (key, value) => {
        await this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    _generateOverlayStyle = () => {
        if (Dimensions.get('window').width > 460) return { width: '100%' }
        else return { width: '100%', borderWidth: 1, paddingLeft: 0, paddingRight: 0 }
    }

    _calendarHeaderComponent = (props) => {
        const { addMonth } = props
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                <Icon type='AntDesign' name='left' style={{ fontSize: 25, color: MainTheme.colorPrimary }} onPress={() => addMonth(-1)} />
                <Text style={{ fontSize: 20 }}>{ moment(this.state.current, 'YYYY-MM-DD').add(543, 'years').format(' MMMM YYYY') }</Text>
                <Icon type='AntDesign' name='right' style={{ fontSize: 25, color: MainTheme.colorPrimary }} onPress={() => addMonth(1)} />
            </View>
        )
    }

    _onDayPress = async (value) => {
        this.props.onDateChange && this.props.onDateChange(moment(value.dateString, 'YYYY-MM-DD').format('DD/MM/YYYY'))
        await this._setState('date', value.dateString)
        await this._setState('visible', false)
    }

    render () {
        const { label, value, disabled, hideBorder } = this.props
        return (
            <View>
                <Item style={{ borderBottomColor: '#d6d7da', borderBottomWidth: hideBorder ? 0 : 0.5 }}>
                    {
                        label ? 
                            <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} > {label} </Text>
                        : null
                    }
                    
                    <Input editable={false} value={toBuddhistYear(value)} style={{ fontSize: hp('1.7%') }} allowFontScaling={false} />
                    <Icon active name='calendar' type='FontAwesome' style={{ color: MainTheme.colorTertiary }} onPress={() => disabled === undefined || disabled === false ? this._setState('visible', true) : null} />
                </Item>

                <IOverlay 
                    closeOnTouchOutside={true}
                    visible={this.state.visible}
                    containerStyle={this._generateOverlayStyle()}
                    onClose={() => {
                        this._setState('visible', false)
                    }}
                    childrenWrapperStyle={{ backgroundColor: 'transparent' }} >
                        <View style={{ width: '100%'  }}>
                            <Calendar 
                                current={this.state.current}
                                calendarHeaderComponent={this._calendarHeaderComponent}
                                onMonthChange={(value) =>  { 
                                    this._setState('current', value.dateString)
                                }}
                                onDayPress={(value) =>  this._onDayPress(value) }
                                markedDates={{
                                    [this.state.date] : { selected: true, selectedColor: MainTheme.colorPrimary }
                                }}
                                />
                        </View>
                </IOverlay>
            </View>
        )
    }
}

export default IDatePicker

const styles = StyleSheet.create({
    container: {
        height: 30, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    label: {
        flex: 0.2, 
        color: MainTheme.colorPrimary
    },
    datePicker: {
        flex: 0.8
    }
})

