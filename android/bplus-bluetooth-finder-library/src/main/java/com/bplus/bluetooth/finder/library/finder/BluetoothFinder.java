package com.bplus.bluetooth.finder.library.finder;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.Manifest;
import org.json.JSONArray;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import static com.bplus.bluetooth.finder.library.constant.BluetoothConstant.REQUEST_ENABLE_BT;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

public class BluetoothFinder implements IBluetoothFinder {
    private Activity context = null;
    private List<HashMap<String, Object>> bluetoothList = null;
    private BluetoothAdapter bluetoothAdapter;
    private String[] bluetoothAction;

    public BluetoothFinder(Activity context,
                           String[] bluetoothAction) {
        this.context = context;
        this.bluetoothAction = bluetoothAction;
    }
    @Override
    public void onCreate() {
        bluetoothList = new ArrayList<HashMap<String, Object>>();
        IntentFilter filter = new IntentFilter();
        for(String filterStr : bluetoothAction){
            filter.addAction(filterStr);
        }
        context.registerReceiver(mReceiver, filter);
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    @Override
    public void onDestroy() {
        if (bluetoothAdapter != null) {
            bluetoothAdapter.cancelDiscovery();
        }
        context.unregisterReceiver(mReceiver);
    }

    @Override
    public void restartDiscovery() {

    }

    // @Override
    // public JSONArray getBluetoothList(){
    //     Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
    //     JSONArray array = new JSONArray();


    //     bluetoothList.clear();
    //     if (pairedDevices.size() > 0) {
    //         for (BluetoothDevice device : pairedDevices) {
    //             HashMap<String, Object> item = new HashMap<String, Object>();
    //             item.put("name", device.getName());
    //             item.put("address", device.getAddress());
    //             bluetoothList.add(item);
    //             array.put(item);
    //         }
    //     }

    //     return array;
    // }
      @Override
    public JSONArray getBluetoothList() {
        JSONArray array = new JSONArray();

        try {

            BluetoothAdapter mBluetoothAdapter = bluetoothAdapter.getDefaultAdapter();
            Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();

            bluetoothList.clear();
            if (pairedDevices.size() > 0) {
                for (BluetoothDevice device : pairedDevices) {
                    HashMap<String, Object> item = new HashMap<String, Object>();
                    item.put("name", device.getName());
                    item.put("address", device.getAddress());
                    bluetoothList.add(item);
                    array.put(item);
                }
            } else {
                // array.put("No Paired Device.");
            }

        } finally {

        }

        return array;
    }

    private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device.getBondState() != BluetoothDevice.BOND_BONDED) {
                    HashMap<String, Object> item = new HashMap<String, Object>();
                    item.put("name", device.getName());
                    item.put("address", device.getAddress());
                    bluetoothList.add(item);
                }
            }
        }
    };
}
