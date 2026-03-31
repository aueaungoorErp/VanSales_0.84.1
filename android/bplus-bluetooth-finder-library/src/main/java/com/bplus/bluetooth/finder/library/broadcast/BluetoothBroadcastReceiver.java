package com.bplus.bluetooth.finder.library.broadcast;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class BluetoothBroadcastReceiver extends BroadcastReceiver {

    private ReactApplicationContext mReactContext;

    public BluetoothBroadcastReceiver(ReactApplicationContext reactContext) {
        this.mReactContext = reactContext;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        BluetoothDevice bluetoothDevice;
        int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, -1);
        WritableMap payload = Arguments.createMap();


        switch(action)
        {
            case BluetoothAdapter.ACTION_STATE_CHANGED:
                switch(state){
                    case BluetoothAdapter.STATE_CONNECTED:
                        break;
                    case BluetoothAdapter.STATE_CONNECTING:
                        break;
                    case BluetoothAdapter.STATE_DISCONNECTED:
                        break;
                    case BluetoothAdapter.STATE_DISCONNECTING:
                        break;
                    case BluetoothAdapter.STATE_OFF:
                        payload.putString("state", "turn_off");
                        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("bluetoothState", payload);
                        break;
                    case BluetoothAdapter.STATE_ON:
//                        payload.putInt("state", BluetoothAdapter.STATE_ON);
//                        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                                .emit("bluetoothState", payload);
                        break;
                    case BluetoothAdapter.STATE_TURNING_OFF:
                        break;
                    case BluetoothAdapter.STATE_TURNING_ON:
                        break;
                }

                break;
            case BluetoothDevice.ACTION_ACL_CONNECTED:
//                bluetoothDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
//                payload.putString("state", BluetoothDevice.ACTION_ACL_CONNECTED);
//                payload.putString("name", bluetoothDevice.getName());
//                payload.putString("address", bluetoothDevice.getAddress());
//                mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                        .emit("bluetoothState", payload);

            case BluetoothDevice.ACTION_ACL_DISCONNECTED:
                bluetoothDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                payload.putString("state", "disconnected");
                payload.putString("name", bluetoothDevice.getName());
                payload.putString("address", bluetoothDevice.getAddress());
                mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("bluetoothState", payload);
                break;
        }
    }
}
