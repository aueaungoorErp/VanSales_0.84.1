package com.bplus.printing.library.manager;

import org.json.JSONObject;

import java.util.Map;

public interface IPrintingManager {
    JSONObject getModelPrinters() throws Exception;

    boolean connect(int model, String address, String connectionType) throws Exception;

    boolean disconnect() throws Exception;

    boolean isConnected() throws Exception;

    boolean setPaperWidth(int width) throws Exception;

    boolean setPrintMode(int mode) throws Exception;

    boolean testPrinter(Map<String, Object> vanConfig) throws Exception;

    boolean printReceipt(Map<String, Object> header, Object[] items, Map<String, Object> summary,
            Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> customer,
            String printTime, String paymentType, int printTimes, boolean isDiscountBath , Map<String, Object> cashpaymentMethods) throws Exception;

    boolean printReport(String title, String type, Map<String, Object> data, Object[] items,
            Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
            String dateFrom, String dateTo, String printTime) throws Exception;

    boolean printPaymentReceipt(Map<String, Object> header, Map<String, Object> createHeader, Object[] createItems,
            Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> customerInfo,
            String printTime, String printType) throws Exception;
}
