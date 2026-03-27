import React, { Component } from 'react'
import { View, StyleSheet  } from 'react-native'
import { ButtonGroup } from 'react-native-elements'

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
        <ButtonGroup
          onPress={this._updateIndex.bind(this)}
          selectedIndex={selectedIndex}
          buttons={buttons}
          buttonStyle={buttonStyle}
          containerStyle={containerStyle}
          selectedButtonStyle={selectedButtonStyle}
          selectedTextStyle={selectedTextStyle}
          textStyle={textStyle}
          containerBorderRadius={containerBorderRadius} 
          innerBorderStyle={{width: 1, color: '#8FEA80'}} />
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
  }
})
