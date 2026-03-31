package com.bplus.printing.library.core;

import android.bluetooth.BluetoothAdapter;
import android.content.Intent;

import com.bplus.bluetooth.finder.library.utils.BluetoothUtil;
import com.bplus.printing.library.printer.PrinterManager;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

import static com.bplus.bluetooth.finder.library.constant.BluetoothConstant.REQUEST_ENABLE_BT;
import static com.bplus.printer.library.utils.ArrayUtil.toArray;
import static com.bplus.printer.library.utils.MapUtil.toMap;
import static com.bplus.printer.library.utils.MapUtil.toWritableMap;

public class BplusPrintingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext mReactContext;
    private PrinterManager printingManager = null;

    public BplusPrintingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "BplusPrinting";
    }

    @ReactMethod
    public void getModelPrinters(Callback callback) {
        try {
            if (printingManager == null) {
                printingManager = new PrinterManager(getCurrentActivity());
            }

            callback.invoke(toWritableMap(toMap(printingManager.getModelPrinters())));
        } catch (Exception e) {
            callback.invoke(toWritableMap("error", e.getMessage()));
        }
    }

    @ReactMethod
    public void connect(int model, String address, int drawerEnabled) {
        if (printingManager == null) {
            printingManager = new PrinterManager(getCurrentActivity());
        }

        try {
            if (!BluetoothUtil.getBluetoothAdapterEnabled()) {
                Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                getCurrentActivity().startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
                return;
            }

            printingManager.connect(model, address, drawerEnabled);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @ReactMethod
    public void disConnect() {
        try {
            printingManager.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void testPrinter(ReadableMap vanConfigRequest) {
        try {
            printingManager.testPrinter(toMap(vanConfigRequest));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void printReceipt(ReadableMap headerRequest,
            ReadableArray itemsRequest,
            ReadableMap summaryRequest,
            ReadableMap vanConfigRequest,
            ReadableMap companyInfoRequest,
            ReadableMap customerRequest,
            String printTime,
            String paymentType,
            int printTimes,
            boolean isDiscountBath,
            ReadableMap cashpaymentMethodsRequest
            ) {

        Map<String, Object> header = toMap(headerRequest);
        Object[] items = toArray(itemsRequest);
        Map<String, Object> summary = toMap(summaryRequest);
        Map<String, Object> vanConfig = toMap(vanConfigRequest);
        Map<String, Object> companyInfo = toMap(companyInfoRequest);
        Map<String, Object> customer = toMap(customerRequest);
        Map<String, Object> cashpaymentMethods = toMap(cashpaymentMethodsRequest);


        try {
            printingManager.printReceipt(header, items, summary, vanConfig, companyInfo, customer, printTime,
                    paymentType, printTimes, isDiscountBath ,cashpaymentMethods);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void printReport(String title,
            String type,
            ReadableMap dataRequest,
            ReadableArray itemsRequest,
            ReadableMap vanConfigRequest,
            ReadableMap companyInfoRequest,
            ReadableMap salesManRequest,
            String dateFrom,
            String dateTo,
            String printTime) {

        try {
            Map<String, Object> data = toMap(dataRequest);
            Object[] items = toArray(itemsRequest);
            Map<String, Object> vanConfig = toMap(vanConfigRequest);
            Map<String, Object> companyInfo = toMap(companyInfoRequest);
            Map<String, Object> salesMan = toMap(salesManRequest);

            printingManager.printReport(title, type, data, items, vanConfig, companyInfo, salesMan, dateFrom, dateTo,
                    printTime);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @ReactMethod
    public void printPaymentReceipt(ReadableMap headerRequest,
            ReadableMap createHeaderRequest,
            ReadableArray createItemsRequest,
            ReadableMap vanConfigRequest,
            ReadableMap companyInfoRequest,
            ReadableMap customerInfoRequest,
            String printTime,
            String printType) {

        try {
            Map<String, Object> header = toMap(headerRequest);
            Map<String, Object> createHeader = toMap(createHeaderRequest);
            Object[] createItems = toArray(createItemsRequest);
            Map<String, Object> vanConfig = toMap(vanConfigRequest);
            Map<String, Object> companyInfo = toMap(companyInfoRequest);
            Map<String, Object> customerInfo = toMap(customerInfoRequest);

            printingManager.printPaymentReceipt(header, createHeader, createItems, vanConfig, companyInfo, customerInfo,
                    printTime, printType);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
