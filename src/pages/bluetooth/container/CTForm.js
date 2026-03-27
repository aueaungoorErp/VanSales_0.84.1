import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  intialState,
  intialStateConfig,
  setState,
  setModel,
  setItemList,
  setModelList,
  setPrintingType as setPrintingTypeAction,
} from '../../../action/bluetooth';
import {check, checkMultiple, PERMISSIONS, RESULTS,request , requestMultiple} from 'react-native-permissions';

import Form from '../presenter/Form';
import {BluetoothFinder, BplusPrinting} from '../../../module';
import {
  removeBluetoothToken,
  getUserToken,
  setPrintingType,
} from '../../../../src/utils/Token';

class CTForm extends Component {
  constructor(props) {
    super(props);

    this._getModelPrinters();
    this._getBluetoothList();
  }

  _getModelPrinters = () => {
    console.log('_getModelPrinters');
    BplusPrinting.getModelPrinters((result) => {
      this.props.setModelList(result.modelList);
    });
  };


  _getBluetoothList = () => {
    console.log('_getBluetoothList');

    check(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT)
      .then((result) => {
        switch (result) {
          case RESULTS.DENIED:
            request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT).then((result2) => {
              BluetoothFinder.getBluetoothList((result) => {
                this.props.setItemList(result.bluetoothList);
              });
            });
            break;
          case RESULTS.UNAVAILABLE:
            BluetoothFinder.getBluetoothList((result) => {
              this.props.setItemList(result.bluetoothList);
            });
            break;
          case RESULTS.GRANTED:
            BluetoothFinder.getBluetoothList((result) => {
              this.props.setItemList(result.bluetoothList);
            });
            break;
          default:
            break;
        };
      })


    check(PERMISSIONS.ANDROID.BLUETOOTH_SCAN)
      .then((resultagain) => {
        switch (resultagain) {
          case RESULTS.DENIED:
            request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN).then((result3) => {
              BluetoothFinder.getBluetoothList((result) => {
                this.props.setItemList(result.bluetoothList);
              });
            });
            break;
          case RESULTS.UNAVAILABLE:
            BluetoothFinder.getBluetoothList((result) => {
              this.props.setItemList(result.bluetoothList);
            });
            break;
          case RESULTS.GRANTED:
            BluetoothFinder.getBluetoothList((result) => {
              this.props.setItemList(result.bluetoothList);
            });
            break;
          default:
            break;
        };
      })
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
      BplusPrinting.connect(0, this.props.bluetooth.item.address, 1);
    } else {
      BplusPrinting.connect(this.props.bluetooth.model, this.props.bluetooth.item.address, 1, );
    }

  };

  _disConnect = () => {
    BplusPrinting.disConnect();
  };

  _testPrinter = async () => {
    const userToken = await getUserToken();
    console.log('userToken ', userToken);

    let newVanCNF = {
      ...userToken.VANCONFIG,
      VANCNF_FRM_WIDTH: parseFloat(userToken.VANCONFIG.VANCNF_FRM_WIDTH),
    };

    //console.log('newVanCNF ', newVanCNF);
    BplusPrinting.testPrinter(userToken.VANCONFIG);
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
