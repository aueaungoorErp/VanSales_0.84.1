package com.bplus.bluetooth.finder.library.core;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.content.IntentFilter;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.bplus.bluetooth.finder.library.broadcast.BluetoothBroadcastReceiver;
import com.bplus.bluetooth.finder.library.utils.BluetoothUtil;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONException;

import static com.bplus.bluetooth.finder.library.constant.BluetoothConstant.REQUEST_ENABLE_BT;
import static com.bplus.bluetooth.finder.library.utils.MapUtil.toMap;
import static com.bplus.bluetooth.finder.library.utils.MapUtil.toWritableMap;


public class BluetoothFinderModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext mReactContext;
    private BluetoothBroadcastReceiver mBluetoothBroadcastReceiver;

  public BluetoothFinderModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.mReactContext = reactContext;
    mBluetoothBroadcastReceiver = new BluetoothBroadcastReceiver(this.mReactContext);

    IntentFilter filter = new IntentFilter();
    filter.addAction(BluetoothDevice.ACTION_ACL_CONNECTED);
    filter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED);
    filter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);

    LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(reactContext);
    localBroadcastManager.registerReceiver(mBluetoothBroadcastReceiver, new IntentFilter(filter));

    reactContext.registerReceiver(mBluetoothBroadcastReceiver,
            new IntentFilter(filter));
  }

  @Override
  public String getName() {
    return "BluetoothFinder";
  }

  @ReactMethod
  public void checkBluetoothEnable(Callback callback) {
    if (!BluetoothUtil.getBluetoothAdapterEnabled()) {
      Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
      getCurrentActivity().startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
      callback.invoke(toWritableMap("result", false));
      return;
    }

    callback.invoke(toWritableMap("result", true));
  }

  @ReactMethod
  public void getBluetoothList(Callback callback) {
    BluetoothDiscovery bluetoothDiscovery = new BluetoothDiscovery();
    bluetoothDiscovery.onCreate(getCurrentActivity());
//    callback.invoke(toWritableArray(toArray(bluetoothDiscovery.getJSONBluetoothList())));
    try {

      if (!BluetoothUtil.getBluetoothAdapterEnabled()) {
        Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        getCurrentActivity().startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
        return;
      }
      callback.invoke(toWritableMap(toMap(bluetoothDiscovery.getJSONBluetoothList())));
    } catch (JSONException e) {
      callback.invoke(toWritableMap( "error", e.getMessage()));
    }
  }

}
