package com.bplus.printer.library.manager.impl;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;

import com.bplus.printer.library.constant.MsgTypes;
import com.bplus.printer.library.constant.PrinterConst;
import com.bplus.printer.library.manager.IPrinterManager;

import com.epson.epos2.Epos2CallbackCode;
import com.epson.epos2.Epos2Exception;
import com.epson.epos2.printer.Printer;
import com.epson.epos2.printer.PrinterStatusInfo;
import com.epson.epos2.printer.ReceiveListener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.bplus.printer.library.utils.Other.generateQRCodeToBitmap;
import static com.bplus.printer.library.utils.PrintingUtil.formattingPrinter;

//import static com.example.android.bluetooth.printer.manager.impl.PrinterManager.convertText;

public class EPSONPrinterManager implements IPrinterManager, ReceiveListener {
    private Activity _context = null;
    private Printer printer = null;
    private int _paperWidth = 0;
    private int _printMode = 0;
    private int _characterSize = 42;
    private boolean _textBold = false;

    Handler _handler;
    private int _state;

    private List<HashMap<String, Object>> textList = new ArrayList<HashMap<String, Object>>();

    @Override
    public boolean connect(final Activity context, Handler handler, final String address, final String connectionType) throws Exception {
        this._context = context;
        this._handler = handler;

        if (printer != null) {
            printer.disconnect();
        }

        new Thread(new Runnable() {
            public void run() {
                Looper.prepare();

                try {
                    setState(PrinterConst.STATE_CONNECTING);

                    printer = new Printer(Printer.TM_M30, Printer.MODEL_ANK, context);

                    setReceiveEventListener();
                    printer.connect(checkFormatTarget(address, connectionType), Printer.PARAM_DEFAULT);

                    printer.beginTransaction();
                    setState(PrinterConst.STATE_CONNECTED);
                } catch (Epos2Exception e) {
                    finalizePrinter();
                    e.printStackTrace();
                    setState(PrinterConst.STATE_CONNECT_FAILED);
                }

                Looper.loop();
            }
        }).start();

        return true;
    }

    @Override
    public boolean disconnect() throws Exception {
        if (printer == null) {
            return true;
        }

        printer.endTransaction();
        printer.disconnect();
        finalizePrinter();
        setState(PrinterConst.STATE_DISCONNECTED);

        return true;

    }

    @Override
    public boolean isConnected() throws Exception {
        PrinterStatusInfo status = printer.getStatus();

        if (status.getConnection() == Printer.TRUE) {
            return true;
        }

        return false;
    }

    @Override
    public boolean setPaperWidth(int width) throws Exception {
        this._paperWidth = width;

        if (this._paperWidth == PrinterConst.PAPER_WIDTH_58MM) {
            this._characterSize = 42;
        } else if (this._paperWidth == PrinterConst.PAPER_WIDTH_80MM) {
            this._characterSize = 48;
        }

        return true;
    }

    @Override
    public boolean setPrintMode(int mode) throws Exception {
        this._printMode = mode;

        return true;
    }

    @Override
    public boolean setBold(boolean bold) throws Exception {
        printer.addTextStyle(Printer.FALSE, Printer.FALSE, bold ? Printer.TRUE : Printer.FALSE, Printer.COLOR_NONE);

        return false;
    }

    @Override
    public void addImage(Bitmap image) throws Exception {
        addImage(image, PrinterConst.ALIGN_LEFT);
    }

    @Override
    public void addImage(Bitmap image, int align) throws Exception {
        printer.addTextAlign(align);

        printer.addImage(image,
                0,
                0,
                image.getWidth(),
                image.getHeight(),
                Printer.COLOR_1,
                Printer.MODE_MONO,
                Printer.HALFTONE_DITHER,
                Printer.PARAM_DEFAULT,
                Printer.COMPRESS_AUTO);
    }

    @Override
    public void addBarcode(String text) throws Exception {
        addBarcode(text, PrinterConst.ALIGN_LEFT);
    }

    @Override
    public void addBarcode(String text, int align) throws Exception {
        printer.addTextAlign(align);

        printer.addBarcode(text,
                Printer.BARCODE_CODE39,
                Printer.HRI_BELOW,
                Printer.FONT_A,
                2,
                100);
    }

    @Override
    public void addQRcode(String text) throws Exception {
        addQRcode(text, PrinterConst.ALIGN_LEFT);
    }

