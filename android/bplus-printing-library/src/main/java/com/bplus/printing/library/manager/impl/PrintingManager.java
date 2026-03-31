package com.bplus.printing.library.manager.impl;

import android.app.Activity;

import com.bplus.printer.library.manager.IPrinterCoreManager;
import com.bplus.printer.library.manager.impl.PrinterCoreManager;
import com.bplus.printing.library.manager.IPrintingManager;
import com.bplus.printing.library.pattern.PatternTextMode;

import org.json.JSONObject;

import java.util.Map;

public class PrintingManager implements IPrintingManager {
    Activity context = null;
    private IPrinterCoreManager _printerCoreManager = null;
    private int _model;
    private PatternTextMode _patternTextMode = null;

    public PrintingManager(Activity context) {
        this.context = context;
        _printerCoreManager = new PrinterCoreManager();
        _patternTextMode = new PatternTextMode(this.context, _printerCoreManager);
    }

    @Override
    public JSONObject getModelPrinters() throws Exception {
        return _printerCoreManager.getModelPrinters();
    }

    @Override
    public boolean connect(int model, String address, String connectionType) throws Exception {
        this._model = model;
        return _printerCoreManager.connect(this.context, model, address, connectionType);
    }

    @Override
    public boolean disconnect() throws Exception {
        return _printerCoreManager.disconnect();
    }

    @Override
    public boolean isConnected() throws Exception {
        return _printerCoreManager.isConnected();
    }

    @Override
    public boolean setPaperWidth(int width) throws Exception {
        return _printerCoreManager.setPaperWidth(width);
    }

    @Override
    public boolean setPrintMode(int mode) throws Exception {
        return _printerCoreManager.setPrintMode(mode);
    }

    @Override
    public boolean testPrinter(Map<String, Object> vanConfig) throws Exception {
        return _patternTextMode.testPrinter(vanConfig);
    }

    @Override
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
        return _patternTextMode.printReceipt(header, items, summary, vanConfig, companyInfo, customer, printTime,
                paymentType, printTimes, isDiscountBath , cashpaymentMethods );
    }

    @Override
    public boolean printReport(String title, String type, Map<String, Object> data, Object[] items,
            Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
            String dateFrom, String dateTo, String printTime) throws Exception {
        return _patternTextMode.printReport(this._model, title, type, data, items, vanConfig, companyInfo, salesMan,
                dateFrom, dateTo, printTime);
    }

    @Override
    public boolean printPaymentReceipt(Map<String, Object> header,
            Map<String, Object> createHeader,
            Object[] createItems,
            Map<String, Object> vanConfig,
            Map<String, Object> companyInfo,
            Map<String, Object> customerInfo,
            String printTime,
            String printType) throws Exception {
        return _patternTextMode.printPaymentReceipt(header, createHeader, createItems, vanConfig, companyInfo,
                customerInfo, printTime, printType);
    }

}
