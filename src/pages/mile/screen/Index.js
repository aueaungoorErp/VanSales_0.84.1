import React from 'react'
import { Animated, View, StyleSheet, Keyboard } from 'react-native'
import { MainTheme } from '../../../constant/lov'
import CTForm from '../container/CTForm'
import CTHeader from '../../user/container/CTHeader'
import CTButtonGroup from '../container/CTButtonGroup'

class Index extends React.Component {
    constructor(props) {
        super(props);
    
        this._headerHeight = new Animated.Value(0.3)
        this._bodyHeight = new Animated.Value(0.7)
    }

    componentDidMount = () => {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    }

    componentWillUnmount = () => {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
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
                    <CTForm />
                </Animated.View>
                <CTButtonGroup />
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