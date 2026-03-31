package com.bplus.bluetooth.finder.library.core;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;


import com.bplus.bluetooth.finder.library.finder.BluetoothFinder;
import com.bplus.bluetooth.finder.library.finder.IBluetoothFinder;

import org.json.JSONException;
import org.json.JSONObject;

public class BluetoothDiscovery {
    private IBluetoothFinder bluetoothFinder;

    public void onCreate(Activity context) {
        String[] filter = new String[2];
        filter[0] = BluetoothDevice.ACTION_FOUND;
        filter[1] = BluetoothAdapter.ACTION_DISCOVERY_FINISHED;

        bluetoothFinder = new BluetoothFinder(context, filter);
        bluetoothFinder.onCreate();
    }

    public void onDestroy() {
        bluetoothFinder.onDestroy();
    }

    public JSONObject getJSONBluetoothList() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("bluetoothList", bluetoothFinder.getBluetoothList());
        return jsonObject;
    }
}
