import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import Navigator from '../../services/Navigator';

const RightSideHeader = (props) => {
    const _onPress = () => { 
      Navigator.navigate('Bluetooth') 
    }

    const _renderConnectState = () => {
      return(
        <TouchableOpacity onPress={_onPress}>
          <Image
            style={
              {
                width: 20, 
                height: 20, 
                alignSelf: 'center',
                marginTop: 4 
              }
            }
            resizeMode='contain'
            source={require('../../images/Printer.png')} />
          </TouchableOpacity>
      )
    }

    const _renderDisconnectState = () => {
      return(
        <TouchableOpacity onPress={_onPress}>
          <Image
            style={
              {
                width: 30, 
                height: 30, 
                alignSelf: 'center'
              }
            }
            resizeMode='contain'
            source={require('../../images/Printer_Disconnect.png')} />
          </TouchableOpacity>
      )
    }
    const _renderPDF = () => {
      return (
        <TouchableOpacity onPress={_onPress}>
          <FontAwesome5 name="file-pdf" color="#FFFFFF" size={22} solid />
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.container}>
        {
          props.bluetooth.printingType === 'BLUETOOTH' ?  props.bluetooth && props.bluetooth.state === 'connected' ? _renderConnectState() : _renderDisconnectState() : _renderPDF()
        }
      
      </View>
    )
}

const mapStateToProps = (state) => ({
  bluetooth: state.bluetooth
})

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightSideHeader)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent : 'flex-end'
  },
  buttonStyle: {

  }
})
