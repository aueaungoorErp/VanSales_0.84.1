// import React, { Component } from 'react'
// import { View, Text, TouchableOpacity, StyleSheet, Image, BackHandler } from 'react-native'
// import { RNCamera } from 'react-native-camera'
// import { MainTheme } from '../../constant/lov'
// import BarcodeFinder from './IBarcodeFinder'

// class ICamera extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             cameraType: RNCamera.Constants.Type.back,
//             lastImage: null,
//             working: false
//         }
//         this._takePicture = this._takePicture.bind(this)
//         this._camera = null
//     }

//     componentDidMount() {
//         this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//             if (this.state.working) {
//                 return true
//             }
//         })
//     }

//     componentWillUnmount() {
//         this.backHandler.remove()
//     }

//     _reverseCamera = () => {
//         this.setState(oldState => {
//             return {
//                 cameraType: this.state.cameraType === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
//             }
//         })
//     }

//     _takePicture = async () => {
//         if (this._camera) {

//             this.setState(oldState => {
//                 return {
//                     working: true
//                 }
//             })

//             const options = { quality: 0.5, base64: true, fixOrientation: true }
//             const data = await this._camera.takePictureAsync(options)

//             this.setState(oldState => {
//                 return {
//                     lastImage: data,
//                     working: false
//                 }
//             })

//             this.props.takePicture ? this.props.takePicture(data) : null
//         }
//     }

//     render() {
//         const { permissionDialogTitle, permissionDialogMessage, style, reverseCamera, SnapShotButtonCustom } = this.props

//         return (
//             <View style={[styles.container, style && style.container ? style.container : null]}>
//                 <RNCamera
//                     ref={ref => {
//                         this._camera = ref;
//                     }}
//                     style = {[styles.preview, style && style.preview ? style.preview : null]}
//                     type={this.state.cameraType}
//                     flashMode={RNCamera.Constants.FlashMode.on}
//                     androidCameraPermissionOptions={{
//                         title: permissionDialogTitle ? permissionDialogTitle : 'Permission to use camera',
//                         message: permissionDialogMessage ? permissionDialogMessage : 'We need your permission to use your camera phone'
//                     }}
//                     onBarCodeRead={ (data) => this.props.onBarCodeRead ? this.props.onBarCodeRead(data) : null } >

//                     {
//                         this.props.barcodeFinderVisible ? <BarcodeFinder width={280} height={220} borderColor="red" borderWidth={2} /> : null
//                     }

//                 </RNCamera>

//                 {
//                     !this.props.barcodeFinderVisible ?
//                     <View style={[styles.footer,  style && style.buttonSection ? styles.buttonSection : null]}>
//                         <Image
//                             style={[styles.lastImage, style && style.lastImage ? style.lastImage : null]}
//                             source={{uri: this.state.lastImage ? this.state.lastImage.uri : 'null'}} />
//                         { SnapShotButtonCustom ? SnapShotButtonCustom : <SnapShotButton takePicture={this._takePicture.bind(this)} disabled={this.state.working} /> }
//                         { reverseCamera ? <ReverseCamera reverseCamera={this._reverseCamera.bind(this)} /> : <View style={{ width: 66, margin: 20 }} />}
//                     </View>
//                     : null
//                 }
//             </View>
//         )
//     }
// }

// export default ICamera

// const SnapShotButton = (props) => {

//     return (
//         <TouchableOpacity
//             onPress={props.takePicture}
//             disabled={props.disabled}
//             style = {styles.capture}>
//             <Text style={{fontSize: 14}}> ถ่าย </Text>
//         </TouchableOpacity>
//     )
// }

// const ReverseCamera = (props) => {
//     const { reverseCamera,  style } = props
//     return (
//         <Icon
//             name='switch-camera'
//             type='MaterialCommunityIcons'
//             size={66}
//             iconStyle={[styles.iconStyle, style && style.iconStyle ? style.iconStyle : null]}
//             color={MainTheme.colorSecondary}
//             underlayColor='transparent'
//             onPress={reverseCamera} />
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         backgroundColor: 'black'
//     },
//     preview: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'center'
//     },
//     capture: {
//         width: 80,
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         padding: 15,
//         paddingHorizontal: 20,
//         alignSelf: 'center',
//         margin: 20
//     },
//     footer: {
//         height: 66,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         backgroundColor: '#000000',

//     },
//     lastImage: {
//         alignSelf: 'center',
//         width: 80,
//         height: 58,
//         alignItems: 'center',
//         marginLeft: 15,
//         backgroundColor: '#000000'
//     },
//     iconStyle: {
//     }
// })
