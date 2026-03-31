package com.bplus.printer.library.broadcast;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class PrinterBroadcastReceiver extends BroadcastReceiver {

    private ReactApplicationContext mReactContext;

    public PrinterBroadcastReceiver(ReactApplicationContext reactContext) {
        this.mReactContext = reactContext;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String state = intent.getStringExtra("state");
        String warningState = intent.getStringExtra("warningState");
        String successState = intent.getStringExtra("successState");
        WritableMap payload = Arguments.createMap();
        payload.putString("state", state);
        payload.putString("warningState", warningState);
        payload.putString("successState", successState);

        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("printerState", payload);
    }
}
