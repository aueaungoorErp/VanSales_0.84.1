import React, { Component } from 'react';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import { connect } from 'react-redux';
import {
  intialState,
  intialStateConfig,
  setItemList,
  setModel,
  setModelList,
  setPrintingType as setPrintingTypeAction,
  setState,
} from '../../../action/bluetooth';

import {
  getUserToken,
  removeBluetoothToken,
  setPrintingType,
} from '../../../../src/utils/Token';
import { BluetoothFinder, BplusPrinting } from '../../../module';
import Form from '../presenter/Form';

class CTForm extends Component {
  constructor(props) {
    super(props);

    this._requestPermissionsAndInit();
  }

  _requestPermissionsAndInit = async () => {
    try {
      const statuses = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      ]);
      console.log('Bluetooth permissions:', JSON.stringify(statuses));

      this._getModelPrinters();

      const connectStatus = statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT];
      const scanStatus = statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN];

      if (connectStatus === RESULTS.GRANTED || connectStatus === RESULTS.UNAVAILABLE) {
        this._fetchBluetoothList();
      } else {
        console.warn('BLUETOOTH_CONNECT permission denied:', connectStatus);
      }
    } catch (err) {
      console.warn('Error requesting bluetooth permissions:', err);
      this._getModelPrinters();
    }
  };

  _getModelPrinters = () => {
    console.log('_getModelPrinters called');
    console.log('BplusPrinting module:', BplusPrinting);
    console.log('BluetoothFinder module:', BluetoothFinder);
    if (!BplusPrinting) {
      console.warn('BplusPrinting native module is not available');
      return;
    }
    BplusPrinting.getModelPrinters((result) => {
      console.log('getModelPrinters result:', JSON.stringify(result));
      this.props.setModelList(result.modelList);
    });
  };

  _fetchBluetoothList = () => {
    if (!BluetoothFinder) {
      console.warn('BluetoothFinder native module is not available');
      return;
    }
    console.log('Calling BluetoothFinder.getBluetoothList...');
    BluetoothFinder.getBluetoothList((result) => {
      console.log('BluetoothFinder result:', JSON.stringify(result));
      if (result && result.bluetoothList) {
        this.props.setItemList(result.bluetoothList);
      } else {
        console.warn('No bluetoothList in result:', result);
      }
    });
  };

  _getBluetoothList = async () => {
    console.log('_getBluetoothList');
    if (!BluetoothFinder) {
      console.warn('BluetoothFinder native module is not available');
      return;
    }

    try {
      const statuses = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      ]);

      const connectStatus = statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT];
      if (connectStatus === RESULTS.GRANTED || connectStatus === RESULTS.UNAVAILABLE) {
        this._fetchBluetoothList();
      } else {
        console.warn('BLUETOOTH_CONNECT permission denied:', connectStatus);
        alert('กรุณาอนุญาต Bluetooth permission ในตั้งค่า');
      }
    } catch (err) {
      console.warn('Error requesting bluetooth permissions:', err);
    }
  };

  _connect = () => {

    console.log('this.props.bluetooth ', JSON.stringify(this.props.bluetooth));


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
    console.log('this.props.bluetooth ', JSON.stringify(this.props.bluetooth));
    console.log('this.props.bluetooth.model ', this.props.bluetooth.model);
    console.log(
      'this.props.bluetooth.item.address ',
      this.props.bluetooth.item.address,
    );

    if (this.props.bluetooth.model == 1) {
      BplusPrinting && BplusPrinting.connect(0, this.props.bluetooth.item.address, 1);
    } else {
      BplusPrinting && BplusPrinting.connect(this.props.bluetooth.model, this.props.bluetooth.item.address, 1, );
    }

  };

  _disConnect = () => {
    BplusPrinting && BplusPrinting.disConnect();
  };

  _testPrinter = async () => {
    const userToken = await getUserToken();
    console.log('userToken ', userToken);

    let newVanCNF = {
      ...userToken.VANCONFIG,
      VANCNF_FRM_WIDTH: parseFloat(userToken.VANCONFIG.VANCNF_FRM_WIDTH),
    };

    //console.log('newVanCNF ', newVanCNF);
    BplusPrinting && BplusPrinting.testPrinter(userToken.VANCONFIG);
  };

  _clearAll = () => {
    this.props.intialStateConfig();
    removeBluetoothToken();
  };

  _setModel = async (value) => {
    await this.props.setModel(value);
  };

  _setPrintingType = async (value) => {
    this.props.setPrintingType(value);
    await setPrintingType(value);
    if (value === 'PDF') {
      if (this.props.bluetooth.state === 'connected') {
        this._disConnect();
      }
    }
  };

  render() {
    return (
      <Form
        bluetooth={this.props.bluetooth}
        setModel={this._setModel}
        getBluetoothList={this._getBluetoothList.bind(this)}
        connect={this._connect.bind(this)}
        disConnect={this._disConnect.bind(this)}
        testPrinter={this._testPrinter.bind(this)}
        clearAll={this._clearAll.bind(this)}
        setState={this.props.setState}
        printingType={this.props.bluetooth.printingType}
        setPrintingType={this._setPrintingType}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  bluetooth: state.bluetooth,
  screen: state.screen,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setModel: (item) => dispatch(setModel(item)),
    initialState: () => {
      dispatch(intialState());
    },
    intialStateConfig: () => {
      dispatch(intialStateConfig());
    },
    setState: (state) => {
      dispatch(setState(state));
    },
    setItemList: (items) => {
      dispatch(setItemList(items));
    },
    setModelList: (items) => {
      dispatch(setModelList(items));
    },
    setPrintingType: (payload) => {
      dispatch(setPrintingTypeAction(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTForm);
