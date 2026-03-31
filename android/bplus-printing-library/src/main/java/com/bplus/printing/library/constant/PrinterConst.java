package com.bplus.printing.library.constant;

public class PrinterConst {
    // Constants that indicate the current connection state
    public static final int STATE_IDLE = 0;       // we're doing nothing
    public static final int STATE_LISTEN = 1;     // now listening for incoming connections
    public static final int STATE_CONNECTING = 2; // now initiating an outgoing connection
    public static final int STATE_CONNECTED = 3;  // now connected to a remote device
    public static final int STATE_DISCONNECTED = 4;  // now connected to a remote device
    public static final int STATE_CONNECT_FAILED = 5; // now connect failed
    public static final int STATE_CONNECT_LOST = 6;
    public static final int STATE_COVER_OPEN = 7; // cover open
    public static final int STATE_PAPER_EMPTY = 8;
    public static final int STATE_PAPER_JAM = 9;
    public static final int STATE_BATTERY_LOW = 10;
    public static final int STATE_FEATURE_NOT_SUPPORTED = 11;
    public static final int STATE_PRINT_SUCCESS = 12;

    public static final int ALIGN_LEFT = 0;
    public static final int ALIGN_CENTER = 1;
    public static final int ALIGN_RIGHT = 2;

    public static final String TCP = "TCP";
    public static final String BLUETOOTH = "BLUETOOTH";
    public static final String USB = "USB";

    public static final int ZIJIANG = 0;
    public static final int EPSON = 1;
    public static final int ZEBRA = 2;
    public static final int CODESOFT = 3;


    public static final int[] PRINTER_MODEL_ID_ARRAY = new int[] { ZIJIANG, EPSON };
    public static final String[] PRINTER_MODEL_NAME_ARRAY = new String[] { "ZIJIANG", "EPSON" };

    public static final int PAPER_WIDTH_58MM = 2; // 384
    public static final int PAPER_WIDTH_80MM = 3; // 576

    public static final int TEXT_MODE = 0;
    public static final int GRAPHIC_MODE = 1;

    public static final int COUNT_STRING_TYPE_1 = 1;
    public static final int COUNT_STRING_TYPE_2 = 2;

}
