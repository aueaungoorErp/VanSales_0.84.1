package com.bplus.bluetooth.finder.library.finder;

import org.json.JSONArray;

/**
 * Created by tanagorn on 22/2/2561.
 */

public interface IBluetoothFinder {
    void onCreate();
    void onDestroy();
    void restartDiscovery();
    JSONArray getBluetoothList();
}
