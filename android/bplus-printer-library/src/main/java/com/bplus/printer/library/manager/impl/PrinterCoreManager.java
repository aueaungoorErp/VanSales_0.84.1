package com.bplus.printer.library.manager.impl;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.bplus.printer.library.constant.MsgTypes;
import com.bplus.printer.library.constant.PrinterConst;
import com.bplus.printer.library.manager.IPrinterCoreManager;
import com.bplus.printer.library.manager.IPrinterManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;

import static com.bplus.printer.library.constant.PrinterConst.EPSON;
import static com.bplus.printer.library.constant.PrinterConst.PRINTER_MODEL_ID_ARRAY;
import static com.bplus.printer.library.constant.PrinterConst.PRINTER_MODEL_NAME_ARRAY;
import static com.bplus.printer.library.constant.PrinterConst.ZIJIANG;
import static com.bplus.printer.library.constant.PrinterConst.BARIGAN;

public class PrinterCoreManager implements IPrinterCoreManager {

    Activity context = null;
    private IPrinterManager printerManager = null;
    private int _model = 0;
    private int _paperWidth = 0;

    @Override
    public JSONObject getModelPrinters() throws Exception {
        JSONObject jsonObject = new JSONObject();
        JSONArray jsonArray = new JSONArray();

        for (int i = 0; i < PRINTER_MODEL_NAME_ARRAY.length; i++) {
            HashMap<String, Object> item = new HashMap<String, Object>();
            item.put("value", PRINTER_MODEL_ID_ARRAY[i]);
            item.put("label", PRINTER_MODEL_NAME_ARRAY[i]);
            jsonArray.put(item);
        }

        return jsonObject.put("modelList", jsonArray);
    }

    @Override
    public boolean connect(Activity context, int model, String address, String connectionType) throws Exception {
        if (printerManager != null) {
            printerManager.disconnect();
        }

        this._model = model;

        if (model == ZIJIANG) {
            printerManager = new ZJPrinterManager();
        } else if (model == EPSON) {
            printerManager = new EPSONPrinterManager();
        } else if (model == BARIGAN) {
            printerManager = new BariganPrinterManager();
        } else {
            return false;
        }

        return printerManager.connect(context, mHandler, address, connectionType);
    }

    public boolean disconnect() throws Exception {
        return printerManager.disconnect();
    }

    public boolean isConnected() throws Exception {
        return printerManager.isConnected();
    }

    @Override
    public boolean setPaperWidth(int width) throws Exception {
        this._paperWidth = width;
        return printerManager.setPaperWidth(width);
    }

    @Override
    public boolean setPrintMode(int mode) throws Exception {
        return printerManager.setPrintMode(mode);
    }

    @Override
    public boolean setBold(boolean bold) throws Exception {
        return printerManager.setBold(bold);
    }

    @Override
    public int getPaperWidth() throws Exception {
        return this._paperWidth;
    }

    @Override
    public int getModel() throws Exception {
        return this._model;
    }

    @Override
    public void addImage(Bitmap image) throws Exception {
        printerManager.addImage(image);
    }

    @Override
    public void addImage(Bitmap image, int align) throws Exception {
        printerManager.addImage(image, align);
    }

    @Override
    public void addBarcode(String text) throws Exception {
        printerManager.addBarcode(text);
    }

    @Override
    public void addBarcode(String text, int align) throws Exception {
        printerManager.addBarcode(text, align);
    }

    @Override
    public void addQRcode(String text) throws Exception {
        printerManager.addQRcode(text);
    }

    @Override
    public void addQRcode(String text, int align) throws Exception {
        printerManager.addQRcode(text, align);
    }

    @Override
    public void addText(String text, double position) throws Exception {
        if ((Double.compare(position, 0) <= 0) || (Double.compare(100, position) < 0))
            throw new Exception("position must be between 0 and 100");
        printerManager.addText(text, position);
    }

    @Override
    public void addText(String text, double position, int align, boolean... inline) throws Exception {
        if ((Double.compare(position, 0) <= 0) || (Double.compare(100, position) < 0))
            throw new Exception("position must be between 0 and 100");
        printerManager.addText(text, position, align, inline);
    }

    @Override
    public void flushText() throws Exception {
        printerManager.flushText();
    }

    @Override
    public void addFeedLine(int line) throws Exception {
        printerManager.addFeedLine(line);
    }

    @Override
    public void addPageEnd() throws Exception {
        printerManager.addPageEnd();
    }

    @Override
    public void addCut() throws Exception {
        printerManager.addCut();
    }

    @Override
    public void sendData() throws Exception {
        printerManager.sendData();
    }

    private final Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case MsgTypes.MESSAGE_STATE_CHANGE:
                    Bundle bundle = msg.getData();
                    int status = bundle.getInt("state");

                    switch (msg.arg1) {
                        case PrinterConst.STATE_CONNECTED:
                            sendBroadcast("state", "connected");
                            break;
                        case PrinterConst.STATE_CONNECTING:
                            sendBroadcast("state", "connecting");
                            break;
                        case PrinterConst.STATE_LISTEN:
                            // sendBroadcast("connecting");
                            break;
                        case PrinterConst.STATE_IDLE:
                            // sendBroadcast("nothing");
                            break;
                        case PrinterConst.STATE_DISCONNECTED:
                            sendBroadcast("state", "disconnected");
                            break;
                        case PrinterConst.STATE_CONNECT_FAILED:
                            sendBroadcast("state", "connect failed");
                            break;
                        case PrinterConst.STATE_CONNECT_LOST:
                            // sendBroadcast("connect lost");
                            break;
                        case PrinterConst.STATE_COVER_OPEN:
                            sendBroadcast("warningState", "cover is open");
                            break;
                        case PrinterConst.STATE_PAPER_EMPTY:
                            sendBroadcast("warningState", "paper is empty");
                            break;
                        case PrinterConst.STATE_PAPER_JAM:
                            sendBroadcast("warningState", "paper jam");
                            break;
                        case PrinterConst.STATE_BATTERY_LOW:
                            sendBroadcast("warningState", "battery low");
                            break;
                        case PrinterConst.STATE_FEATURE_NOT_SUPPORTED:
                            sendBroadcast("warningState", "feature not supported");
                            break;
                        case PrinterConst.STATE_PRINT_SUCCESS:
                            sendBroadcast("successState", "print success");
                            break;
                    }
                    break;

            }
        }
    };

    public void sendBroadcast(String type, String msg) {
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(context);
        Intent i = new Intent("bluetoothStateEvent");
        i.putExtra(type, msg);
        localBroadcastManager.sendBroadcast(i);
    }
}
