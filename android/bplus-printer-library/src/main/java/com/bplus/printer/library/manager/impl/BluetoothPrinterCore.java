package com.bplus.printer.library.manager.impl;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;


import com.bplus.printer.library.constant.MsgTypes;
import com.bplus.printer.library.constant.PrinterConst;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.UUID;

import static com.bplus.printer.library.utils.PrintingUtil.convertText;
import static com.bplus.printer.library.utils.PrintingUtil.thaiR;

/**
 * Created by hgode on 04.04.2014.
 */
public class BluetoothPrinterCore {
    private static final String TAG = "btPrintFile";
    private static final boolean D = true;

    private Context _context=null;
    private String _btMAC="";
    private String _sFile="";

    private final BluetoothAdapter mAdapter;
    private BluetoothDevice mDevice=null;

    private Handler mHandler=null;
    private int mState;

    private ConnectThread mConnectThread;
    private ConnectedThread mConnectedThread;

    private static final UUID UUID_SPP = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");



    public BluetoothPrinterCore(Context context, Handler handler)
    {
        _context = context;
        mHandler = handler;
        mState = PrinterConst.STATE_IDLE;
        mAdapter = BluetoothAdapter.getDefaultAdapter();
    }


    public BluetoothPrinterCore(String sBTmac, String sFileName)
    {
        _btMAC = sBTmac;
        _sFile = sFileName;
        mState = PrinterConst.STATE_IDLE;
        mAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    public synchronized void start() {
        log("start");
        addText("start()");

        if (mConnectThread != null) {mConnectThread.cancel(); mConnectThread = null;}
        if (mConnectedThread != null) {mConnectedThread.cancel(); mConnectedThread = null;}

        setState(PrinterConst.STATE_IDLE);
        addText("start done.");
    }

    /**
     * Stop all threads
     */
    public synchronized void stop() {
        log("stop");
        addText("stop()");

        if (mConnectThread != null) {mConnectThread.cancel(); mConnectThread = null;}
        if (mConnectedThread != null) {mConnectedThread.cancel(); mConnectedThread = null;}
        setState(PrinterConst.STATE_DISCONNECTED);
        addText("stop() done.");
    }

    /**
     * Return the current connection state. */
    public synchronized int getState() {
        return mState;
    }

    private synchronized void setState(int state) {
        if (D) Log.d(TAG, "setState() " + mState + " -> " + state);
        mState = state;

        addText(MsgTypes.STATE, state);
    }

    public String printESCP()
    {
        String message = "**   ใบตรวจสอบรายการ   **\r\n" +
                "**   บะหมี่กุ้งกรุ๊งกริ๊งเนื้อคั่วน้ำผึ้ง **\r\n" +
                "หมายเลขโต๊ะ" + convertText("golf", 6, 1) + "\r\n" +
                getDateTime() + convertText("20" + "/" + "่มะละคั่วซ้ำ", 16, 1)  + "\r\n" +
                "--------------------------------\r\n" +
                "ชื่อสินค้า         จำนวน    จำนวนเงิน\r\n" +
                "--------------------------------\r\n" +
                thaiR("ก๋วยเตี๋ยวไก่มะละคั่วซ้ำ", 14) + convertText("20", 6, 1) + convertText("400", 12, 1) + "\r\n" +
                "--------------------------------\r\n" +
                thaiR("บะหมี่กุ้งกรุ๊งกริ๊ง", 14) + convertText("20", 6, 1) + convertText("400", 12, 1) + "\r\n" +
                "--------------------------------\r\n";

        return message;
    }

    public String printCustom(String text)
    {
        String message = text + "\r\n" +
                text + "\r\n" +
                text + "\r\n";

        return message;
    }

    /**
     * Start the ConnectThread to initiate a connection to a remote device.
     * @param device  The BluetoothDevice to connect
     */
    public synchronized void connect(BluetoothDevice device) {
        Log.i("golf", "connect to:" + device);
        addText("connecting to " + device);
        mDevice = device;
        // Cancel any thread attempting to make a connection
        if (mState == PrinterConst.STATE_CONNECTING) {
            addText("already connected. Disconnecting first");
            if (mConnectThread != null) {mConnectThread.cancel(); mConnectThread = null;}
        }

        // Cancel any thread currently running a connection
        if (mConnectedThread != null) {mConnectedThread.cancel(); mConnectedThread = null;}

        // Start the thread to connect with the given device
        mConnectThread = new ConnectThread(device);
        mConnectThread.start();
        addText("new connect thread started");
        setState(PrinterConst.STATE_CONNECTING);
    }

    /**
     * This thread runs while attempting to make an outgoing connection
     * with a device. It runs straight through; the connection either
     * succeeds or fails.
     */
    private class ConnectThread extends Thread {
        private final BluetoothSocket mmSocket;
        private final BluetoothDevice mmDevice;

        public ConnectThread(BluetoothDevice device) {
            mmDevice = device;
            BluetoothSocket tmp = null;

            Log.i("golf", "ConnectThread");
            // Get a BluetoothSocket for a connection with the
            // given BluetoothDevice
            try {
                tmp = device.createInsecureRfcommSocketToServiceRecord(UUID_SPP);
                //tmp = device.createRfcommSocketToServiceRecord(UUID_SPP);
            } catch (IOException e) {
                Log.e(TAG, "create() failed", e);
            }
            mmSocket = tmp;
        }

        public void run() {
            Log.i(TAG, "BEGIN mConnectThread");
            setName("ConnectThread");

            // Always cancel discovery because it will slow down a connection
            mAdapter.cancelDiscovery();

            // Make a connection to the BluetoothSocket
            try {
                // This is a blocking call and will only return on a
                // successful connection or an exception
                mmSocket.connect();
            } catch (IOException e) {
                connectionFailed();
                // Close the socket
                try {
                    mmSocket.close();
                } catch (IOException e2) {
                    Log.e(TAG, "unable to close() socket during connection failure", e2);
                }
                // Start the service over to restart listening mode
                Log.i("errors", "ddd");
                BluetoothPrinterCore.this.start();
                return;
            }

            // Reset the ConnectThread because we're done
            synchronized (BluetoothPrinterCore.this) {
                mConnectThread = null;
            }

            // Start the connected thread
            connected(mmSocket, mmDevice);
        }

        public void cancel() {
            try {
                mmSocket.close();
            } catch (IOException e) {
                Log.e(TAG, "close() of connect socket failed", e);
            }
        }
    }

    /**
     * This thread runs during a connection with a remote device.
     * It handles all incoming and outgoing transmissions.
     */
    private class ConnectedThread extends Thread {
        private final BluetoothSocket mmSocket;
        private final InputStream mmInStream;
        private final OutputStream mmOutStream;

        public ConnectedThread(BluetoothSocket socket) {
            Log.d(TAG, "create ConnectedThread");
            mmSocket = socket;
            InputStream tmpIn = null;
            OutputStream tmpOut = null;

            // Get the BluetoothSocket input and output streams
            try {
                tmpIn = socket.getInputStream();
                tmpOut = socket.getOutputStream();
            } catch (IOException e) {
                Log.e(TAG, "temp sockets not created", e);
            }

            mmInStream = tmpIn;
            mmOutStream = tmpOut;
        }

        public void run() {
            Log.i(TAG, "BEGIN mConnectedThread");
            byte[] buffer = new byte[1024];
            int bytes;

            while (true) {
                try {
                    bytes = mmInStream.read(buffer);
                } catch (IOException e) {
                    Log.e(TAG, "disconnected", e);
                    connectionLost();
                    break;
                }
            }
        }

        /**
         * Write to the connected OutStream.
         * @param buffer  The bytes to write
         */
        public void write(byte[] buffer) {
            try {
                mmOutStream.write(buffer);
            } catch (IOException e) {
                Log.e(TAG, "Exception during write", e);
            }
        }

        public void cancel() {
            try {
                mmSocket.close();
            } catch (IOException e) {
                Log.e(TAG, "close() of connect socket failed", e);
            }
        }
    }
    /**
     * Start the ConnectedThread to begin managing a Bluetooth connection
     * @param socket  The BluetoothSocket on which the connection was made
     * @param device  The BluetoothDevice that has been connected
     */
    public synchronized void connected(BluetoothSocket socket, BluetoothDevice device) {
        Log.i("golf", "connected");
        if (D) Log.d(TAG, "connected");

        // Cancel the thread that completed the connection
        if (mConnectThread != null) {mConnectThread.cancel(); mConnectThread = null;}

        // Cancel any thread currently running a connection
        if (mConnectedThread != null) {mConnectedThread.cancel(); mConnectedThread = null;}

        // Start the thread to manage the connection and perform transmissions
        mConnectedThread = new ConnectedThread(socket);
        mConnectedThread.start();

        // Send the name of the connected device back to the UI Activity
        Message msg = mHandler.obtainMessage(MsgTypes.MESSAGE_DEVICE_NAME);
        Bundle bundle = new Bundle();
        bundle.putString(MsgTypes.DEVICE_NAME, device.getName());
        msg.setData(bundle);
        mHandler.sendMessage(msg);

        setState(PrinterConst.STATE_CONNECTED);

        Log.i("golf", "setState" + getState());
    }
    /**
     * Indicate that the connection was lost and notify the UI Activity.
     */
    private void connectionLost() {
        setState(PrinterConst.STATE_CONNECT_LOST);
    }

    /**
     * Write to the ConnectedThread in an unsynchronized manner
     * @param out The bytes to write
     * @see ConnectedThread#write(byte[])
     */
    public void write(byte[] out) {
        // Create temporary object
        ConnectedThread r;
        // Synchronize a copy of the ConnectedThread
        synchronized (this) {
            if (mState != PrinterConst.STATE_CONNECTED) return;
            r = mConnectedThread;
        }
        // Perform the write unsynchronized
        r.write(out);
    }
    /**
     * Indicate that the connection attempt failed and notify the UI Activity.
     */
    private void connectionFailed() {
        setState(PrinterConst.STATE_CONNECT_FAILED);
    }


    void log(String msg){
        if(D) Log.d(TAG, msg);
    }

    void addText(String s){
        Message msg = mHandler.obtainMessage(MsgTypes.MESSAGE_INFO);
        Bundle bundle = new Bundle();
        bundle.putString(MsgTypes.INFO , "INFO: " + s);
        msg.setData(bundle);
        mHandler.sendMessage(msg);
    }

    void addText(String msgType, int state){
        // Give the new state to the Handler so the UI Activity can update
        MsgTypes type;
        Message msg;
        Bundle bundle = new Bundle();
        if(msgType.equals(MsgTypes.STATE)){
            msg = mHandler.obtainMessage(MsgTypes.MESSAGE_STATE_CHANGE);// mHandler.obtainMessage(_Activity.MESSAGE_DEVICE_NAME);
        }
        else if(msgType.equals(MsgTypes.DEVICE_NAME)){
            msg = mHandler.obtainMessage(MsgTypes.MESSAGE_DEVICE_NAME);
        }
        else if(msgType.equals(MsgTypes.INFO)){
            msg = mHandler.obtainMessage(MsgTypes.MESSAGE_INFO);
        }
        else if(msgType.equals(MsgTypes.TOAST)){
            msg = mHandler.obtainMessage(MsgTypes.MESSAGE_TOAST);
        }
        else if(msgType.equals(MsgTypes.READ)){
            msg = mHandler.obtainMessage(MsgTypes.MESSAGE_READ);
        }
        else if(msgType.equals(MsgTypes.WRITE)){
            msg = mHandler.obtainMessage(MsgTypes.MESSAGE_WRITE);
        }
        else {
            msg = new Message();
        }

        bundle.putInt(msgType, state);
        msg.setData(bundle);
        msg.arg1 = state;
        mHandler.sendMessage(msg);
    }

    private String getDateTime(){
        Calendar c = Calendar.getInstance();
        SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        String date = df.format(c.getTime());

        return date;
    }
}
