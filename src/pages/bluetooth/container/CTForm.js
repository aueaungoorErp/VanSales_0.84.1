import React, { Component } from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import { connect } from 'react-redux';
import { intialState, intialStateConfig, setItemList, setModel, setModelList, setPrintingType as setPrintingTypeAction, setState } from '../../../action/bluetooth';
import { BluetoothModels } from '../../../constant/lov';
import { getUserToken, removeBluetoothToken, setPrintingType } from '../../../../src/utils/Token';
import { BluetoothFinder, BplusPrinting } from '../../../module';
import Form from '../presenter/Form';
class CTForm extends Component {
  constructor(props) {
    super(props);
    this._clearTransientBluetoothState();
    this._requestPermissionsAndInit();
  }
  _clearTransientBluetoothState = () => {
    if (this.props.bluetooth?.state === 'connect failed' || this.props.bluetooth?.state === 'connecting') {
      this.props.setState(null);
    }
  };
  _requestPermissionsAndInit = async () => {
    try {
      if (Platform.OS === 'android') {
        const statuses = await requestMultiple([PERMISSIONS.ANDROID.BLUETOOTH_CONNECT, PERMISSIONS.ANDROID.BLUETOOTH_SCAN]);
        const connectStatus = statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT];
        if (connectStatus === RESULTS.GRANTED || connectStatus === RESULTS.UNAVAILABLE) {
          this._fetchBluetoothList();
        }
      }
      this._getModelPrinters();
    } catch (err) {
      console.warn('Error requesting bluetooth permissions:', err);
      this._getModelPrinters();
    }
  };
  _getModelPrinters = () => {
    if (BplusPrinting && BplusPrinting.getModelPrinters) {
      BplusPrinting.getModelPrinters(result => {
        this.props.setModelList(result.modelList);
      });
    } else {
      this.props.setModelList(BluetoothModels.items);
    }
  };
  _fetchBluetoothList = () => {
    if (!BluetoothFinder) {
      return;
    }
    BluetoothFinder.getBluetoothList(result => {
      if (result && result.bluetoothList) {
        this.props.setItemList(result.bluetoothList);
      } else {}
    });
  };
  _getBluetoothList = async () => {
    if (!BluetoothFinder) {
      return;
    }
    if (Platform.OS !== 'android') {
      this._fetchBluetoothList();
      return;
    }
    try {
      const statuses = await requestMultiple([PERMISSIONS.ANDROID.BLUETOOTH_CONNECT, PERMISSIONS.ANDROID.BLUETOOTH_SCAN]);
      const connectStatus = statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT];
      if (connectStatus === RESULTS.GRANTED || connectStatus === RESULTS.UNAVAILABLE) {
        this._fetchBluetoothList();
      } else {
        alert('กรุณาอนุญาต Bluetooth permission ในตั้งค่า');
      }
    } catch (err) {
      console.warn('Error requesting bluetooth permissions:', err);
    }
  };
  _connect = () => {
    if (this.props.bluetooth.item.name == null) {
      alert('กรุณาเลือกอุปกรณ์');
      return;
    }
    if (this.props.bluetooth.item.address == null) {
      alert('กรุณาเลือกอุปกรณ์');
      return;
    }
    if (this.props.bluetooth.model == null) {
      alert('กรุณาเลือกโมเดล');
      return;
    }
    if (this.props.bluetooth.model == 1) {
      BplusPrinting && BplusPrinting.connect(0, this.props.bluetooth.item.address, 1);
    } else {
      BplusPrinting && BplusPrinting.connect(this.props.bluetooth.model, this.props.bluetooth.item.address, 1);
    }
  };
  _disConnect = () => {
    BplusPrinting && BplusPrinting.disConnect();
  };
  _testPrinter = async () => {
    const userToken = await getUserToken();
    let newVanCNF = {
      ...userToken.VANCONFIG,
      VANCNF_FRM_WIDTH: parseFloat(userToken.VANCONFIG.VANCNF_FRM_WIDTH)
    };
    BplusPrinting && BplusPrinting.testPrinter(newVanCNF);
  };
  _clearAll = () => {
    this.props.intialStateConfig();
    removeBluetoothToken();
  };
  _setModel = async value => {
    await this.props.setModel(value);
  };
  _setPrintingType = async value => {
    this.props.setPrintingType(value);
    await setPrintingType(value);
    if (value === 'PDF') {
      if (this.props.bluetooth.state === 'connected') {
        this._disConnect();
      }
    }
  };
  render() {
    return <Form bluetooth={this.props.bluetooth} setModel={this._setModel} getBluetoothList={this._getBluetoothList.bind(this)} connect={this._connect.bind(this)} disConnect={this._disConnect.bind(this)} testPrinter={this._testPrinter.bind(this)} clearAll={this._clearAll.bind(this)} setState={this.props.setState} printingType={this.props.bluetooth.printingType} setPrintingType={this._setPrintingType} />;
  }
}
const mapStateToProps = state => ({
  bluetooth: state.bluetooth,
  screen: state.screen
});
const mapDispatchToProps = dispatch => {
  return {
    setModel: item => dispatch(setModel(item)),
    initialState: () => {
      dispatch(intialState());
    },
    intialStateConfig: () => {
      dispatch(intialStateConfig());
    },
    setState: state => {
      dispatch(setState(state));
    },
    setItemList: items => {
      dispatch(setItemList(items));
    },
    setModelList: items => {
      dispatch(setModelList(items));
    },
    setPrintingType: payload => {
      dispatch(setPrintingTypeAction(payload));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CTForm);