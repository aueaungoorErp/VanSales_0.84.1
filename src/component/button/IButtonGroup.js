import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

class IButtonGroup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedIndex: this.props.selectedIndex
    }
  }

  _updateIndex(selectedIndex) {
    this.props.onPress(selectedIndex)
    this.setState({selectedIndex})
  }  

  render() {
    let { buttons, containerStyle, selectedButtonStyle, selectedTextStyle, textStyle, containerBorderRadius, buttonStyle} = this.props
    const { selectedIndex } = this.state
    return (
      <View style={styles.SectionStyle}>
        <View style={[styles.groupContainer, containerStyle, containerBorderRadius ? {borderRadius: containerBorderRadius} : null]}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this._updateIndex(index)}
              style={[
                styles.button,
                buttonStyle,
                index === selectedIndex ? [styles.selectedButton, selectedButtonStyle] : null,
                index > 0 ? {borderLeftWidth: 1, borderLeftColor: '#8FEA80'} : null,
              ]}
              activeOpacity={0.7}>
              <Text style={[styles.buttonText, textStyle, index === selectedIndex ? [styles.selectedText, selectedTextStyle] : null]}>
                {button}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

export default IButtonGroup;

const styles = StyleSheet.create({
  SectionStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
      marginVertical: 3
  },
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e1e8ee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  selectedButton: {
    backgroundColor: '#47BA8F',
  },
  buttonText: {
    fontSize: 14,
    color: '#43484d',
  },
  selectedText: {
    color: '#fff',
  },
})
