import React from 'react'
import { Animated, View, StyleSheet, Keyboard } from 'react-native'
import { MainTheme } from '../../../constant/lov'
import CTForm from '../container/CTForm'
import CTHeader from '../../user/container/CTHeader'
import CTButtonGroup from '../container/CTButtonGroup'

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formSessionKey: 0,
        }

        this._headerHeight = new Animated.Value(0.3)
        this._bodyHeight = new Animated.Value(0.7)
    }

    componentDidMount = () => {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)

        const navigation = this.props.navigation
        if (navigation && typeof navigation.addListener === 'function') {
            this._focusUnsubscribe = navigation.addListener('focus', this._onScreenFocus)
        }
    }

    componentWillUnmount = () => {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()

        if (typeof this._focusUnsubscribe === 'function') {
            this._focusUnsubscribe()
        }
    }

    _onScreenFocus = () => {
        this.setState(oldState => ({
            formSessionKey: oldState.formSessionKey + 1,
        }))
    }
    
    _keyboardDidShow = (event) => { 
        Animated.parallel([
            Animated.timing(this._headerHeight, {
                duration: event.duration,
                toValue: 0
            }),
            Animated.timing(this._bodyHeight, {
                duration: event.duration,
                toValue: 1
            })
        ]).start()
    }
    
    _keyboardDidHide = () => {
        Animated.parallel([
            Animated.timing(this._headerHeight, {
                duration: 500,
                toValue: 0.3
            }),
            Animated.timing(this._bodyHeight, {
                duration: 500,
                toValue: 0.7
            })
        ]).start()
    }
      
    render() {
        return (
            <View style={styles.container}>
                <Animated.View style={[ styles.header, { flex: this._headerHeight } ]}>
                    <CTHeader />
                </Animated.View>
                <Animated.View style={{ flex: this._bodyHeight }}>
                    <CTForm key={this.state.formSessionKey} />
                </Animated.View>
                <CTButtonGroup key={this.state.formSessionKey} />
            </View>
        )
    }
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: MainTheme.colorSecondary
    },
    header: {
        flexDirection: 'column',
        backgroundColor: MainTheme.colorQuinary,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
