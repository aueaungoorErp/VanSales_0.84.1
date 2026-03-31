package com.bplus.printer.library.manager.impl;

import static com.bplus.printer.library.utils.PrintingUtil.formattingPrinter;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.graphics.Bitmap;
import android.os.Handler;
import android.util.Log;

import com.bplus.printer.library.constant.PrinterConst;
import com.bplus.printer.library.manager.IPrinterManager;
import com.bplus.printer.library.utils.Command;
import com.bplus.printer.library.utils.Other;
import com.bplus.printer.library.utils.PrintPicture;
import com.bplus.printer.library.utils.PrinterCommand;
import com.bplus.printer.library.utils.PrintingUtil;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.bplus.printer.library.utils.PrintingUtil.formattingPrinterGraphicMode;
import static com.bplus.printer.library.utils.PrintingUtil.formattingPrinterGraphicModeOutLine;

public class ZJPrinterManager implements IPrinterManager {
    private Activity context = null;
    private BluetoothPrinterCore printerCore = null;
    private BluetoothAdapter mBluetoothAdapter = null;
    private int _paperWidth = 0;
    private int _printMode = 0;
    private int _characterSize = 25;
    private boolean _textBold = false;

    private List<HashMap<String, Object>> textList = new ArrayList<HashMap<String, Object>>();
    private List<byte[]> printerCommandList = new ArrayList<byte[]>();

    private static final String THAI = "CP874"; // "TIS_620"; //

    @Override
    public boolean connect(Activity context, Handler handler, String address, String connectionType) throws Exception {
        this.context = context;
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        BluetoothDevice device = mBluetoothAdapter.getRemoteDevice(address);

        if (device == null) {
            return false;
        }
        printerCore = new BluetoothPrinterCore(context, handler);
        if (printerCore == null) {
            return false;
        }

        printerCore.connect(device);
        return true;
    }

    @Override
    public boolean disconnect() throws Exception {
        if (printerCore != null) {
            printerCore.stop();
        }
        printerCore = null;
        return true;
    }

    @Override
    public boolean isConnected() throws Exception {
        if (printerCore.getState() == PrinterConst.STATE_CONNECTED) {
            return true;
        }

        return false;
    }

