import React from "react"
import { Dimensions, DeviceEventEmitter, AppState, Alert } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { compose } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { BplusPrinting, BluetoothFinder } from '../module'
import { stateChange } from '../../src/action/screen'
import { setState, setWarningState, setInstance, setItemList, setPrintingType as setPrintingTypeAction } from '../../src/action/bluetooth'
import { setAppState } from '../../src/action/appState'
import { setConnectionInfo } from '../../src/action/network'
import Navigator from '../../src/services/Navigator'

import { setAccessTimeToken, getAccessTimeToken, setBluetoothToken, getBluetoothToken, getPrintingType, setPrintingType } from '../../src/utils/Token'


const EventListenerHOC = (Component) => {

   return class App extends Component {
      constructor(props) {
         super(props)

         // state = {
         //     appState: AppState.currentState
         // }

         this.props.setAppState(AppState.currentState)
         this.dimensionsSubscription = null
         this.printerStateSubscription = null
         this.bluetoothStateSubscription = null
         this.appStateSubscription = null
         this.netInfoUnsubscribe = null
      }

      componentDidMount() {

         this.dimensionsSubscription = Dimensions.addEventListener('change', () => {
            this.props.stateChange()
         })

         this.printerStateSubscription = DeviceEventEmitter.addListener('printerState', (event) => { this._printerStateChange(event) })

         this.bluetoothStateSubscription = DeviceEventEmitter.addListener('bluetoothState', (event) => {
            let { state } = event
            if (state === 'turn_off' || state === 'disconnected') {
               this.props.setState(null)
            }
         })

         this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange.bind(this))

         this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
            this._handleConnectivityChange(state)
         })

         this._autoConnectBluetooth()

      }

      componentWillUnmount() {
         if (this.dimensionsSubscription) {
            this.dimensionsSubscription.remove()
         }

         if (this.printerStateSubscription) {
            this.printerStateSubscription.remove()
         }

         if (this.bluetoothStateSubscription) {
            this.bluetoothStateSubscription.remove()
         }

         if (this.appStateSubscription) {
            this.appStateSubscription.remove()
         }

         if (this.netInfoUnsubscribe) {
            this.netInfoUnsubscribe()
         }

      }

      _autoConnectBluetooth = async () => {
         const printingType = await getPrintingType()

         if (printingType === 'BLUETOOTH') {
            this.props.setPrintingType('BLUETOOTH')
            let ignore = true
            BluetoothFinder.checkBluetoothEnable(async (value) => {

               if (value.result) {
                  let bluetooth = await getBluetoothToken()

                  if (bluetooth) {
                     this.props.setInstance(bluetooth)
                  }

                  if (bluetooth !== null && bluetooth.state === 'connected') {
                     BplusPrinting.connect(bluetooth.model, bluetooth.item.address, 1)
                  }
               }
            })

            if (ignore === true) return

            let bluetooth = await getBluetoothToken()

            if (bluetooth) {
               this.props.setInstance(bluetooth)
            }

            if (bluetooth !== null && bluetooth.state === 'connected') {
               BplusPrinting.connect(bluetooth.model, bluetooth.item.address, 1)
            }
         } else {
            await setPrintingType('PDF')
            this.props.setPrintingType('PDF')
         }
      }

      done = false
      async _handleAppStateChange(nextAppState) {
         if (!this.done) {
            this.done = true
            const navState = Navigator.getCurrentRoute()
            const routeName = navState && navState.routes ? navState.routes[navState.index].name : null
            if (routeName !== 'Login' && routeName !== 'Splash') {

               if (this.props.appState.state.match(/inactive|background/) && nextAppState === 'active') {
                  this.done = true
                  // const tt = await setAccessTimeToken(new Date())
                  const accessTimeToken = await getAccessTimeToken()
                  // console.log('ACCESS', accessTimeToken)
                  if (moment().valueOf() - accessTimeToken > 900000) {
                     Navigator.navigate('Splash')

                  }

                  // Navigator.navigate('Splash')
               }

               // console.log('nextAppState', nextAppState)
               // console.log('appState', this.props.appState)

               if (this.props.appState.state === 'active') {
                  await setAccessTimeToken(moment().valueOf().toString())
               }

               this.props.setAppState(nextAppState)
            }

         }

         if (this.done) this.done = false
      }

      _handleConnectivityChange = async (connectionInfo) => {
         this.props.setConnectionInfo(connectionInfo)
      }

      _bluetoothStateChange = (event) => {
         let { state } = event
         if (state === 'turn_off' || state === 'disconnected') {
            this.props.setState(null)
         }
      }

      _printerStateChange = (event) => {
         let { state, warningState, successState } = event

         if (state) {
            this.props.setState(state)
         }
         if (warningState) {
            this.props.setWarningState(warningState)
            this._bluetoothAlertDialog(warningState)
         }

         if (state === 'connected' || state === 'disconnected') {
            setBluetoothToken(this.props.bluetooth)
         }
      }

      _bluetoothAlertDialog = (msg) => Alert.alert(
         'ประกาศเตือน',
         msg,
         [
            { text: 'ตกลง', onPress: () => { }, style: 'cancel' },
         ],
         { cancelable: false }
      )

      render() {
         return <Component {...this.props} />
      }
   }
}

const mapStateToProps = (state) => ({
   appState: state.appState,
   bluetooth: state.bluetooth
})

const mapDispatchToProps = (dispatch) => {
   return {
      stateChange: () => {
         dispatch(stateChange())
      },
      setState: (state) => {
         dispatch(setState(state))
      },
      setWarningState: (state) => {
         dispatch(setWarningState(state))
      },
      setAppState: (state) => {
         dispatch(setAppState(state))
      },
      setConnectionInfo: (connectInfo) => {
         dispatch(setConnectionInfo(connectInfo))
      },
      setInstance: (bluetooth) => {
         dispatch(setInstance(bluetooth))
      },
      setItemList: (items) => {
         dispatch(setItemList(items))
      },
      setPrintingType: (payload) => {
         dispatch(setPrintingTypeAction(payload))
      }
   }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), EventListenerHOC)