    @Override
    public void addQRcode(String text, int align) throws Exception {
        printer.addTextAlign(align);
        Bitmap bmp = generateQRCodeToBitmap(text, 256);
        printer.addImage(bmp,
                0,
                0,
                bmp.getWidth(),
                bmp.getHeight(),
                Printer.COLOR_1,
                Printer.MODE_MONO,
                Printer.HALFTONE_DITHER,
                Printer.PARAM_DEFAULT,
                Printer.COMPRESS_AUTO);
    }

    @Override
    public void addText(String text, double position) throws Exception {
        addText(text, position, PrinterConst.ALIGN_LEFT);
    }

    @Override
    public void addText(String text, double position, int align, boolean... inline) throws Exception {
        HashMap<String, Object> hashMap = new HashMap<String, Object>();
        hashMap.put("text", text);
        hashMap.put("position", position);
        hashMap.put("align", align);
        textList.add(hashMap);

    }

    @Override
    public void flushText() throws Exception {
        String line = "";

        for (HashMap<String, Object> hashMap : textList) {
            String text = hashMap.get("text").toString();
            Double position = (Double) hashMap.get("position");
            int align = (int) hashMap.get("align");

            line = formattingPrinter(this._paperWidth, this._characterSize, line, text, position, align);

        }

        printer.addText(line +"\n");

        textList.clear();
    }

    @Override
    public void addFeedLine(int line) throws Exception {
        printer.addFeedLine(line);
    }

    @Override
    public void addPageEnd() throws Exception {
        printer.addFeedLine(4);
        printer.addPageEnd();
    }

    @Override
    public void addCut() throws Exception {
        printer.addCut(Printer.CUT_FEED);
    }

    @Override
    public void sendData() throws Exception {
        try {
            PrinterStatusInfo status = printer.getStatus();
            boolean isWarning = dispPrinterWarnings(status);

            if (isWarning == false) {
                return;
            }

            printer.sendData(600000);

        } catch (Epos2Exception e) {
            int errStatus = e.getErrorStatus();
            if (errStatus == Epos2Exception.ERR_UNSUPPORTED) {
                setState(PrinterConst.STATE_FEATURE_NOT_SUPPORTED);
            }

        }
    }

    /* ========================================================================================== */
    /* ========================================================================================== */
    /* ========================================================================================== */

    private synchronized void setState(int state) {
        _state = state;

        addText(MsgTypes.STATE, state);
    }

    public boolean dispPrinterWarnings(PrinterStatusInfo status) {

        if (status.getCoverOpen() == Printer.TRUE) {
            setState(PrinterConst.STATE_COVER_OPEN);
            return false;
        }

        if (status.getPaper() == Printer.PAPER_EMPTY) {
            setState(PrinterConst.STATE_PAPER_EMPTY);
            return false;
        }

        return true;
    }

    void addText(String msgType, int state){
        // Give the new state to the Handler so the UI Activity can update
        MsgTypes type;
        Message msg;
        Bundle bundle = new Bundle();
        if(msgType.equals(MsgTypes.STATE)){
            msg = _handler.obtainMessage(MsgTypes.MESSAGE_STATE_CHANGE);// mHandler.obtainMessage(_Activity.MESSAGE_DEVICE_NAME);
        }
        else if(msgType.equals(MsgTypes.DEVICE_NAME)){
            msg = _handler.obtainMessage(MsgTypes.MESSAGE_DEVICE_NAME);
        }
        else if(msgType.equals(MsgTypes.INFO)){
            msg = _handler.obtainMessage(MsgTypes.MESSAGE_INFO);
        }
        else if(msgType.equals(MsgTypes.TOAST)){
            msg = _handler.obtainMessage(MsgTypes.MESSAGE_TOAST);
        }
        else if(msgType.equals(MsgTypes.READ)){
            msg = _handler.obtainMessage(MsgTypes.MESSAGE_READ);
        }
        else if(msgType.equals(MsgTypes.WRITE)){
            msg = _handler.obtainMessage(MsgTypes.MESSAGE_WRITE);
        }
        else {
            msg = new Message();
        }

        bundle.putInt(msgType, state);
        msg.setData(bundle);
        msg.arg1 = state;
        _handler.sendMessage(msg);
    }

