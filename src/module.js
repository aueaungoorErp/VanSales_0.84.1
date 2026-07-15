import { NativeModules } from 'react-native';

const {
  BluetoothFinder: NativeBluetoothFinder,
  CoreBluetoothFinder,
  BluetoothPrinter,
  BplusPrinting: NativeBplusPrinting,
} = NativeModules;

const invokeCallback = (callback, result) => {
  if (typeof callback === 'function') {
    callback(result);
  }
};

const BluetoothFinder = NativeBluetoothFinder ?? {
  checkBluetoothEnable: callback => invokeCallback(callback, { result: true }),
  getBluetoothList: callback => invokeCallback(callback, { bluetoothList: [] }),
};

const BplusPrinting = NativeBplusPrinting ?? {
  connect: () => {},
  disConnect: () => {},
  getModelPrinters: callback => invokeCallback(callback, { modelList: [] }),
  testPrinter: () => {},
  printReceipt: () => {},
  printReport: () => {},
  printPaymentReceipt: () => {},
};

module.exports = {
  BluetoothFinder,
  CoreBluetoothFinder,
  BluetoothPrinter,
  BplusPrinting,
  isNativeBluetoothAvailable: !!NativeBluetoothFinder,
};
