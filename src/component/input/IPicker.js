import { Component } from 'react'
import { TextInput, View } from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainTheme } from '../../constant/lov'

const Item = ({ style, children }) => (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
)

const Input = ({ style, ...props }) => (
    <TextInput
        {...props}
        style={[{ flex: 1, color: '#000000', paddingVertical: 8, paddingHorizontal: 0 }, style]}
    />
)

class IPicker extends Component {
    _isMounted = false
    _isSetNull = false
    constructor(props) {
        super(props)

        this.state = {
            items: [],
            selectedValue: null,
            selectedKey: null
        }

    }

    componentDidMount = () => {
        this._isMounted = true
        this._prepare()
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    componentWillReceiveProps = async () => {
        await this._setState('items', this.props.items)
        const index = this.state.items.findIndex(item => item.key === this.props.selectedKey)
        if ( index >= 0 ) {
            await this._setState('selectedValue', this.state.items[index].label)
            await this._setState('selectedKey', this.props.selectedKey)
        } else {
            
            if (!this._isSetNull) { 
                await this._setState('selectedValue', this.props.placeHolder)
                await this._setState('selectedKey', null)
                this.props.onValueChange(null)
                this._isSetNull = true
            }
        }
    }


    _setState = (key, value) => {
        this._isMounted && 
        this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    _prepare = async () => {
        if (this.props.items && this.props.items.length > 0) {
            await this._setState('items', this.props.items)
        } else {
            await this._setState('items', [])
        }
    }

    _onValueChange = async (option) => {
        if ((this.props.onValueChange) && (option.label !== this.state.selectedValue)) { 
            await this._setState('selectedValue', option.label)
            await this._setState('selectedKey', option.key)
            this.props.onValueChange(option.key) 
            this._isSetNull = false
        }
    }

    render() {
        return(
            <View>
                <ModalSelector
                    data={this.state.items}
                    disabled={this.props.disable}
                    accessible={true}
                    cancelButtonAccessibilityLabel={'ยกเลิก'}
                    onChange={(option) => { this._onValueChange(option) }}
                    keyExtractor= {item => item.key}
                    labelExtractor= {item => item.label}
                    optionTextStyle={{ color: '#C0C0C0', fontSize: hp('1.7%') }}
                    selectedItemTextStyle={{ color: '#000000', fontSize: hp('1.7%') }} 
                    optionContainerStyle={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
                    selectedKey={this.state.selectedKey} >

                    <Item style={{ borderBottomColor: '#d6d7da', borderBottomWidth: this.props.hideBorder ? 0.0 : 0.5 }}>
                        <Input 
                            editable={false}
                            placeholderTextColor={MainTheme.placeholerTextInput}
                            value={!this.props.disable ? this.state.selectedValue : this.props.placeHolder}
                            style={{ fontSize: hp('1.7%'), flex: 0.9, color: this.props.disable === true ? MainTheme.placeholerTextInput : '#000' }}/>
                        
                        <View style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <AntDesign
                                name='down'
                                size={20}
                                color={MainTheme.colorTertiary} />
                        </View>
                    </Item>
                </ModalSelector>
            </View>
        )
    }
}

export default IPicker 