    @Override
    public void onPtrReceive(final Printer printerObj,
                             final int code,
                             final PrinterStatusInfo status,
                             final String printJobId) {

        _context.runOnUiThread(new Runnable() {
            @Override
            public synchronized void run() {
                if (code == Epos2CallbackCode.CODE_ERR_PAPER_JAM){
                    setState(PrinterConst.STATE_PAPER_JAM);
                }

                if (code == Epos2CallbackCode.CODE_ERR_BATTERY_LOW) {
                    setState(PrinterConst.STATE_BATTERY_LOW);
                }

                if(code == Epos2CallbackCode.CODE_SUCCESS) {
                    setState(PrinterConst.STATE_PRINT_SUCCESS);
                }

//                ShowMsg.showResult(
// code, makeErrorMessage(status), context);
//                Log.i("status 1 ", status.toString());
                dispPrinterWarnings(status);
//                printerStatus.updateState(true);
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        printer.clearCommandBuffer();
//                        disconnectPrinter();
                    }
                }).start();
            }
        });
    }

    public void setReceiveEventListener() {
        printer.setReceiveEventListener(this);
    }

    public void finalizePrinter() {
        if (printer == null) {
            return;
        }

//        printer.clearCommandBuffer();

        printer.setReceiveEventListener(null);

        printer = null;
    }

    public String checkFormatTarget(String target, String connectionType){
        if (connectionType.equals(PrinterConst.BLUETOOTH)) {
            String checkFormat = target.substring(0, 2);
            if (!checkFormat.equals("BT:")) {
                target = "BT:" + target;
            }
        } else if (connectionType.equals(PrinterConst.TCP)) {
            String checkFormat = target.substring(0, 3);
            if (!checkFormat.equals("TCP:")) {
                target = "TCP:" + target;
            }
        } else if (connectionType.equals(PrinterConst.USB)) {
            String checkFormat = target.substring(0, 3);
            if (!checkFormat.equals("USB:")) {
                target = "USB:" + target;
            }
        }

        Log.i("golf show", target);

        return target;
    }

    private boolean isPrintable(PrinterStatusInfo status) {
        if (status == null) {
            return false;
        }

        if (status.getConnection() == Printer.FALSE) {
            return false;
        }
        else if (status.getOnline() == Printer.FALSE) {
            return false;
        }
        else {
            ;//print available
        }

        return true;
    }

    private static String getEposExceptionText(int state) {
        String return_text = "";
        switch (state) {
            case    Epos2Exception.ERR_PARAM:
                return_text = "ERR_PARAM";
                break;
            case    Epos2Exception.ERR_CONNECT:
                return_text = "ERR_CONNECT";
                break;
            case    Epos2Exception.ERR_TIMEOUT:
                return_text = "ERR_TIMEOUT";
                break;
            case    Epos2Exception.ERR_MEMORY:
                return_text = "ERR_MEMORY";
                break;
            case    Epos2Exception.ERR_ILLEGAL:
                return_text = "ERR_ILLEGAL";
                break;
            case    Epos2Exception.ERR_PROCESSING:
                return_text = "ERR_PROCESSING";
                break;
            case    Epos2Exception.ERR_NOT_FOUND:
                return_text = "ERR_NOT_FOUND";
                break;
            case    Epos2Exception.ERR_IN_USE:
                return_text = "ERR_IN_USE";
                break;
            case    Epos2Exception.ERR_TYPE_INVALID:
                return_text = "ERR_TYPE_INVALID";
                break;
            case    Epos2Exception.ERR_DISCONNECT:
                return_text = "ERR_DISCONNECT";
                break;
            case    Epos2Exception.ERR_ALREADY_OPENED:
                return_text = "ERR_ALREADY_OPENED";
                break;
            case    Epos2Exception.ERR_ALREADY_USED:
                return_text = "ERR_ALREADY_USED";
                break;
            case    Epos2Exception.ERR_BOX_COUNT_OVER:
                return_text = "ERR_BOX_COUNT_OVER";
                break;
            case    Epos2Exception.ERR_BOX_CLIENT_OVER:
                return_text = "ERR_BOX_CLIENT_OVER";
                break;
            case    Epos2Exception.ERR_UNSUPPORTED:
                return_text = "ERR_UNSUPPORTED";
                break;
            case    Epos2Exception.ERR_FAILURE:
                return_text = "ERR_FAILURE";
                break;
            default:
                return_text = String.format("%d", state);
                break;
        }
        return return_text;
    }

}