    @Override
    public boolean setPaperWidth(int width) throws Exception {
        this._paperWidth = 384;

        if (width == PrinterConst.PAPER_WIDTH_58MM) {
            this._characterSize = 25;
        } else if (width == PrinterConst.PAPER_WIDTH_80MM) {
            this._characterSize = 32;
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
        printerCommandList.add(PrinterCommand.POS_Set_Bold(bold ? 1 : 0));
        PrintingUtil.setTextBold(bold);

        return true;
    }

    @Override
    public void addImage(Bitmap image) throws Exception {
        addImage(image, PrinterConst.ALIGN_LEFT);
    }

    @Override
    public void addImage(Bitmap image, int align) throws Exception {
        addTextAlign(align);
        byte[] data = PrintPicture.POS_PrintBMP(image, _paperWidth, 0);
        printerCommandList.add(data);
    }

    @Override
    public void addBarcode(String text) throws Exception {
        addBarcode(text, PrinterConst.ALIGN_LEFT);
    }

    @Override
    public void addBarcode(String text, int align) throws Exception {
        addTextAlign(align);
        printerCommandList.add(PrinterCommand.POS_Print_Text("\r\n", THAI, 255, 0, 0, 0));
        byte[] bytes = PrinterCommand.getCodeBarCommand(text, 72, 3, 60, 1, 2);
        printerCommandList.add(bytes);
    }

    @Override
    public void addQRcode(String text) throws Exception {
        addQRcode(text, PrinterConst.ALIGN_LEFT);
    }

    @Override
    public void addQRcode(String text, int align) throws Exception {
        addTextAlign(align);
        printerCommandList.add(PrinterCommand.POS_Print_Text("\r\n", THAI, 255, 0, 0, 0));
        byte[] bytes = PrinterCommand.getBarCommand(text, 0, 3, 6);
        printerCommandList.add(bytes);

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
        hashMap.put("inline", inline);
        textList.add(hashMap);
    }

    public static byte[] POS_Print_Text(String pszString, String encoding, int codepage,
            int nWidthTimes, int nHeightTimes, int nFontType) {

        if (codepage < 0 || codepage > 255 || pszString == null || "".equals(pszString) || pszString.length() < 1) {
            return null;
        }

        byte[] pbString = null;
        try {
            pbString = pszString.getBytes(encoding);
        } catch (UnsupportedEncodingException e) {
            return null;
        }

        byte[] intToWidth = { 0x00, 0x10, 0x20, 0x30 };
        byte[] intToHeight = { 0x00, 0x01, 0x02, 0x03 };
        Command.GS_ExclamationMark[2] = (byte) (intToWidth[nWidthTimes] + intToHeight[nHeightTimes]);

        Command.ESC_t[2] = (byte) codepage;

        Command.ESC_M[2] = (byte) nFontType;

        if (codepage != 0) {
            byte[] data = Other.byteArraysToBytes(new byte[][] {
                    Command.GS_ExclamationMark, Command.ESC_t, Command.FS_and, Command.ESC_M, pbString });

            return data;
        } else {
            byte[] data = Other.byteArraysToBytes(new byte[][] {
                    Command.GS_ExclamationMark, Command.ESC_t, Command.FS_dot, Command.ESC_M, pbString });

            return data;
        }
    }

    @Override
    public void flushText() throws Exception {
        // graphic mode

        Bitmap line = null;

        for (HashMap<String, Object> hashMap : textList) {
            String text = hashMap.get("text").toString();
            Double position = (Double) hashMap.get("position");
            int align = (int) hashMap.get("align");
            boolean inline[] = (boolean[]) hashMap.get("inline");

            if (inline != null && inline.length > 0 && inline[0] == false) {
                line = formattingPrinterGraphicModeOutLine(this._paperWidth, text, position,
                        align);
            } else {
                line = formattingPrinterGraphicMode(this._paperWidth, line, text, position,
                        align);

            }
        }

        byte[] bytes = PrintPicture.POS_PrintBMP(line, this._paperWidth, 0);

        printerCommandList.add(bytes);

        textList.clear();

        // String line = "";

        // for (HashMap<String, Object> hashMap : textList) {
        // String text = hashMap.get("text").toString();
        // Double position = (Double) hashMap.get("position");
        // int align = (int) hashMap.get("align");

        // line = formattingPrinter(384, 30, line, text, position, align);

        // }

        // byte[] lineBytes = POS_Print_Text(line + "\n", THAI, 255, 0, 0, 0);
        // printerCommandList.add(lineBytes);

        // textList.clear();

    }

    @Override
    public void addFeedLine(int line) throws Exception {
        printerCommandList.add(PrinterCommand.POS_Set_PrtAndFeedPaper(35 * line));
        printerCommandList.add(Command.GS_V_m_n);
    }

    @Override
    public void addPageEnd() throws Exception {
        printerCommandList.add(PrinterCommand.POS_Set_PrtAndFeedPaper(90));
        printerCommandList.add(Command.GS_V_m_n);
    }

    @Override
    public void addCut() throws Exception {

    }

    @Override
    public void sendData() throws Exception {
        for (int i = 0; i < printerCommandList.size(); i++) {
            printerCore.write(printerCommandList.get(i));
        }

        printerCommandList.clear();
    }

    public void addTextAlign(int align) throws Exception {
        if (align == PrinterConst.ALIGN_CENTER) {
            Command.ESC_Align[2] = 0x01; // Align center
            printerCommandList.add(Command.ESC_Align);
        } else if (align == PrinterConst.ALIGN_LEFT) {
            Command.ESC_Align[2] = 0x00; // Align left
            printerCommandList.add(Command.ESC_Align);
        } else if (align == PrinterConst.ALIGN_RIGHT) {
            Command.ESC_Align[2] = 0x02; // Align right
            printerCommandList.add(Command.ESC_Align);
        }
    }
}
