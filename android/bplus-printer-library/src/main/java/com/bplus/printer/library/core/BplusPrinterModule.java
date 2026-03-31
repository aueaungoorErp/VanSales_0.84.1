 package com.bplus.printer.library.core;

import android.content.IntentFilter;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.bplus.printer.library.broadcast.PrinterBroadcastReceiver;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class BplusPrinterModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext mReactContext;
    private PrinterBroadcastReceiver mPrinterBroadcastReceiver;

    public BplusPrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);

        this.mReactContext = reactContext;
        this.mPrinterBroadcastReceiver = new PrinterBroadcastReceiver(this.mReactContext);

        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(reactContext);
        localBroadcastManager.registerReceiver(mPrinterBroadcastReceiver, new IntentFilter("bluetoothStateEvent"));
    }

    @Override
    public String getName() {
        return "BplusPrinter";
    }
}
