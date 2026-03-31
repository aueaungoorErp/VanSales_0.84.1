package com.bplus.printing.library.printer;

import android.app.Activity;

import com.bplus.printing.library.constant.PrinterConst;
import com.bplus.printing.library.manager.IPrintingManager;
import com.bplus.printing.library.manager.impl.PrintingManager;

import org.json.JSONObject;

import java.util.Map;

public class PrinterManager {
    Activity context = null;
    private IPrintingManager _printingManager = null;
    private int _model;

    public PrinterManager(Activity context) {
        this.context = context;
        _printingManager = new PrintingManager(this.context);
    }

    public JSONObject getModelPrinters() throws Exception {
        return _printingManager.getModelPrinters();
    }

    public boolean connect(int model, String address, int drawerEnabled) throws Exception {
        this._model = model;
        return _printingManager.connect(model, address, PrinterConst.BLUETOOTH);
    }

    public boolean disconnect() throws Exception {
        return _printingManager.disconnect();
    }

    public boolean testPrinter(Map<String, Object> vanConfig) throws Exception {
        return _printingManager.testPrinter(vanConfig);
    }

    public boolean printReceipt(Map<String, Object> header,
            Object[] items,
            Map<String, Object> summary,
            Map<String, Object> vanConfig,
            Map<String, Object> companyInfo,
            Map<String, Object> customer,
            String printTime,
            String paymentType,
            int printTimes, 
            boolean isDiscountBath,
            Map<String, Object> cashpaymentMethods
            ) throws Exception {
        try {
            _printingManager.printReceipt(header, items, summary, vanConfig, companyInfo, customer, printTime,
                    paymentType, printTimes, isDiscountBath, cashpaymentMethods);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return true;
    }

    public void printReport(String title,
            String type,
            Map<String, Object> data,
            Object[] items,
            Map<String, Object> vanConfig,
            Map<String, Object> companyInfo,
            Map<String, Object> salesMan,
            String dateFrom,
            String dateTo,
            String printTime) {

        try {
            _printingManager.printReport(title, type, data, items, vanConfig, companyInfo, salesMan, dateFrom, dateTo,
                    printTime);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void printPaymentReceipt(Map<String, Object> header,
            Map<String, Object> createHeader,
            Object[] createItems,
            Map<String, Object> vanConfig,
            Map<String, Object> companyInfo,
            Map<String, Object> customerInfo,
            String printTime,
            String printType) {

        try {
            _printingManager.printPaymentReceipt(header, createHeader, createItems, vanConfig, companyInfo,
                    customerInfo, printTime, printType);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
