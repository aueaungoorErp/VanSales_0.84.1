import React, { Component} from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { MainTheme } from '../../constant/lov'
import SlidingUpPanel from 'rn-sliding-up-panel'

class ISlidingUpPanel extends Component {
    _isMounted = false
    _panel = null

    constructor(props) {
        super(props)
        this.state = {
            arrow: 'angle-double-up',
            toggle: 'arrow-up'
        }
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    _onMomentumDragEnd = (position) => {
        if ( position > this.props.draggableRange.top * 0.3) {
            this._setState('arrow', 'angle-double-down')
            this._setState('toggle', 'arrow-down')
        } else {
            this._setState('arrow', 'angle-double-up')
            this._setState('toggle', 'arrow-up')
        }
    }

    _onTogglePress = () => {
        if (this.state.arrow === 'angle-double-up') {
            this._panel.show()
            this._setState('arrow', 'angle-double-down')
            this._setState('toggle', 'arrow-down')
        } else {
            this._panel.hide()
            this._setState('arrow', 'angle-double-up')
            this._setState('toggle', 'arrow-up')
        }
    }

    _setState = async (key, value) =>  {
        this._isMounted && 
        await this.setState(oldState => {
            return {
                [key]: value
            }
        })
    }

    render() {
        const { visible, title, startCollapsed, showBackdrop, draggableRange, allowDragging, children, style } = this.props
        return (
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => {this._onTogglePress()}} >
                    <Icon
                        name={this.state.toggle}
                        type='font-awesome'
                        color='#517fa4'
                        size={40} />
                </TouchableOpacity>

                <SlidingUpPanel
                    visible={visible}
                    startCollapsed={startCollapsed}
                    showBackdrop={showBackdrop}
                    ref={instance => {this._panel = instance}}
                    draggableRange={draggableRange}
                    allowDragging={allowDragging}
                    onRequestClose={() => {
                        this._panel.transitionTo(draggableRange.bottom)
                    }}
                    onMomentumDragEnd={(position) => this._onMomentumDragEnd(position)}>
                    
                    <View style={[styles.panel, style && style.panel ? style.panel : null]}>
                        <TouchableOpacity 
                            style={styles.toggleTap}
                            onPress={() => {this._onTogglePress()}} >
                            <Icon
                                name={this.state.arrow}
                                type='font-awesome'
                                color='#517fa4'
                                size={40}/>
                        </TouchableOpacity>

                        <View style={styles.panelHeader}>
                            <Text>{title}</Text>
                        </View>
                        
                        <View style={styles.panelContent}>
                            {children}
                        </View>
                    </View>
                </SlidingUpPanel>
            </View>
        )
    }
}

export default ISlidingUpPanel

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        position: 'relative'
    },
    panel: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    toggleTap: {
        width: 60,
        justifyContent: 'center'
    },
    toggleButton: {
        position: 'absolute', 
        top: 24, 
        right: 24, 
        zIndex: 1
    },
    panelHeader: {
        width: '100%',
        height: 50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: MainTheme.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    panelContent: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white'
    }
})