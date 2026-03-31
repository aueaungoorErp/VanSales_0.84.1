package com.bplus.bluetooth.finder.library.utils;

import android.bluetooth.BluetoothAdapter;

/**
 * Created by tanagorn on 6/3/2561.
 */

public class BluetoothUtil {
    public static BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();

    public static BluetoothAdapter getBluetoothAdapter(){
        return bluetoothAdapter;
    }

    public static boolean getBluetoothAdapterEnabled(){
        return bluetoothAdapter.isEnabled();
    }
}
