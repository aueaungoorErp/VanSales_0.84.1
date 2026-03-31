package com.bplus.printer.library.manager;

import android.app.Activity;
import android.graphics.Bitmap;

import org.json.JSONObject;

public interface IPrinterCoreManager {
    JSONObject getModelPrinters() throws Exception;
    boolean connect(Activity context, int model, String address, String connectionType) throws Exception;
    boolean disconnect() throws Exception;
    boolean isConnected() throws Exception;
    boolean setPaperWidth(int width) throws Exception;
    boolean setPrintMode(int mode) throws Exception;
    boolean setBold(boolean bold) throws Exception;
    int getPaperWidth() throws Exception;
    int getModel() throws Exception;
    void addImage(Bitmap image) throws Exception;
    void addImage(Bitmap image, int align) throws Exception;
    void addBarcode(String text) throws Exception;
    void addBarcode(String text, int align) throws Exception;
    void addQRcode(String text) throws Exception;
    void addQRcode(String text, int align) throws Exception;
    void addText(String text, double position) throws Exception;
    void addText(String text, double position, int align, boolean... inline) throws Exception;
    void flushText() throws Exception;
    void addFeedLine(int line) throws Exception;
    void addPageEnd() throws Exception;
    void addCut() throws Exception;
    void sendData() throws Exception;
}
