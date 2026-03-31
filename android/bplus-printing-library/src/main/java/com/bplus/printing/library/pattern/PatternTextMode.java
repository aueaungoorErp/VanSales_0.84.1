package com.bplus.printing.library.pattern;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.bplus.printer.library.manager.IPrinterCoreManager;
import com.bplus.printing.library.constant.PrinterConst;

import java.lang.reflect.Array;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.List;

import static com.bplus.printer.library.utils.FormatUtil.decimal2digitWithCommas;
import static com.bplus.printer.library.utils.FormatUtil.withoutDecimal;

import static com.bplus.printer.library.utils.FormatUtil.decimalWithoutCommas;
import static com.bplus.printer.library.utils.FormatUtil.withoutDecimal;
import static com.bplus.printer.library.utils.PrintingUtil.convertReal;
import static com.bplus.printer.library.utils.PrintingUtil.convertStrDateToPatternDateThaiYear;

public class PatternTextMode {

        Activity _context = null;
        private IPrinterCoreManager _printerCoreManager = null;

        final String[] _id = { "438", "439", "440", "441", "442", "443", "444", "445", "446", "447" };

        final String[] _product = { "เครื่องเล่น DVD", "เครื่องซักผ้า", "เตาอบไมโครเวฟ", "เครื่องตัดหญ้า",
                        "เช่าเครื่องแมค",
                        "เช่าเครื่องแมค2",
                        "บะหมี่กุ้งกรุ๊งกริ๊ง", "เพื่อคั่วน้ำผึ้ง", "บะหมี่กุ้งกรุ๊งกริ๊งเพื่อคั่วน้ำผึ้ง",
                        "เช่าเครื่องแมค " };

        final String[] _price = { "14500", "12840", "14500.00", "12840.00", "9500.10", "12840", "7500.00",
                        "3500.00", "3500.00", "2500.50" };

        String _sum = "0";

        public PatternTextMode(Activity context, IPrinterCoreManager _printerCoreManager) {
                this._context = context;
                this._printerCoreManager = _printerCoreManager;
        }

        public boolean testPrinter(Map<String, Object> vanConfig) throws Exception {
                if (!_printerCoreManager.isConnected())
                        return false;
                System.out.println("s= " + vanConfig.get("VANCNF_FRM_WIDTH").getClass());
                Log.d("MyTagGoesHere", "This is my log message at the debug level here");
                _printerCoreManager.setPaperWidth(((Double) vanConfig.get("VANCNF_FRM_WIDTH")).intValue());
                // Bitmap logoData = BitmapFactory.decodeResource(_context.getResources(),
                // com.bplus.printer.library.R.drawable.b_plus);

                // _printerCoreManager.addImage(logoData, PrinterConst.ALIGN_CENTER);

                // _printerCoreManager.addFeedLine(1);

                _printerCoreManager.setBold(false);

                _printerCoreManager.addText(
                                "บริษัท ตัวอย่างโปรแกรม บิ-ซิเนส พลัส จำกัด สาขาสำนักงานใหญ่ ร้านกาแฟน้องบาริสต้า",
                                50, PrinterConst.ALIGN_CENTER, false);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("พนักงาน: ขายดี มีเงิน", 50, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("วันที่ 09/10/2019", 50, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เลขที่ผู้เสียภาษี 11111111111", 50, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เลขที่เอกสาร DS102342/0001", 50, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.flushText();

                _printerCoreManager.setBold(true);
                _printerCoreManager.addText("-----------------------------------------------", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("รหัส", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("ชื่อสินค้า", 20, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("ราคา", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("------------------------------------------------", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();
                _printerCoreManager.setBold(false);

                final String[] list = new String[_product.length];

                for (int i = 0; i < list.length; i++) {
                        _printerCoreManager.addText(_id[i], 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(_product[i], 20, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(_price[i])), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                        _sum = String.valueOf(Float.valueOf(_sum) + Float.valueOf(_price[i]));
                }

                _printerCoreManager.addText("------------------------------------------------", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ราคารวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble("9690.00")), 100,
                                PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เงินสด", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble("10000.00")), 100,
                                PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ทอน", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble("310.75")), 100,
                                PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("------------------------------------------------", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                // _printerCoreManager.addBarcode("01209457", PrinterConst.ALIGN_CENTER);

                // _printerCoreManager.addText("------------------------------------------------",
                // 1,
                // PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();

                // _printerCoreManager.addQRcode("http://www.bplus.com/",
                // PrinterConst.ALIGN_CENTER);

                // _printerCoreManager.addText("ขอบคุณที่ใช้บริการ", 50,
                // PrinterConst.ALIGN_CENTER);
                // _printerCoreManager.flushText();

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
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
                if (!_printerCoreManager.isConnected())
                        return false;

                System.out.println("header1= " + header);
                System.out.println("items2= " + items);
                System.out.println("summary3= " + summary);
                System.out.println("customer= " + customer);
                System.out.println("vanConfig= " + vanConfig);
                System.out.println("cashpaymentMethods== " + cashpaymentMethods);


                // System.out.println("s= " + vanConfig.get("VANCNF_FRM_WIDTH").intValue());
                // System.out.println("s= " + vanConfig.get("VANCNF_FRM_WIDTH").intValue());
                _printerCoreManager.setPaperWidth(((Double) vanConfig.get("VANCNF_FRM_WIDTH")).intValue());

                _printerCoreManager.setBold(false);

                String headerPayment = "";
                String printRepeat = "";

                Double vanConfigShowVat = (Double) vanConfig.get("VANCNF_INV_SHOWVAT");
                Double vanConfigShowVatCS = (Double) vanConfig.get("VANCNF_INV_SHOWVAT");
                // Double vanConfigShowVatCS = (Double)
                // vanConfig.get("VANCNF_CASHSALES_SHOWVAT");

                Double vanConfigRound = (Double) vanConfig.get("VANCNF_ROUND");
                Double vanConfigprintADDB = new Double(1);// first way

                int round = 1;

                if (paymentType.equals("credit")) {
                        headerPayment = vanConfig.get("VANCNF_INV_HEAD").toString();

                        if (printTimes == 1) {
                                printRepeat = vanConfig.get("VANCNF_REPRT_INV_MSG").toString();
                        }

                        if (((Double) vanConfig.get("VANCNF_INV_COPY")).intValue() == 2) {
                                round = 2;
                        }
                } else if (paymentType.equals("cash")) {
                        headerPayment = vanConfig.get("VANCNF_CASHSALES_HEAD").toString();

                        if (printTimes == 1) {
                                printRepeat = vanConfig.get("VANCNF_REPRT_CASHSALES_MSG").toString();
                        }

                } else if (paymentType.equals("reserv")) {
                        headerPayment = vanConfig.get("VANCNF_BOOK_HEAD").toString();
                } else if (paymentType.equals("return")) {
                        headerPayment = vanConfig.get("VANCNF_RTN_HEAD").toString();
                } else if (paymentType.equals("returnCash")) {
                        headerPayment = vanConfig.get("VANCNF_CASHRTN_HEAD").toString();
                } else if (paymentType.equals("transfer")) {
                        headerPayment = vanConfig.get("VANCNF_TRANSFER_HEAD").toString();
                } else if (paymentType.equals("quotation")) {
                        headerPayment = vanConfig.get("VANCNF_QUOTE_HEAD").toString();
                }
                // else if (paymentType.equals("quotation")) {
                // headerPayment = vanConfig.get("VANCNF_SKUCOUNT_HEAD").toString();
                // }

                switch (paymentType) {
                        case "credit":
                                vanConfigprintADDB = (Double) vanConfig.get("VANCNF_INV_ADDB");
                                break;
                        case "cash":
                                vanConfigprintADDB = (Double) vanConfig.get("VANCNF_CASHSALES_ADDB");
                                break;
                        // case '':
                        // vanConfigprintADDB = vanConfig.VANCNF_PREPRCPT_ADDB;
                        // break;
                        default:
                                vanConfigprintADDB = new Double(1);// first way
                                break;
                }

                for (int r = 1; r <= round; r++) {

                        String brachPrefix = "สาขา ";
                        String companyNameArr = (String) companyInfo.get("CMPNY_TCOMPANYNAME");
                        // .toString().split("สาขา", 2);

                        // if (companyNameArr.length <= 1) {
                        // companyNameArr =
                        // companyInfo.get("CMPNY_TCOMPANYNAME").toString().split("สำนักงานใหญ่", 2);

                        // if (companyNameArr.length == 2) {
                        // companyNameArr[1] = "สำนักงานใหญ่";
                        // }

                        // brachPrefix = "";
                        // }

                        // for (int k = 0; k < companyNameArr.length; k++) {
                        // String companyName = companyNameArr[k];
                        // if ((companyNameArr.length - 1) == k) {
                        // companyName = brachPrefix + companyName;
                        // }

                        _printerCoreManager.addText(companyNameArr, 50, PrinterConst.ALIGN_CENTER,
                                        false);
                        _printerCoreManager.flushText();

                        // }

                        if (!paymentType.equals("transfer")) {
                                if (vanConfigShowVatCS.intValue() == 1) {
                                        if (vanConfigprintADDB.intValue() == 1) {



                                            String CMPNY_TADDRESS_1 = " ";
                                            String CMPNY_TADDRESS_2 = " ";
                                            String CMPNY_TADDRESS_3 = " ";
                                            String CMPNY_TSUB_DISTRICT = " ";
                                            String CMPNY_TDISTRICT = " ";
                                            String CMPNY_TPROVINCE = " ";
                                            String CMPNY_POST = " ";

                                            String comtambol = "";
                                            String comamphur = "";
                                            String comjangwad = "";

                                            if (companyInfo.get("CMPNY_TPROVINCE") != null
                                                    && !companyInfo.get("CMPNY_TPROVINCE").equals("")) {
                                                CMPNY_TPROVINCE = "" + companyInfo.get("CMPNY_TPROVINCE").toString();

                                                if (companyInfo.get("CMPNY_TPROVINCE").equals("กรุงเทพมหานคร") || companyInfo.get("CMPNY_TPROVINCE").equals("กรุงเทพฯ")) {
                                                    CMPNY_TPROVINCE = "" + companyInfo.get("CMPNY_TPROVINCE").toString();
                                                } else {
                                                   CMPNY_TPROVINCE = " จังหวัด" + companyInfo.get("CMPNY_TPROVINCE").toString();
                                                }
                                            }

                                           




                                           

                                            if (companyInfo.get("CMPNY_TADDRESS_1") != null
                                                    && !companyInfo.get("CMPNY_TADDRESS_1").equals("")) {
                                                CMPNY_TADDRESS_1 = "" + companyInfo.get("CMPNY_TADDRESS_1").toString();
                                            };
                                            if (companyInfo.get("CMPNY_TADDRESS_2") != null
                                                    && !companyInfo.get("CMPNY_TADDRESS_2").equals("")) {
                                                CMPNY_TADDRESS_2 = " ซอย" + companyInfo.get("CMPNY_TADDRESS_2").toString();
                                            } else {
                                                CMPNY_TADDRESS_2 = "";
                                            };

                                            _printerCoreManager.addText(CMPNY_TADDRESS_1 + CMPNY_TADDRESS_2,
                                                    50,
                                                    PrinterConst.ALIGN_CENTER, false);
                                            _printerCoreManager.flushText();

                                            // if (companyInfo.get("CMPNY_TADDRESS_1") != null
                                            //                 && !companyInfo.get("CMPNY_TADDRESS_1").equals("")) {
                                            //         _printerCoreManager.addText(
                                            //                         companyInfo.get("CMPNY_TADDRESS_1").toString() + CMPNY_TADDRESS_2,
                                            //                         50,
                                            //                         PrinterConst.ALIGN_CENTER, false);
                                            //          _printerCoreManager.flushText();
                                            //     if (companyInfo.get("CMPNY_TADDRESS_2") != null
                                            //             && !companyInfo.get("CMPNY_TADDRESS_2").equals("")) {
                                            //         _printerCoreManager.addText("ซอย"
                                            //                 + companyInfo.get("CMPNY_TADDRESS_2").toString(),
                                            //                 50,
                                            //                 PrinterConst.ALIGN_CENTER, false);
                                            //         _printerCoreManager.flushText();
                                            //     }
                                            //}
                                            if (companyInfo.get("CMPNY_TADDRESS_3") != null
                                                    && !companyInfo.get("CMPNY_TADDRESS_3").equals("")) {
                                                CMPNY_TADDRESS_3 = " ถนน" + companyInfo.get("CMPNY_TADDRESS_3").toString();
                                            } else {
                                                CMPNY_TADDRESS_3 = "";
                                            };

                                            if (companyInfo.get("CMPNY_TSUB_DISTRICT") != null
                                                    && !companyInfo.get("CMPNY_TSUB_DISTRICT").equals("")) {

                                                if (companyInfo.get("CMPNY_TPROVINCE").equals("กรุงเทพมหานคร")  || companyInfo.get("CMPNY_TPROVINCE").equals("กรุงเทพฯ") ) {
                                                    CMPNY_TSUB_DISTRICT = " แขวง" + companyInfo.get("CMPNY_TSUB_DISTRICT").toString();
                                                } else {
                                                    CMPNY_TSUB_DISTRICT = " ตำบล" + companyInfo.get("CMPNY_TSUB_DISTRICT").toString();
                                                }


                                                
                                            };

                                            _printerCoreManager.addText(CMPNY_TADDRESS_3 + CMPNY_TSUB_DISTRICT,
                                                    50,
                                                    PrinterConst.ALIGN_CENTER, false);
                                            _printerCoreManager.flushText();

                                            if (companyInfo.get("CMPNY_TDISTRICT") != null
                                                    && !companyInfo.get("CMPNY_TDISTRICT").equals("")) {


                                                if (companyInfo.get("CMPNY_TPROVINCE").equals("กรุงเทพมหานคร")  || companyInfo.get("CMPNY_TPROVINCE").equals("กรุงเทพฯ")) {
                                                    CMPNY_TDISTRICT = " เขต" + companyInfo.get("CMPNY_TDISTRICT").toString();
                                                } else {
                                                    CMPNY_TDISTRICT = " อำเภอ" + companyInfo.get("CMPNY_TDISTRICT").toString();
                                                }
                                              //  CMPNY_TDISTRICT = " อำเภอ" + companyInfo.get("CMPNY_TDISTRICT").toString();
                                            }

                                           
                                            if (companyInfo.get("CMPNY_POST") != null
                                                    && !companyInfo.get("CMPNY_POST").equals("")) {
                                                CMPNY_POST = " " + companyInfo.get("CMPNY_POST").toString();
                                            };

                                            _printerCoreManager.addText(CMPNY_TDISTRICT ,
                                                    50,
                                                    PrinterConst.ALIGN_CENTER, false);
                                            _printerCoreManager.flushText();

                                             _printerCoreManager.addText( CMPNY_TPROVINCE + CMPNY_POST,
                                                    50,
                                                    PrinterConst.ALIGN_CENTER, false);
                                            _printerCoreManager.flushText();


                                                String CMPNY_REG_NO = companyInfo.get("CMPNY_REG_NO").toString();
                                                if (CMPNY_REG_NO != null || !CMPNY_REG_NO.trim().equals("")) {
                                                        _printerCoreManager.addText("เลขผู้เสียภาษี: " + CMPNY_REG_NO,
                                                                        50,
                                                                        PrinterConst.ALIGN_CENTER,
                                                                        false);
                                                        _printerCoreManager.flushText();
                                                }
                                        }

                                }
                        }

                        if (r == 1) {
                                String text = "";
                                if (!printRepeat.equals("")) {
                                        text = printRepeat;
                                } else {
                                        text = headerPayment;
                                }
                                if (text != null) {
                                        _printerCoreManager.addText(text, 50, PrinterConst.ALIGN_CENTER);
                                        _printerCoreManager.flushText();
                                }

                        } else if (r == 2) {
                                if (paymentType.equals("credit")) {
                                        String text = "";

                                        if (!printRepeat.equals("")) {
                                                text = vanConfig.get("VANCNF_REPRT_INV_MSG").toString();
                                        } else {
                                                text = vanConfig.get("VANCNF_REPRT_INV_MSG").toString();
                                        }

                                        _printerCoreManager.addText(text, 50, PrinterConst.ALIGN_CENTER);
                                        _printerCoreManager.flushText();
                                }
                        }

                        _printerCoreManager.addFeedLine(1);
                        System.out.println(paymentType.equals("transfer"));

                        if (!paymentType.equals("transfer")) {
                                _printerCoreManager.addText(customer.get("AR_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT, false);
                                _printerCoreManager.flushText();

                                String addbBranch = customer.get("ADDB_BRANCH") != null
                                                && !customer.get("ADDB_BRANCH").toString().equals("")
                                                                ? "สาขา " + customer.get("ADDB_BRANCH").toString()
                                                                : "";

                                if (!addbBranch.equals("")) {
                                        _printerCoreManager.addText(addbBranch, 1, PrinterConst.ALIGN_LEFT, false);
                                        _printerCoreManager.flushText();
                                }
                        } else {
                                Map<String, Object> FROM = (Map<String, Object>) customer.get("FROM");
                                Map<String, Object> TO = (Map<String, Object>) customer.get("TO");
                                System.out.println("จาก " + FROM.get("WL_NAME").toString());
                                System.out.println("ถึง " + TO.get("WL_NAME").toString());

                                String fromWL_NAME = "จาก " + FROM.get("WL_NAME").toString();
                                String toWL_NAME = "ถึง " + TO.get("WL_NAME").toString();
                                System.out.println(fromWL_NAME);
                                System.out.println(toWL_NAME);

                                _printerCoreManager.addText(fromWL_NAME, 1, PrinterConst.ALIGN_LEFT, false);
                                _printerCoreManager.flushText();
                                _printerCoreManager.addText(toWL_NAME, 1, PrinterConst.ALIGN_LEFT, false);
                                _printerCoreManager.flushText();
                        }
                        // !------------------------------------
                        if (!paymentType.equals("transfer")) {

                                
                                if (customer.get("ADDB_ADDB_1") != null &&
                                                !customer.get("ADDB_ADDB_1").toString().equals("")) {
                                        _printerCoreManager.addText(customer.get("ADDB_ADDB_1").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT,
                                                        false);
                                        _printerCoreManager.flushText();
                                }

                

                                if (customer.get("ADDB_ADDB_2") != null &&
                                                !customer.get("ADDB_ADDB_2").toString().equals("")) {
                                        _printerCoreManager.addText(customer.get("ADDB_ADDB_2").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT,
                                                        false);
                                        _printerCoreManager.flushText();
                                }

                                if (customer.get("ADDB_ADDB_3") != null &&
                                                !customer.get("ADDB_ADDB_3").toString().equals("")) {
                                        _printerCoreManager.addText(customer.get("ADDB_ADDB_3").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT,
                                                        false);
                                        _printerCoreManager.flushText();
                                }

                            String addressADDB4 = "";
                            String tambol = "";
                            String amphur = "";
                            String jangwad = "";

                            if (customer.get("ADDB_PROVINCE").equals("กรุงเทพมหานคร") || customer.get("ADDB_PROVINCE").equals("กรุงเทพฯ")) {
                                amphur = "เขต";
                                tambol = "แขวง";
                                jangwad = "";

                            } else {
                                amphur = "อำเภอ";
                                tambol = "ตำบล";
                                jangwad = "จังหวัด";

                            }


                                addressADDB4 = customer.get("ADDB_SUB_DISTRICT") != null
                                                && !customer.get("ADDB_SUB_DISTRICT").toString().equals("")
                                                                ? tambol + customer.get("ADDB_SUB_DISTRICT").toString()
                                                                : "";
                                addressADDB4 = customer.get("ADDB_DISTRICT") != null
                                                && !customer.get("ADDB_DISTRICT").toString().equals("")
                                                                ? addressADDB4 + " "
                                                                                + (amphur + customer.get("ADDB_DISTRICT")
                                                                                                .toString())
                                                                : addressADDB4;

                                if (!addressADDB4.equals("")) {
                                        _printerCoreManager.addText(addressADDB4, 1, PrinterConst.ALIGN_LEFT, false);
                                        _printerCoreManager.flushText();
                                }

                                addressADDB4 = "";

                                addressADDB4 = customer.get("ADDB_PROVINCE") != null
                                                && !customer.get("ADDB_PROVINCE").toString().equals("")
                                                                ? addressADDB4 + ""
                                                                                + (jangwad + customer.get("ADDB_PROVINCE")
                                                                                                .toString())
                                                                : addressADDB4;

                                addressADDB4 = customer.get("ADDB_POST") != null &&
                                                !customer.get("ADDB_POST").toString().equals("")
                                                                ? addressADDB4 + " "
                                                                                + customer.get("ADDB_POST").toString()
                                                                : addressADDB4;

                                if (!addressADDB4.equals("")) {
                                        _printerCoreManager.addText(addressADDB4, 1, PrinterConst.ALIGN_LEFT, false);
                                        _printerCoreManager.flushText();
                                }



                                String ADDB_TAX_ID = "";

                                ADDB_TAX_ID = customer.get("ADDB_TAX_ID") != null
                                                && !customer.get("ADDB_TAX_ID").toString().equals("")
                                                                ? customer.get("ADDB_TAX_ID").toString()
                                                                : "";

                                if (ADDB_TAX_ID != null && !ADDB_TAX_ID.trim().equals("")) {
                                        _printerCoreManager.addText("เลขผู้เสียภาษี: " + ADDB_TAX_ID, 1,
                                                        PrinterConst.ALIGN_LEFT, false);
                                        _printerCoreManager.flushText();
                                }

                              
                        }

                        _printerCoreManager.addText("________________________________________________",
                                        1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();
                        // Map<String, Object> HEADER = (Map<String, Object>) header.get("header");
                        // if (HEADER.get("VDI_DATE") != null
                        // && !(HEADER.get("VDI_DATE").toString()).trim().equals(""))
                    {
                        // String VDI_DATE = header.get("VDI_DATE").toString();
                        // String[] dateStr = VDI_DATE.split("T");
                        String[] dateStr = new String[2];
                        if (header.get("VDI_DATE") != null) {

                            System.out.println(header.get("VDI_DATE"));
                            System.out.println("1. " + header.get("VDI_DATE").toString().split("T"));

                            dateStr = header.get("VDI_DATE").toString().split("T");
                            System.out.println(dateStr[0].split(":"));

                            dateStr = dateStr[0].split(":");
                        }

                        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                        SimpleDateFormat dateFormat2 = new SimpleDateFormat("dd/MM/yyyy");

                        Calendar calender = Calendar.getInstance();
                        Date receiptdate = new Date();
                        if (dateStr != null) {
                            System.out.println(dateStr);
                            System.out.println(receiptdate);
                            System.out.println(dateStr[0]);

                            // receiptdate = dateFormat.parse(dateStr[0]);
                        }

                        calender.setTime(receiptdate);
                        // calender.add(Calendar.YEAR, 543);

                        String newDate = dateFormat2.format(calender.getTime());
                        String newDateArr[] = newDate.split("/");
                        String yearTxt = String.valueOf(Integer.parseInt(newDateArr[2]) + 543);
                        String finalDate = newDateArr[0] + "/" + newDateArr[1] + "/" + yearTxt;

                        _printerCoreManager.addText("วันที่ " + finalDate, 1,
                                PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText("เวลา " + printTime, 100,
                                PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        String ignoreVateShape = !paymentType.equals("transfer") ? "# ยกเว้น" : "";
                        Map<String, Object> xheader = (Map<String, Object>) header;
                        Map<String, Object> xheader2 = (Map<String, Object>) xheader.get("header");

                        String vdiUserRef = (String) xheader2.get("VDI_USER_REF");
                        //System.out.println("Bazz +" + vdiUserRef);

                        if (vdiUserRef != null && !vdiUserRef.trim().equals("")) {
                            _printerCoreManager.addText("เลขที่ "
                                    + vdiUserRef, 1, PrinterConst.ALIGN_LEFT);
                        }
                        if (!paymentType.equals("transfer")) {
                            _printerCoreManager.addText(ignoreVateShape, 100,
                                    PrinterConst.ALIGN_RIGHT);
                        }
                         _printerCoreManager.flushText();

                    }

                        _printerCoreManager.addText("________________________________________________",
                                        1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        String trailType = !paymentType.equals("transfer") ? "ยอดเงิน" : "จำนวน";

                        _printerCoreManager.addText("รายละเอียด", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(trailType, 100, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        for (int i = 0; i < items.length; i++) {
                                Map<String, Object> item = (Map<String, Object>) items[i];
                                boolean vtrdPrtFreeAuto = (boolean) item.get("VTRD_PRT_FREE_AUTO");

                                // if (!paymentType.equals("transfer")) {
                                // for (int i = 0; i < items.length; i++) {

                                // }
                                // }

                                if (!paymentType.equals("transfer")) {
                                        if (!vtrdPrtFreeAuto) {
                                                _printerCoreManager.addText(item.get("TRD_SH_NAME").toString() + " ("
                                                                + item.get("TRD_UTQNAME").toString() + ")", 1,
                                                                PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.flushText();

                                                System.out.println("DISC.gel ...");

                                                Double DISC = (Double) Double
                                                                .parseDouble(item.get("TRD_DSC_KEYIN").toString());

                                                System.out.println("DISC.gel ..." + DISC);

                                                String tmp_disc = "";

                                                tmp_disc = decimalWithoutCommas
                                                                .format(item.get("TRD_QTY"));
                                                ;
                                                System.out.println("DISC.gel ..." + DISC);

                                                _printerCoreManager.addText(
                                                                tmp_disc + "@"
                                                                                + decimal2digitWithCommas
                                                                                                .format(item.get(
                                                                                                                "TRD_U_PRC")),
                                                                68,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.addText(
                                                                decimal2digitWithCommas.format(Double.parseDouble(item
                                                                                .get("TRD_QTY")
                                                                                .toString()) *
                                                                                Double.parseDouble(item
                                                                                                .get("TRD_U_PRC")
                                                                                                .toString())),
                                                                99,
                                                                PrinterConst.ALIGN_RIGHT);

                                                _printerCoreManager.flushText();

                                                Double disc = (Double) Double
                                                                .parseDouble(item.get("TRD_DSC_KEYIN").toString())
                                                                * Double
                                                                                .parseDouble(item.get("TRD_QTY")
                                                                                                .toString());

                                                String disc_t = (Double.parseDouble(item
                                                                .get("TRD_DSC_KEYIN")
                                                                .toString()) > 0 ? "ลด" : "");

                                                System.out.println("disc_t ..." + disc_t);
                                                System.out.println("disc ..." + disc);

                                                if (disc_t != "") {

                                                        _printerCoreManager.addText(
                                                                        disc_t,
                                                                        28,
                                                                        PrinterConst.ALIGN_RIGHT);
                                                        _printerCoreManager.addText(
                                                                        decimal2digitWithCommas.format((disc)),
                                                                        68,
                                                                        PrinterConst.ALIGN_RIGHT);

                                                        _printerCoreManager.addText(
                                                                        decimal2digitWithCommas
                                                                                        .format(Double.parseDouble(item
                                                                                                        .get("TRD_G_AMT")
                                                                                                        .toString())),
                                                                        99,
                                                                        PrinterConst.ALIGN_RIGHT);

                                                        _printerCoreManager.flushText();
                                                }

                                        } else {
                                                _printerCoreManager.addText(item.get("TRD_SH_NAME").toString() + " ("
                                                                + item.get("TRD_UTQNAME").toString() + ")", 1,
                                                                PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.flushText();

                                                // _printerCoreManager.addText(item.get("TRD_UTQNAME").toString(), 1,
                                                // PrinterConst.ALIGN_LEFT);

                                                _printerCoreManager.addText(
                                                                decimalWithoutCommas.format(item.get("TRD_QTY")),
                                                                68,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.addText(
                                                                decimal2digitWithCommas.format(
                                                                                item.get("TRD_Q_FREE")),
                                                                99,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.flushText();
                                        }
                                        ;
                                        // Map<String, Object> item = (Map<String, Object>) items[i];
                                        // boolean vtrdPrtFreeAuto = (boolean) item.get("VTRD_PRT_FREE_AUTO");

                                        // if (vtrdPrtFreeAuto) {
                                        // _printerCoreManager.addText(item.get("TRD_SH_NAME").toString() + " ("
                                        // + item.get("TRD_UTQNAME").toString() + ")", 1,
                                        // PrinterConst.ALIGN_LEFT);
                                        // _printerCoreManager.flushText();

                                        // // _printerCoreManager.addText(item.get("TRD_UTQNAME").toString(), 1,
                                        // // PrinterConst.ALIGN_LEFT);

                                        // _printerCoreManager.addText(
                                        // decimalWithoutCommas.format(item.get("TRD_QTY")),
                                        // 68,
                                        // PrinterConst.ALIGN_RIGHT);
                                        // _printerCoreManager.addText(
                                        // decimal2digitWithCommas.format(
                                        // item.get("TRD_Q_FREE")),
                                        // 99,
                                        // PrinterConst.ALIGN_RIGHT);
                                        // _printerCoreManager.flushText();
                                        // }
                                } else {
                                        _printerCoreManager.addText(item.get("TRD_SH_NAME").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();

                                        _printerCoreManager.addText(item.get("TRD_UTQNAME").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(decimalWithoutCommas.format(item.get("TRD_QTY")),
                                                        99,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();
                                }
                        }

                        _printerCoreManager.addText("________________________________________________",
                                        1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        if (!paymentType.equals("transfer")) {
                                Double VDI_DISC_1 = null;
                                Double VDI_DISC_2 = null;
                                Double VDI_DISC_KEYINV = null;

                                Double G_KEYIN = null;
                                Map<String, Object> AROE = (Map<String, Object>) summary.get("AROE");
                                Map<String, Object> ARDETAIL = (Map<String, Object>) summary.get("ARDETAIL");
                                Map<String, Object> OrderProdSum = (Map<String, Object>) header
                                                .get("orderProductSummary");
                                if (isDiscountBath) {

                                        Double disBill1 = (Double) Double
                                                        .parseDouble("0");
                                        if (OrderProdSum.get("DIS_BILL_1") != null
                                                        && !OrderProdSum.get("DIS_BILL_1").toString().isEmpty()) {
                                                disBill1 = (Double) Double
                                                                .parseDouble(OrderProdSum.get("DIS_BILL_1").toString());
                                        }
                                        ;
                                        // VDI_DISC_1 = disBill1;
                                        // VDI_DISC_KEYINV = disBill1;
                                        // // G_KEYIN = (Double) Double.parseDouble(AROE.get("ARD_B_AMT").toString());
                                        // G_KEYIN = (Double) Double.parseDouble(AROE.get("ARD_G_KEYIN").toString());

                                        if ((summary.get("AROE") != null) && (summary.get("ARDETAIL") == null)) {
                                                if (disBill1 != 0) {
                                                        VDI_DISC_1 = disBill1;
                                                        VDI_DISC_KEYINV = disBill1;
                                                        G_KEYIN = (Double) Double.parseDouble(
                                                                        AROE.get("AROE_G_KEYIN").toString());
                                                }

                                        } else if ((summary.get("ARDETAIL") != null) && (summary.get("AROE") != null)) {
                                                if (disBill1 != 0) {
                                                        VDI_DISC_1 = disBill1;
                                                        VDI_DISC_KEYINV = disBill1;
                                                        G_KEYIN = (Double) Double.parseDouble(
                                                                        ARDETAIL.get("ARD_G_KEYIN").toString());
                                                }

                                        }

                                } else {
                                        Double disBill1 = (Double) Double
                                                        .parseDouble("0");

                                        System.out.println("OrderProdSum.gel ...");
                                        System.out.println("OrderProdSum.get ..."
                                                        + OrderProdSum.get("DIS_BILL_1").toString().isEmpty());

                                        if (OrderProdSum.get("DIS_BILL_1") != null
                                                        && !OrderProdSum.get("DIS_BILL_1").toString().isEmpty()) {
                                                disBill1 = (Double) Double
                                                                .parseDouble(OrderProdSum.get("DIS_BILL_1").toString());
                                        }
                                        Double disBill2 = (Double) Double
                                                        .parseDouble("0");
                                        ;
                                        if (OrderProdSum.get("DIS_BILL_2") != null
                                                        && !OrderProdSum.get("DIS_BILL_2").toString().isEmpty()) {
                                                disBill2 = (Double) Double
                                                                .parseDouble(OrderProdSum.get("DIS_BILL_2").toString());
                                        } else {
                                                disBill2 = (Double) Double
                                                                .parseDouble("0");
                                        }

                                        if ((summary.get("AROE") != null) && (summary.get("ARDETAIL") == null)) {
                                                if (disBill1 != 0) {
                                                        VDI_DISC_1 = disBill1;
                                                        VDI_DISC_KEYINV = disBill1;
                                                        G_KEYIN = (Double) Double.parseDouble(
                                                                        AROE.get("AROE_G_KEYIN").toString());
                                                }
                                                if (disBill2 != 0) {
                                                        VDI_DISC_2 = disBill2;

                                                        G_KEYIN = (Double) Double.parseDouble(
                                                                        AROE.get("AROE_G_KEYIN").toString());
                                                }
                                        } else if ((summary.get("ARDETAIL") != null) && (summary.get("AROE") != null)) {
                                                if (disBill1 != 0) {
                                                        VDI_DISC_1 = disBill1;
                                                        VDI_DISC_KEYINV = disBill1;
                                                        G_KEYIN = (Double) Double.parseDouble(
                                                                        ARDETAIL.get("ARD_G_KEYIN").toString());
                                                }
                                                if (disBill2 != 0) {
                                                        VDI_DISC_2 = disBill2;

                                                        G_KEYIN = (Double) Double.parseDouble(
                                                                        ARDETAIL.get("ARD_G_KEYIN").toString());
                                                }
                                        }

                                        // if (summary.get("AROE") != null) {
                                        // AROE = (Map<String, Object>) summary.get("AROE");
                                        // arrDISC = AROE.get("AROE_TDSC_KEYIN") != null
                                        // ? (AROE.get("AROE_TDSC_KEYIN")).toString().split(",")
                                        // : (AROE.get("ARD_TDSC_KEYIN")).toString().split(",");
                                        // VDI_DISC_1 = (Double) Double.parseDouble(arrDISC[0]);
                                        // VDI_DISC_2 = (Double) Double.parseDouble(arrDISC[1]);
                                        // VDI_DISC_KEYINV = AROE.get("AROE_TDSC_KEYINV") != null
                                        // ? (Double) Double.parseDouble(
                                        // AROE.get("AROE_TDSC_KEYINV").toString())
                                        // : (Double) Double.parseDouble(
                                        // AROE.get("ARD_TDSC_KEYINV").toString());
                                        // G_KEYIN = AROE.get("AROE_G_KEYIN") != null
                                        // ? (Double) Double.parseDouble(
                                        // AROE.get("AROE_G_KEYIN").toString())
                                        // : (Double) Double.parseDouble(
                                        // AROE.get("ARD_G_KEYIN").toString());
                                        // } else if (summary.get("ARDETAIL") != null) {
                                        // ARDETAIL = (Map<String, Object>) summary.get("ARDETAIL");
                                        // arrDISC = AROE.get("ARD_TDSC_KEYIN") != null
                                        // ? (AROE.get("ARD_TDSC_KEYIN")).toString().split(",")
                                        // : (AROE.get("AROE_TDSC_KEYIN")).toString().split(",");
                                        // VDI_DISC_1 = (Double) Double.parseDouble(arrDISC[0]);
                                        // VDI_DISC_2 = (Double) Double.parseDouble(arrDISC[1]);
                                        // VDI_DISC_KEYINV = (Double) Double
                                        // .parseDouble(ARDETAIL.get("ARD_TDSC_KEYINV").toString());
                                        // G_KEYIN = (Double)
                                        // Double.parseDouble(ARDETAIL.get("ARD_G_KEYIN").toString());

                                        // }
                                }
                                if (VDI_DISC_1 != null && !VDI_DISC_1.toString().equals("")
                                                && !VDI_DISC_1.toString().equals("0.0") ||
                                                (VDI_DISC_2 != null && !VDI_DISC_2.toString().equals("")
                                                                && !VDI_DISC_2.toString().equals("0.0"))) {

                                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(
                                                        decimal2digitWithCommas.format(G_KEYIN),
                                                        96,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();
                                }

                                // if (VDI_DISC_1 != null && isDiscountBath) {
                                // _printerCoreManager.addText(
                                // "ลด " + decimal2digitWithCommas.format(VDI_DISC_1) + "บาท", 1,
                                // PrinterConst.ALIGN_LEFT);
                                // _printerCoreManager.addText(decimal2digitWithCommas.format(VDI_DISC_KEYINV),
                                // 96,
                                // PrinterConst.ALIGN_RIGHT);
                                // _printerCoreManager.flushText();
                                // }

                                if (VDI_DISC_1 != null && !VDI_DISC_1.toString().equals("")
                                                && !VDI_DISC_1.toString().equals("0.0")) {
                                        if (isDiscountBath) {

                                                _printerCoreManager.addText(
                                                                "ลด " + decimal2digitWithCommas.format(VDI_DISC_1)
                                                                                + "บาท",
                                                                1,
                                                                PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.addText(
                                                                decimal2digitWithCommas.format(VDI_DISC_KEYINV),
                                                                96,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.flushText();
                                        } else {

                                                Double dis1AfterDis = (Double) OrderProdSum
                                                                .get("DIS_BILL_1_AFTER_DISCOUNT");

                                                _printerCoreManager.addText("ลด " +
                                                                decimal2digitWithCommas.format(VDI_DISC_1) + "%",
                                                                1, PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.addText(
                                                                decimal2digitWithCommas.format(dis1AfterDis),
                                                                96,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.flushText();
                                        }

                                }

                                if (VDI_DISC_2 != null && !VDI_DISC_2.toString().equals("")
                                                && !VDI_DISC_2.toString().equals("0.0")) {
                                        if (isDiscountBath) {
                                        } else {
                                                Double dis2AfterDis = (Double) OrderProdSum
                                                                .get("DIS_BILL_2_AFTER_DISCOUNT");
                                                if (dis2AfterDis != 0.0) {
                                                        _printerCoreManager.addText("ลด " +
                                                                        decimal2digitWithCommas.format(VDI_DISC_2)
                                                                        + "%",
                                                                        1, PrinterConst.ALIGN_LEFT);
                                                        _printerCoreManager.addText(
                                                                        decimal2digitWithCommas.format(dis2AfterDis),
                                                                        96,
                                                                        PrinterConst.ALIGN_RIGHT);
                                                        _printerCoreManager.flushText();
                                                }

                                        }

                                }

                                if ((VDI_DISC_1 != null && !VDI_DISC_1.toString().equals("")
                                                && !VDI_DISC_1.toString().equals("0.0")) ||
                                                (VDI_DISC_2 != null && !VDI_DISC_2.toString().equals("")
                                                                && !VDI_DISC_2.toString().equals("0.0"))) {
                                        _printerCoreManager.addText("_____________", 100, PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();
                                }
                        }
                        // !-===========-=--=-=--=--==ถึงตรงนี้
                        if (!paymentType.equals("transfer")) {

                                Double B_AMT = null;
                                Double afDiscVat = null;
                                Double afDisc_Exp = null;
                                Double afDiscExpVat = null;
                                Double afDiscNVat = null;

                                Map<String, Object> AROE = null;
                                Map<String, Object> ARDETAIL = null;

                                if (summary.get("AROE") != null) {
                                        AROE = (Map<String, Object>) summary.get("AROE");
                                        B_AMT = AROE.get("AROE_B_AMT") != null
                                                        ? (Double) Double.parseDouble(AROE.get("AROE_B_AMT").toString())
                                                        : (Double) Double.parseDouble(AROE.get("ARD_B_AMT").toString());
                                        afDiscVat = AROE.get("AROE_B_SV") != null
                                                        ? (Double) Double.parseDouble(AROE.get("AROE_B_SV").toString())
                                                        : (Double) Double.parseDouble(AROE.get("ARD_B_SV").toString());
                                        afDisc_Exp = AROE.get("AROE_B_SNV") != null
                                                        ? (Double) Double.parseDouble(AROE.get("AROE_B_SNV").toString())
                                                        : (Double) Double.parseDouble(AROE.get("ARD_B_SNV").toString());

                                        afDiscExpVat = AROE.get("AROE_A_VAT") != null
                                                        ? (Double) Double.parseDouble(AROE.get("AROE_A_VAT").toString())
                                                        : (Double) Double.parseDouble(AROE.get("ARD_A_VAT").toString());
                                        afDiscNVat = AROE.get("AROE_N_AMT") != null
                                                        ? (Double) Double.parseDouble(AROE.get("AROE_N_AMT").toString())
                                                        : (Double) Double.parseDouble(AROE.get("ARD_N_AMT").toString());

                                } else if (summary.get("ARDETAIL") != null) {
                                        ARDETAIL = (Map<String, Object>) summary.get("ARDETAIL");

                                        B_AMT = ARDETAIL.get("ARD_B_AMT") != null
                                                        ? (Double) Double.parseDouble(
                                                                        ARDETAIL.get("ARD_B_AMT").toString())
                                                        : (Double) Double.parseDouble(
                                                                        ARDETAIL.get("AROE_B_AMT").toString());
                                        afDiscVat = ARDETAIL.get("ARD_B_SV") != null
                                                        ? (Double) Double.parseDouble(
                                                                        ARDETAIL.get("ARD_B_SV").toString())
                                                        : (Double) Double.parseDouble(
                                                                        ARDETAIL.get("AROE_B_SV").toString());
                                        afDisc_Exp = ARDETAIL.get("ARD_B_SNV") != null
                                                        ? (Double) Double.parseDouble(
                                                                        ARDETAIL.get("ARD_B_SNV").toString())
                                                        : (Double) Double.parseDouble(
                                                                        ARDETAIL.get("AROE_B_SNV").toString());
                                        afDiscExpVat = ARDETAIL.get("ARD_A_VAT") != null
                                                        ? (Double) Double.parseDouble(
                                                                        ARDETAIL.get("ARD_A_VAT").toString())
                                                        : (Double) Double.parseDouble(
                                                                        ARDETAIL.get("AROE_A_VAT").toString());
                                        afDiscNVat = ARDETAIL.get("ARD_N_AMT") != null
                                                        ? (Double) Double.parseDouble(
                                                                        ARDETAIL.get("ARD_N_AMT").toString())
                                                        : (Double) Double.parseDouble(
                                                                        ARDETAIL.get("AROE_N_AMT").toString());

                                }

                                // if (paymentType.equals("quotation")) {
                                //         // AROE = (Map<String, Object>) summary.get("AROE");
                                //         System.out.println("header1= " + header);
                                //         System.out.println("items2= " + items);
                                //         System.out.println("summary3= " + summary);

                                //         Map<String, Object> OrderProdSum = (Map<String, Object>) header
                                //                         .get("orderProductSummary");

                                //         System.out.println("OrderProdSum= " + OrderProdSum);
                                //         System.out.println("OrderProdSum2= " + (Double) Double.parseDouble(
                                //                         OrderProdSum.get("totalPrice").toString()));

                                //         B_AMT = OrderProdSum.get("totalPrice") != null
                                //                         ? (Double) Double.parseDouble(
                                //                                         OrderProdSum.get("totalPrice").toString())
                                //                         : 0;
                                //         afDiscVat = OrderProdSum.get("netPrice") != null
                                //                         ? (Double) Double.parseDouble(
                                //                                         OrderProdSum.get("netPrice").toString())
                                //                         : 0;
                                //         afDiscExpVat = (B_AMT - afDiscVat);

                                // }
 
                                _printerCoreManager.addText("รวมทั้งหมด", 1, PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(
                                                (B_AMT != null ? decimal2digitWithCommas.format(B_AMT) : "-"), 96,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();

                                System.out.println("vanConfigShowVatCS= " + vanConfigShowVatCS);
                                System.out.println("vanConfigShowVatCS intValue= " + vanConfigShowVatCS.intValue());

                                if (vanConfigShowVatCS.intValue() == 1) {

                                        if (Double.compare(0.00, (afDiscVat != null ? afDiscVat : 0)) < 0) {
                                                _printerCoreManager.addText("ยอดสินค้า", 1, PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.addText(decimal2digitWithCommas.format(afDiscVat),
                                                                96,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.flushText();
                                        }
                                        if (Double.compare(0.00, (afDisc_Exp != null ? afDisc_Exp : 0)) < 0) {
                                                _printerCoreManager.addText("สินค้ายกเว้น", 1, PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.addText(decimal2digitWithCommas.format(afDisc_Exp),
                                                                96,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.flushText();
                                        }

                                        if (Double.compare(0.00, (afDiscExpVat != null ? afDiscExpVat : 0)) < 0) {
                                                _printerCoreManager.addText("ยอด ภพ.", 1, PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.addText(
                                                                decimal2digitWithCommas.format(afDiscExpVat), 96,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.flushText();
                                        }
                                }

                   

                            Map<String, Object> cashpaymentMethod = (Map<String, Object>) cashpaymentMethods;
                            if (cashpaymentMethod != null && !cashpaymentMethod.isEmpty()) {
                                
                                System.out.println("paymentMethods====1 cashpaymentMethod==== " + cashpaymentMethod);

                                Double cashAmount = null;
                                Double bankAmount = null;
                                Double qrctAmount = null;
                                Double cheque1Amount = null;
                                Double othAmount = null;

                                cashAmount = Double.valueOf((String) cashpaymentMethod.get("CASHAC_AMT"));
                                bankAmount = Double.valueOf((String) cashpaymentMethod.get("BNKAC_AMT"));
                                qrctAmount = Double.valueOf((String) cashpaymentMethod.get("QRCT_AMT"));
                                cheque1Amount = Double.valueOf((String) cashpaymentMethod.get("CQIN_1_AMT"));
                                othAmount = Double.valueOf((String) cashpaymentMethod.get("PMT_1_AMT"));

                                if (cashAmount > 0) {
                                    _printerCoreManager.addText("รับชำระ (เงินสด)", 1, PrinterConst.ALIGN_LEFT);
                                    _printerCoreManager.addText(
                                            decimal2digitWithCommas.format(cashAmount), 96,
                                            PrinterConst.ALIGN_RIGHT);
                                    _printerCoreManager.flushText();
                                }
                                if (bankAmount > 0) {
                                    _printerCoreManager.addText("รับชำระ (โอน)", 1, PrinterConst.ALIGN_LEFT);
                                    _printerCoreManager.addText(
                                            decimal2digitWithCommas.format(bankAmount), 96,
                                            PrinterConst.ALIGN_RIGHT);
                                    _printerCoreManager.flushText();
                                }
                                if (qrctAmount > 0) {
                                    _printerCoreManager.addText("รับชำระ (QrCode)", 1, PrinterConst.ALIGN_LEFT);
                                    _printerCoreManager.addText(
                                            decimal2digitWithCommas.format(qrctAmount), 96,
                                            PrinterConst.ALIGN_RIGHT);
                                    _printerCoreManager.flushText();
                                }
                                if (cheque1Amount > 0) {
                                    _printerCoreManager.addText("รับชำระ (เช็ค)", 1, PrinterConst.ALIGN_LEFT);
                                    _printerCoreManager.addText(
                                            decimal2digitWithCommas.format(cheque1Amount), 96,
                                            PrinterConst.ALIGN_RIGHT);
                                    _printerCoreManager.flushText();
                                }
                                if (othAmount > 0) {
                                    _printerCoreManager.addText("รับชำระ (อื่นๆ)", 1, PrinterConst.ALIGN_LEFT);
                                    _printerCoreManager.addText(
                                            decimal2digitWithCommas.format(othAmount), 96,
                                            PrinterConst.ALIGN_RIGHT);
                                    _printerCoreManager.flushText();
                                }

                            }


                                Double afRound = (Double) header.get("VDI_AF_ROUND");
                                Double netPrice = (Double) summary.get("netPrice");

                                Double amount = 0.0;
                                Double piece = 0.0;
                                Map<String, Object> DOCINFO = (Map<String, Object>) summary.get("DOCINFO");

                                for (int i = 0; i < items.length; i++) {
                                        Map<String, Object> item = (Map<String, Object>) items[i];
                                        amount += (Double) Double.parseDouble(item.get("TRD_QTY").toString());

                                        // piece += (Double) Double.parseDouble("1");
                                }

                                if (paymentType.equals("quotation")) {

                                        Map<String, Object> OrderProdSum = (Map<String, Object>) header
                                                        .get("orderProductSummary");

                                        piece = (Double) OrderProdSum.get("totalItems");
                                } else {
                                        piece = (Double) Double.parseDouble(DOCINFO.get("DI_ITEMS").toString());
                                }
                                _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);

                                _printerCoreManager.addText(String.format("%.0f", piece),
                                                28, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText("รายการ", 34, PrinterConst.ALIGN_LEFT);

                                _printerCoreManager.addText("จำนวน", 56, PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(String.format("%.0f", amount), 88,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText("ชิ้น", 100, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();

                        }
                        if (paymentType.equals("reserv")) {
                                Map<String, Object> headerProcessed = (Map<String, Object>) header
                                                .get("header");
                                String[] vdiShipDateStrArr = headerProcessed.get("VDI_SHIP_DATE").toString().split(":");

                                System.out.println("vdiShipDateStrArr= " + vdiShipDateStrArr);

                                String vdiDate = convertStrDateToPatternDateThaiYear(vdiShipDateStrArr[0],
                                                "yyyyMMddHHmm", "dd/MM/yyyy");

                                _printerCoreManager.addText("วันที่ส่งของ", 1, PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(vdiDate, 100, PrinterConst.ALIGN_RIGHT);

                                _printerCoreManager.flushText();

                                _printerCoreManager.addText(vanConfig.get("VANCNF_BOOK_TRAIL").toString(), 1,
                                                PrinterConst.ALIGN_LEFT,
                                                false);

                                _printerCoreManager.flushText();

                                _printerCoreManager.addText(vanConfig.get("VANCNF_BOOK_ISSBY").toString(), 1,
                                                PrinterConst.ALIGN_LEFT,
                                                false);

                                _printerCoreManager.flushText();
                        }

                        if (paymentType.equals("quotation")) {
                                // String[] vdiShipDateStrArr =
                                // header.get("VDI_SHIP_DATE").toString().split("T");
                                // String vdiDate = convertStrDateToPatternDateThaiYear(vdiShipDateStrArr[0],
                                // "yyyy-MM-dd", "dd/MM/yyyy");

                                if (vanConfig.get("VANCNF_SKUCOUNT_TRAIL").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_QUOTE_TRAIL").toString(),
                                                        1,
                                                        PrinterConst.ALIGN_LEFT, false);
                                        _printerCoreManager.flushText();
                                }
                                if (vanConfig.get("VANCNF_SKUCOUNT_ISSBY").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_QUOTE_ISSBY").toString(),
                                                        1,
                                                        PrinterConst.ALIGN_LEFT, false);
                                        _printerCoreManager.flushText();
                                }
                        }

                        if (paymentType.equals("cash")) {
                                if (vanConfig.get("VANCNF_CASHSALES_TRAIL").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_CASHSALES_TRAIL").toString(),
                                                        1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();
                                }
                                if (vanConfig.get("VANCNF_CASHSALES_ISSBY").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_CASHSALES_ISSBY").toString(),
                                                        1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();
                                }
                        }

                        if (paymentType.equals("credit")) {
                                // if (vanConfig.get("VANCNF_INV_TRAIL").toString() != null) {
                                // _printerCoreManager.addText(vanConfig.get("VANCNF_INV_TRAIL").toString(),
                                // 1,
                                // PrinterConst.ALIGN_LEFT);
                                // _printerCoreManager.flushText();
                                // }

                                if (paymentType.equals("credit")) {
                                        if (vanConfig.get("VANCNF_INV_TRAIL").toString() != null) {
                                                _printerCoreManager.addText(
                                                                vanConfig.get("VANCNF_INV_TRAIL").toString(), 1,
                                                                PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.flushText();
                                        }

                                        if (vanConfig.get("VANCNF_INV_ISSBY").toString() != null) {
                                                _printerCoreManager.addText(
                                                                vanConfig.get("VANCNF_INV_ISSBY").toString(), 1,
                                                                PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.flushText();
                                        }
                                }
                        }

                        if (paymentType.equals("return")) {
                                if (vanConfig.get("VANCNF_RTN_TRAIL").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_RTN_TRAIL").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();
                                }
                                if (vanConfig.get("VANCNF_RTN_ISSBY").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_RTN_ISSBY").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();
                                }
                        }

                        if (paymentType.equals("returnCash")) {
                                if (vanConfig.get("VANCNF_CASHRTN_TRAIL").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_CASHRTN_TRAIL").toString(),
                                                        1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();
                                }
                                if (vanConfig.get("VANCNF_CASHRTN_ISSBY").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_CASHRTN_ISSBY").toString(),
                                                        1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();
                                }
                        }

                        if (paymentType.equals("transfer")) {
                                if (vanConfig.get("VANCNF_TRANSFER_TRAIL").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_TRANSFER_TRAIL").toString(),
                                                        1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();
                                }
                                if (vanConfig.get("VANCNF_TRANSFER_ISSBY").toString() != null) {
                                        _printerCoreManager.addText(vanConfig.get("VANCNF_TRANSFER_ISSBY").toString(),
                                                        1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();
                                }
                        }

                        _printerCoreManager.addFeedLine(1);

                        _printerCoreManager.addText("ลงชื่อ______________________________________________",
                                        1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        if (paymentType.equals("return")) {
                                _printerCoreManager.addText("ผู้คืนของ", 1, PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();

                                _printerCoreManager.addFeedLine(1);

                                _printerCoreManager.addText("ลงชื่อ______________________________________________",
                                                1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();
                        }

                        if (paymentType.equals("returnCash")) {
                                _printerCoreManager.addText("ผู้คืนของ/รับเงิน", 1, PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();

                                _printerCoreManager.addFeedLine(1);

                                _printerCoreManager.addText("ลงชื่อ______________________________________________",
                                                1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();
                        }
                }
                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;

        }

        public boolean printReport(int model, String title, String type, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {

                if (!_printerCoreManager.isConnected())
                        return false;

                // _printerCoreManager.setPaperWidth(((Double)
                // vanConfig.get("VANCNF_RPT_ALLCONFIG")).intValue());
                _printerCoreManager.setPaperWidth(((Double) vanConfig.get("VANCNF_FRM_WIDTH")).intValue());

                _printerCoreManager.setBold(false);

                if (type.equals("SalesOrderByCategory")) {
                        printSalesOrderByCategory(title, data, items, vanConfig, companyInfo, salesMan, dateFrom,
                                        dateTo,
                                        printTime);
                } else if (type.equals("SalesOrderByProduct")) {
                        printSalesOrderByProduct(title, data, items, vanConfig, companyInfo, salesMan, dateFrom, dateTo,
                                        printTime);
                } else if (type.equals("SalesOrderByArline")) {
                        printSalesOrderByArline(title, data, items, vanConfig, companyInfo, salesMan, dateFrom, dateTo,
                                        printTime);
                } else if (type.equals("SalesOrderByDocType")) {
                        printSalesOrderByDocType(title, data, items, vanConfig, companyInfo, salesMan, dateFrom, dateTo,
                                        printTime);
                } else if (type.equals("SalesOrderByPmt")) {
                        printSalesOrderByPmt(title, data, items, vanConfig, companyInfo, salesMan, dateFrom, dateTo,
                                        printTime);
                } else if (type.equals("DocumentItems")) {
                        printDocumentItems(title, data, items, vanConfig, companyInfo, salesMan, dateFrom, dateTo,
                                        printTime);
                } else if (type.equals("DocumentItemsDetails")) {
                        printDocumentItemsDetails(title, data, items, vanConfig, companyInfo, salesMan, dateFrom,
                                        dateTo,
                                        printTime);
                } else if (type.equals("PerformanceByArlineItem")) {
                        printPerformanceByArlineItem(title, data, items, vanConfig, companyInfo, salesMan, dateFrom,
                                        dateTo,
                                        printTime);
                } else if (type.equals("PeformanceByProductCategory")) {
                        printPeformanceByProductCategoryItem(title, data, vanConfig, companyInfo, salesMan, dateFrom,
                                        dateTo,
                                        printTime);
                } else if (type.equals("SalesOrderBySaleman")) {
                        printSalesOrderBySaleman(title, data, vanConfig, companyInfo, salesMan, dateFrom, printTime);
                } else if (type.equals("StockBalanceByWL")) {
                        printStockBalanceByWL(title, data, items, vanConfig, companyInfo, salesMan, dateFrom, dateTo,
                                        printTime);
                }

                return true;
        }

        private boolean printSalesOrderByCategory(String title, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReport(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(),
                                dateFrom, dateTo, printTime);

                _printerCoreManager.addText("จำนวน(ชิ้น)", 55, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("แถม", 68, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("ยอดขาย", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();

                System.out.println("items= " + items);

                for (int i = 0; i < items.length; i++) {
                        Map<String, Object> item = (Map<String, Object>) items[i];

                        _printerCoreManager.addText("วันที่: " + item.get("GROUP_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] rows = (Object[]) item.get("ITEMS");

                        for (int j = 0; j < rows.length; j++) {
                                Map<String, Object> row = (Map<String, Object>) rows[j];

                                System.out.println("rows[j]= " + rows[j]);

                                _printerCoreManager.addText(
                                                (row.get("ICCAT_NAME") != null
                                                                && !row.get("ICCAT_NAME").toString().equals("")
                                                                                ? row.get("ICCAT_NAME").toString()
                                                                                : "-"),
                                                1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(
                                                withoutDecimal.format(
                                                                (Double.parseDouble(row.get("SKUQTY").toString()))),
                                                55, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                withoutDecimal.format(
                                                                (Double.parseDouble(row.get("SKUQFREE").toString()))),
                                                68, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimal2digitWithCommas.format(
                                                                (Double.parseDouble(row.get("SKUAMT").toString()))),
                                                100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        withoutDecimal.format(
                                                        (Double.parseDouble(item.get("GROUP_SUM_QTY").toString()))),
                                        55, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        withoutDecimal.format(
                                                        (Double.parseDouble(item.get("GROUP_SUM_QFREE").toString()))),
                                        68, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas.format(
                                                        (Double.parseDouble(item.get("GROUP_SUM_AMT").toString()))),
                                        100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("________________________________________________", 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();
                }

                if (items.length > 1) {

                        _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        // Map<String, Object> summarySection = (Map<String, Object>)
                        // data.get("SUMMARY_SECTION");

                        Object[] sumItems = (Object[]) data.get("SUMMARY_SECTION");

                        for (int k = 0; k < sumItems.length; k++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[k];

                                _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(withoutDecimal.format(
                                                (Double.parseDouble(row.get("ITEM_QTY").toString()))), 55,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(withoutDecimal.format(
                                                (Double.parseDouble(row.get("ITEM_QFREE").toString()))), 68,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(decimal2digitWithCommas.format(
                                                (Double.parseDouble(row.get("ITEM_AMT").toString()))), 100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(withoutDecimal.format(
                                        (Double.parseDouble(data.get("SUM_QTY").toString()))), 47,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(withoutDecimal.format(
                                        (Double.parseDouble(data.get("SUM_QFREE").toString()))), 68,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                        (Double.parseDouble(data.get("SUM_AMT").toString()))), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        private boolean printSalesOrderByProduct(String title, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReport(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(),
                                dateFrom, dateTo, printTime);

                _printerCoreManager.addText("จำนวนขาย", 35, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("แถม", 60, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("ยอดขาย", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                // _printerCoreManager.addText("ยกเว้น #", 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();

                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();

                for (int i = 0; i < items.length; i++) {
                        Map<String, Object> item = (Map<String, Object>) items[i];

                        _printerCoreManager.addText("วันที่: " + item.get("GROUP_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] rows = (Object[]) item.get("ITEMS");

                        for (int j = 0; j < rows.length; j++) {
                                Map<String, Object> row = (Map<String, Object>) rows[j];
                                // String ignoreVate = row.get("VAT_EXE").toString().equals("Y") ? "#" : "";

                                String ignoreVate = vanConfig.get("VANCNF_INV_SHOWVAT").toString().equals("1") ? "#"
                                                : "";

                                _printerCoreManager.addText(row.get("SKU_NAME").toString() + ignoreVate, 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();

                                _printerCoreManager.addText(withoutDecimal.format(
                                                (Double.parseDouble(row.get("SKUSELLQTY").toString()))), 35,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                withoutDecimal.format(
                                                                (Double.parseDouble(row.get("SKUFREEQTY").toString()))),
                                                60,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimal2digitWithCommas.format(
                                                                (Double.parseDouble(row.get("SKUAMT").toString()))),
                                                100,
                                                PrinterConst.ALIGN_RIGHT);
                                // if (ignoreVate != null && !ignoreVate.trim().equals(""))
                                // _printerCoreManager.addText(ignoreVate, 100, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();

                                // _printerCoreManager.addText("________________________________________________",
                                // 1, PrinterConst.ALIGN_LEFT);
                                // _printerCoreManager.flushText();
                        }

                        // for (int j = 0; j < rows.length; j++) {
                        // Map<String, Object> row = (Map<String, Object>) rows[j];
                        // _printerCoreManager.addText(row.get("ICCAT_NAME").toString(), 1,
                        // PrinterConst.ALIGN_LEFT);
                        // _printerCoreManager.addText(row.get("SKUQTY").toString(), 50,
                        // PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.addText(row.get("SKUAMT").toString(), 100,
                        // PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.flushText();
                        // }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(withoutDecimal.format(
                                        (Double.parseDouble(item.get("GROUP_SUM_QTY").toString()))), 35,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(withoutDecimal
                                        .format((Double.parseDouble(item.get("GROUP_SUM_FREE_QTY").toString()))), 60,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas.format(
                                                        (Double.parseDouble(item.get("GROUP_SUM_AMT").toString()))),
                                        100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("________________________________________________", 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();
                }

                if (items.length > 1) {
                        _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        // Map<String, Object> summarySection = (Map<String, Object>)
                        // data.get("SUMMARY_SECTION");
                        Object[] sumItems = (Object[]) data.get("SUMMARY_SECTION");

                        for (int k = 0; k < sumItems.length; k++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[k];
                                // String ignoreVate = row.get("ITEM_VAT_EXE").toString().equals("Y") ? "#" :
                                // "";

                                _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();

                                _printerCoreManager.addText(withoutDecimal.format(
                                                (Double.parseDouble(row.get("ITEM_SELL_QTY").toString()))), 35,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(withoutDecimal.format(
                                                (Double.parseDouble(row.get("ITEM_FREE_QTY").toString()))), 60,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(decimal2digitWithCommas.format(
                                                (Double.parseDouble(row.get("ITEM_AMT").toString()))), 100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(withoutDecimal.format(
                                        (Double.parseDouble(data.get("SUM_QTY").toString()))), 35,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(withoutDecimal.format(
                                        (Double.parseDouble(data.get("SUM_FREE_QTY").toString()))), 60,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                        (Double.parseDouble(data.get("SUM_AMT").toString()))), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                _printerCoreManager.addPageEnd();

                _printerCoreManager.sendData();

                return true;
        }

        private boolean printSalesOrderByArline(String title, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReport(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(),
                                dateFrom, dateTo, printTime);

                _printerCoreManager.addText("จำนวน(ชิ้น)", 55, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("แถม", 68, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("ยอดขาย", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();

                for (int i = 0; i < items.length; i++) {
                        Map<String, Object> item = (Map<String, Object>) items[i];

                        _printerCoreManager.addText("วันที่: " + item.get("GROUP_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] rows = (Object[]) item.get("ITEMS");

                        for (int j = 0; j < rows.length; j++) {
                                Map<String, Object> row = (Map<String, Object>) rows[j];

                                _printerCoreManager.addText(row.get("ARL_NAME").toString(), 1, PrinterConst.ALIGN_LEFT);
                                // _printerCoreManager.flushText();

                                _printerCoreManager.addText(
                                                withoutDecimal.format(
                                                                (Double.parseDouble(row.get("SKUSELLQTY").toString()))),
                                                55,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                withoutDecimal.format(
                                                                (Double.parseDouble(row.get("SKUQFREE").toString()))),
                                                68,
                                                PrinterConst.ALIGN_RIGHT);

                                _printerCoreManager.addText(
                                                decimal2digitWithCommas.format(
                                                                (Double.parseDouble(row.get("SKUAMT").toString()))),
                                                100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();

                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(withoutDecimal.format(
                                        (Double.parseDouble(item.get("GROUP_SUM_QTY").toString()))), 55,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(withoutDecimal.format(
                                        (Double.parseDouble(item.get("GROUP_SUM_QFREE").toString()))), 68,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                        (Double.parseDouble(item.get("GROUP_SUM_AMT").toString()))), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("________________________________________________", 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();
                }

                if (items.length > 1) {

                        _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        // Map<String, Object> summarySection = (Map<String, Object>)
                        // data.get("SUMMARY_SECTION");
                        Object[] sumItems = (Object[]) data.get("SUMMARY_SECTION");

                        for (int k = 0; k < sumItems.length; k++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[k];

                                _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(
                                                withoutDecimal.format(
                                                                (Double.parseDouble(row.get("ITEM_QTY").toString()))),
                                                55,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                withoutDecimal.format(
                                                                (Double.parseDouble(row.get("ITEM_QFREE").toString()))),
                                                68,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimal2digitWithCommas.format(
                                                                (Double.parseDouble(row.get("ITEM_AMT").toString()))),
                                                100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(withoutDecimal.format(
                                        (Double.parseDouble(data.get("SUM_QTY").toString()))), 55,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(withoutDecimal.format(
                                        (Double.parseDouble(data.get("SUM_QFREE").toString()))), 68,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                        (Double.parseDouble(data.get("SUM_AMT").toString()))), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;

        }

        private boolean printSalesOrderByDocType(String title, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReport(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(),
                                dateFrom, dateTo, printTime);

                _printerCoreManager.addText("ประเภท", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("จำนวนบิล", 70, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("ยอดขาย", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();

                for (int i = 0; i < items.length; i++) {
                        Map<String, Object> item = (Map<String, Object>) items[i];

                        _printerCoreManager.addText("วันที่: " + item.get("GROUP_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] rows = (Object[]) item.get("ITEMS");

                        for (int j = 0; j < rows.length; j++) {
                                Map<String, Object> row = (Map<String, Object>) rows[j];

                                _printerCoreManager.addText(row.get("DOCGROUP").toString(), 1, PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();
                                _printerCoreManager.addText(
                                                withoutDecimal.format(
                                                                Double.parseDouble(row.get("DOCOUNT").toString())),
                                                57,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimal2digitWithCommas.format(
                                                                Double.parseDouble(row.get("SKUAMT").toString())),
                                                100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();

                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        withoutDecimal.format(Double.parseDouble(
                                                        item.get("GROUP_SUMDOCOUNT").toString())),
                                        57, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas.format(
                                                        Double.parseDouble(item.get("GROUP_SUM_AMT").toString())),
                                        100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("________________________________________________", 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                }

                if (items.length > 1) {
                        _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        // System.out.println("s= " + data.get("SUMMARY_SECTION"));

                        // Map<String, Object> summarySection = (Map<String, Object>)
                        // data.get("SUMMARY_SECTION");
                        Object[] sumItems = (Object[]) data.get("SUMMARY_SECTION");
                        // Object[] sumItems = (Object[]) summarySection.get("SUMMARY_SECTION");

                        for (int k = 0; k < sumItems.length; k++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[k];

                                _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(withoutDecimal
                                                .format((Double.parseDouble(row.get("ITEM_DO_COUNT").toString()))), 57,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimal2digitWithCommas.format(
                                                                (Double.parseDouble(row.get("ITEM_AMT").toString()))),
                                                100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        withoutDecimal.format(Double
                                                        .parseDouble(convertReal(data.get("SUM_DOCOUNT").toString()))),
                                        57, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas
                                                        .format((Double.parseDouble(data.get("SUM_AMT").toString()))),
                                        100, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        private boolean printSalesOrderByPmt(String title, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReport(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(),
                                dateFrom, dateTo, printTime);

                _printerCoreManager.addText("ประเภทชำระ", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("ยอดขาย", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();

                for (int i = 0; i < items.length; i++) {
                        Map<String, Object> item = (Map<String, Object>) items[i];

                        _printerCoreManager.addText("วันที่: " + item.get("GROUP_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] rows = (Object[]) item.get("ITEMS");

                        for (int j = 0; j < rows.length; j++) {
                                Map<String, Object> row = (Map<String, Object>) rows[j];

                                _printerCoreManager.addText(row.get("PMT_NAME").toString(), 1, PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(
                                                decimal2digitWithCommas.format(
                                                                (Double.parseDouble(row.get("PMTAMT").toString()))),
                                                100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();

                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas
                                                        .format((Double.parseDouble(item.get("GROUP_AMT").toString()))),
                                        100, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("________________________________________________", 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();
                }

                // for (int i = 0; i < items.length; i++) {
                // Map<String, Object> item = (Map<String, Object>) items[i];
                //
                // _printerCoreManager.addText(item.get("PMT_NAME").toString(), 1,
                // PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(item.get("PMTAMT").toString(), 100,
                // PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                //
                // _printerCoreManager.addFeedLine(1);
                //
                // }
                //
                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();

                if (items.length > 1) {
                        _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        // Map<String, Object> summarySection = (Map<String, Object>)
                        // data.get("SUMMARY_SECTION");
                        Object[] sumItems = (Object[]) data.get("SUMMARY_SECTION");

                        for (int k = 0; k < sumItems.length; k++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[k];

                                _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(
                                                decimal2digitWithCommas.format(
                                                                (Double.parseDouble(row.get("ITEM_AMT").toString()))),
                                                100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas
                                                        .format((Double.parseDouble(data.get("SUM_AMT").toString()))),
                                        100, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                // _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(data.get("SUM_AMT").toString(), 100,
                // PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        private boolean printDocumentItems(String title, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReport(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(),
                                dateFrom, dateTo, printTime);

                _printerCoreManager.addText("เลขที่", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("เอกสาร", 44, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("ชำระ", 66, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ชื่อลูกค้า", 7, PrinterConst.ALIGN_LEFT);

                _printerCoreManager.addText("ยอดเงิน", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                for (int i = 0; i < items.length; i++) {
                        Map<String, Object> item = (Map<String, Object>) items[i];

                        _printerCoreManager.addText("วันที่: " + item.get("GROUP_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] rows = (Object[]) item.get("ITEMS");

                        for (int j = 0; j < rows.length; j++) {
                                Map<String, Object> row = (Map<String, Object>) rows[j];

                                _printerCoreManager.addText(row.get("DOCGROUP").toString(), 1, PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();

                                Object[] deepRowLevel1 = (Object[]) row.get("ITEMS");

                                for (int k = 0; k < deepRowLevel1.length; k++) {
                                        Map<String, Object> rowLv1 = (Map<String, Object>) deepRowLevel1[k];
                                        _printerCoreManager.addText(rowLv1.get("DI_REF").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                                        (Double.parseDouble(rowLv1.get("ARD_A_AMT").toString()))), 100,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();

                                        _printerCoreManager.addText(rowLv1.get("AR_NAME").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();
                                }
                        }

                        _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas
                                                        .format((Double.parseDouble(item.get("GROUP_AMT").toString()))),
                                        100, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("________________________________________________", 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();
                }

                if (items.length > 1) {
                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Map<String, Object> summarySection = (Map<String, Object>) data.get("SUMMARY_SECTION");
                        Object[] sumItems = (Object[]) summarySection.get("GROUP");
                        Object sumamt = (Object) summarySection.get("SUM_AMT");

                        for (int l = 0; l < sumItems.length; l++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[l];

                                _printerCoreManager.addText(row.get("GROUP_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(decimal2digitWithCommas.format(
                                                (Double.parseDouble(row.get("GROUP_ITEM_AMT").toString()))), 100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas.format((Double.parseDouble(sumamt.toString()))), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                }

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        private boolean printDocumentItemsDetails(String title, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReport(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(),
                                dateFrom, dateTo, printTime);

                _printerCoreManager.addText("ชื่อลูกค้า", 7, PrinterConst.ALIGN_LEFT);

                _printerCoreManager.addText("ยอดเงิน", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                for (int i = 0; i < items.length; i++) {
                        Map<String, Object> item = (Map<String, Object>) items[i];

                        _printerCoreManager.addText("วันที่: " + item.get("GROUP_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] rows = (Object[]) item.get("ITEMS");

                        for (int j = 0; j < rows.length; j++) {
                                Map<String, Object> row = (Map<String, Object>) rows[j];

                                _printerCoreManager.addText(row.get("DOCGROUP").toString(), 1, PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();

                                Object[] deepRowLevel1 = (Object[]) row.get("ITEMS");

                                for (int k = 0; k < deepRowLevel1.length; k++) {
                                        Map<String, Object> rowLv1 = (Map<String, Object>) deepRowLevel1[k];
                                        _printerCoreManager.addText(rowLv1.get("DOCGROUP").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();

                                        _printerCoreManager.addText(rowLv1.get("AR_NAME").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.flushText();

                                        _printerCoreManager.addText("รหัสลูกค้า", 1, PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(rowLv1.get("AR_CODE").toString(), 100,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();

                                        Object[] deepRowLevel2 = (Object[]) rowLv1.get("ITEMS");

                                        System.out.println(deepRowLevel2);
                                        System.out.println("length >> " + deepRowLevel2.length);

                                        for (int l = 0; l < deepRowLevel2.length; l++) {
                                                Map<String, Object> rowLv2 = (Map<String, Object>) deepRowLevel2[l];

                                                _printerCoreManager.addText(rowLv2.get("TRD_SH_NAME").toString(), 1,
                                                                PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.flushText();

                                                _printerCoreManager.addText("จำนวน", 1, PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.addText(
                                                                withoutDecimal.format((Double.parseDouble(
                                                                                rowLv2.get("TRD_SH_QTY").toString()))),
                                                                35,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.addText("แถม", 60, PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.addText(
                                                                withoutDecimal.format((Double.parseDouble(
                                                                                rowLv2.get("TRD_Q_FREE").toString()))),
                                                                100,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.flushText();

                                                _printerCoreManager.addText("ราคาต่อหน่วย", 1, PrinterConst.ALIGN_LEFT);
                                                _printerCoreManager.addText(
                                                                decimal2digitWithCommas.format((Double.parseDouble(
                                                                                rowLv2.get("TRD_SH_UPRC").toString()))),
                                                                100,
                                                                PrinterConst.ALIGN_RIGHT);
                                                _printerCoreManager.flushText();
                                        }

                                        _printerCoreManager.addText("มูลค่ารวมก่อนลด", 1, PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                                        (Double.parseDouble(rowLv1.get("ARD_G_KEYIN").toString()))),
                                                        100,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();

                                        _printerCoreManager.addText("ส่วนลดท้ายบิล", 1, PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                                        (Double.parseDouble(rowLv1.get("ARD_TDSC_KEYINV").toString()))),
                                                        100,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();

                                        _printerCoreManager.addText("ยอดสินค้า", 1, PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                                        (Double.parseDouble(rowLv1.get("SUM_TRD_B_SELL").toString()))),
                                                        100,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();

                                        _printerCoreManager.addText("ยอด ภพ.", 1, PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                                        (Double.parseDouble(rowLv1.get("SUM_TRD_B_VAT").toString()))),
                                                        100,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();

                                        _printerCoreManager.addText("ยอด สุทธิ", 1, PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(decimal2digitWithCommas.format(
                                                        (Double.parseDouble(rowLv1.get("ARD_A_AMT").toString()))), 100,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();

                                }
                                _printerCoreManager.addText("________________________________________________", 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();
                        }

                        // _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        // _printerCoreManager.addText(item.get("GROUP_AMT").toString(), 100,
                        // PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.flushText();

                }

                // if (items.length > 1) {
                // _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();

                // Map<String, Object> summarySection = (Map<String, Object>)
                // data.get("SUMMARY_SECTION");
                // Object[] sumItems = (Object[]) summarySection.get("ITEMS");

                // for (int l = 0; l < sumItems.length; l++) {
                // Map<String, Object> row = (Map<String, Object>) sumItems[l];

                // _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                // PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(row.get("ITEM_AMT").toString(), 100,
                // PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                // }

                // _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(data.get("SUM_AMT").toString(), 100,
                // PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();

                // }

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        // #7
        private boolean printPerformanceByArlineItem(String title, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReport(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(),
                                dateFrom, dateTo, printTime);

                _printerCoreManager.addText("สายลูกค้า", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("จำนวน", 44, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.addText("จำนวน", 66, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.addText("จำนวน", 88, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ลูกค้า", 44, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.addText("ขาย", 66, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.addText("เยี่ยม", 88, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                Map<String, Object> rptData = (Map<String, Object>) data.get("RPT_DATA");
                Object[] deepRowLevel1 = (Object[]) rptData.get("RESULT");

                for (int i = 0; i < deepRowLevel1.length; i++) {
                        Map<String, Object> rowLevel1 = (Map<String, Object>) deepRowLevel1[i];

                        _printerCoreManager.addText("วันที่: " + rowLevel1.get("GROUP_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] deepRowLevel2 = (Object[]) rowLevel1.get("ITEMS");

                        for (int j = 0; j < deepRowLevel2.length; j++) {
                                Map<String, Object> rowLevel2 = (Map<String, Object>) deepRowLevel2[j];

                                Object[] deepRowLevel3 = (Object[]) rowLevel2.get("ITEMS");

                                for (int k = 0; k < deepRowLevel3.length; k++) {
                                        Map<String, Object> rowLevel3 = (Map<String, Object>) deepRowLevel3[k];

                                        _printerCoreManager.addText(rowLevel3.get("ARL_NAME").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        _printerCoreManager.addText(
                                                        decimalWithoutCommas
                                                                        .format(Double.parseDouble(convertReal(rowLevel3
                                                                                        .get("COUNTAR").toString()))),
                                                        55, PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.addText(
                                                        decimalWithoutCommas
                                                                        .format(Double.parseDouble(convertReal(
                                                                                        rowLevel3.get("COUNTSELLBOOK")
                                                                                                        .toString()))),
                                                        77, PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.addText(
                                                        decimalWithoutCommas
                                                                        .format(Double.parseDouble(convertReal(
                                                                                        rowLevel3.get("COUNTVISIT")
                                                                                                        .toString()))),
                                                        100, PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();
                                }

                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas
                                                        .format(Double.parseDouble(convertReal(
                                                                        rowLevel1.get("SUM_COUNTAR").toString()))),
                                        55, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas
                                                        .format(Double.parseDouble(convertReal(rowLevel1
                                                                        .get("SUM_COUNTSELLBOOK").toString()))),
                                        77, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas
                                                        .format(Double.parseDouble(convertReal(
                                                                        rowLevel1.get("SUM_COUNTVISIT").toString()))),
                                        100, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("** แสดงในรูปแบบ % **", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        for (int j = 0; j < deepRowLevel2.length; j++) {
                                Map<String, Object> rowLevel2 = (Map<String, Object>) deepRowLevel2[j];

                                Object[] deepRowLevel3 = (Object[]) rowLevel2.get("ITEMS_PERCENT");

                                for (int k = 0; k < deepRowLevel3.length; k++) {
                                        Map<String, Object> rowLevel3 = (Map<String, Object>) deepRowLevel3[k];

                                        _printerCoreManager.addText(rowLevel3.get("ARL_NAME").toString(), 1,
                                                        PrinterConst.ALIGN_LEFT);
                                        // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(rowLevel3.get("COUNTAR_PERCENT").toString())))
                                        // + "%", 55, PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.addText(
                                                        rowLevel3.get("COUNTSELLBOOK_PERCENT").toString() + "%", 77,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.addText(
                                                        rowLevel3.get("COUNTVISIT_PERCENT").toString() + "%", 100,
                                                        PrinterConst.ALIGN_RIGHT);
                                        _printerCoreManager.flushText();
                                }

                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(rowLevel1.get("SUM_COUNTAR_PERCENT").toString())))
                        // + "%", 55, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(rowLevel1.get("SUM_COUNTSELLBOOK_PERCENT").toString() + "%", 77,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(rowLevel1.get("SUM_COUNTVISIT_PERCENT").toString() + "%", 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("________________________________________________", 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                }

                if (deepRowLevel1.length > 1) {

                        _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Map<String, Object> summarySection = (Map<String, Object>) data.get("SUMMARY_SECTION");
                        Object[] sumItems = (Object[]) summarySection.get("SUMMARY_SECTION");

                        for (int k = 0; k < sumItems.length; k++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[k];

                                _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(
                                                decimalWithoutCommas
                                                                .format(Double.parseDouble(convertReal(
                                                                                row.get("ITEM_COUNTAR").toString()))),
                                                55, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimalWithoutCommas
                                                                .format(Double.parseDouble(convertReal(
                                                                                row.get("ITEM_COUNTSELLBOOK")
                                                                                                .toString()))),
                                                77, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimalWithoutCommas
                                                                .format(Double.parseDouble(convertReal(row
                                                                                .get("ITEM_COUNTVISIT").toString()))),
                                                100, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas
                                                        .format(Double.parseDouble(convertReal(
                                                                        summarySection.get("SUM_COUNTAR").toString()))),
                                        55, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas.format(
                                                        Double.parseDouble(convertReal(summarySection
                                                                        .get("SUM_COUNTSELLBOOK").toString()))),
                                        77, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas
                                                        .format(Double.parseDouble(convertReal(summarySection
                                                                        .get("SUM_COUNTVISIT").toString()))),
                                        100, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("** แสดงในรูปแบบ % **", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        for (int k = 0; k < sumItems.length; k++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[k];

                                _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(row.get("ITEM_COUNTAR_PERCENT").toString())))
                                // + "%", 55, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(row.get("ITEM_COUNTSELLBOOK_PERCENT").toString() + "%", 77,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(row.get("ITEM_COUNTVISIT_PERCENT").toString() + "%", 100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(summarySection.get("SUM_COUNTAR_PERCENT").toString())))
                        // + "%", 55, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(summarySection.get("SUM_COUNTSELLBOOK_PERCENT").toString() + "%",
                                        77,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(summarySection.get("SUM_COUNTVISIT_PERCENT").toString() + "%", 100,
                                        PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.addText("________________________________________________",
                        // 1, PrinterConst.ALIGN_LEFT);

                        _printerCoreManager.flushText();

                }

                // if (deepRowLevel1.length > 1) {
                //
                // _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // Map<String, Object> summarySection = (Map<String, Object>)
                // data.get("SUMMARY_SECTION");
                // Object[] sumItems = (Object[]) summarySection.get("ITEMS");
                //
                // for (int k = 0; k < sumItems.length; k++) {
                // Map<String, Object> row = (Map<String, Object>) sumItems[k];
                //
                // _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                // PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(row.get("ITEM_COUNTAR").toString()))),
                // 55, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(row.get("ITEM_COUNTSELLBOOK").toString()))),
                // 77, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(row.get("ITEM_COUNTVISIT").toString()))),
                // 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                // }
                //
                // _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(summarySection.get("SUM_COUNTAR").toString()))),
                // 55, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(summarySection.get("SUM_COUNTSELLBOOK").toString()))),
                // 77, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(summarySection.get("SUM_COUNTVISIT").toString()))),
                // 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                // }
                //
                //
                //
                //// _printerCoreManager.addText("** แสดงในรูปแบบ % **", 1,
                // PrinterConst.ALIGN_LEFT);
                //// _printerCoreManager.flushText();
                //
                //
                //
                // for (int i = 0; i < deepRowLevel1.length; i++) {
                // Map<String, Object> rowLevel1 = (Map<String, Object>) deepRowLevel1[i];
                //
                // _printerCoreManager.addText("วันที่: " +
                // rowLevel1.get("GROUP_NAME").toString(), 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // Object[] deepRowLevel2 = (Object[]) rowLevel1.get("ITEMS");
                //
                // for (int j = 0; j < deepRowLevel2.length; j++) {
                // Map<String, Object> rowLevel2 = (Map<String, Object>) deepRowLevel2[j];
                //
                // Object[] deepRowLevel3 = (Object[]) rowLevel2.get("ITEMS_PERCENT");
                //
                // for (int k = 0; k < deepRowLevel3.length; k++) {
                // Map<String, Object> rowLevel3 = (Map<String, Object>) deepRowLevel3[k];
                //
                // _printerCoreManager.addText(rowLevel3.get("ARL_NAME").toString(), 1,
                // PrinterConst.ALIGN_LEFT);
                //// _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(convertReal(rowLevel3.get("COUNTAR_PERCENT").toString())))
                // + "%", 55, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(convertReal(rowLevel3.get("COUNTSELLBOOK_PERCENT").toString())))
                // + "%", 77, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(convertReal(rowLevel3.get("COUNTVISIT_PERCENT").toString())))
                // + "%", 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                // }
                //
                // _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                //// _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(convertReal(rowLevel1.get("SUM_COUNTAR_PERCENT").toString())))
                // + "%", 55, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(convertReal(rowLevel1.get("SUM_COUNTSELLBOOK_PERCENT").toString())))
                // + "%", 77, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(convertReal(rowLevel1.get("SUM_COUNTVISIT_PERCENT").toString())))
                // + "%", 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                //
                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // }
                // }
                //
                // if (deepRowLevel1.length > 1) {
                //
                // _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // Map<String, Object> summarySection = (Map<String, Object>)
                // data.get("SUMMARY_SECTION_PERCENT");
                // Object[] sumItems = (Object[]) summarySection.get("ITEMS");
                //
                // for (int k = 0; k < sumItems.length; k++) {
                // Map<String, Object> row = (Map<String, Object>) sumItems[k];
                //
                // _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                // PrinterConst.ALIGN_LEFT);
                //// _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(row.get("ITEM_COUNTAR_PERCENT").toString()))
                // + "%",55, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(row.get("ITEM_COUNTSELLBOOK_PERCENT").toString()))
                // + "%",77, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(row.get("ITEM_COUNTVISIT_PERCENT").toString()))
                // + "%", 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                // }
                //
                // _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                //// _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(summarySection.get("SUM_COUNTAR_PERCENT").toString()))
                // + "%", 55, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(summarySection.get("SUM_COUNTSELLBOOK_PERCENT").toString()))
                // + "%", 77, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(decimal2digitWithCommas.format(Double.parseDouble(summarySection.get("SUM_COUNTVISIT_PERCENT").toString()))
                // + "%", 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                // }

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        // #8
        private boolean printPeformanceByProductCategoryItem(String title, Map<String, Object> data,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReport(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(),
                                dateFrom, dateTo, printTime);

                _printerCoreManager.addText("หมวดสินค้า", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("ทั้งหมด", 70, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("ชนิดขาย", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                Map<String, Object> rptData = (Map<String, Object>) data.get("RPT_DATA");
                Object[] deepRowLevel1 = (Object[]) rptData.get("RESULT");

                for (int i = 0; i < deepRowLevel1.length; i++) {
                        Map<String, Object> rowLevel1 = (Map<String, Object>) deepRowLevel1[i];

                        _printerCoreManager.addText("วันที่: " + rowLevel1.get("GROUP_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] deepRowLevel2 = (Object[]) rowLevel1.get("ITEMS");

                        for (int j = 0; j < deepRowLevel2.length; j++) {
                                Map<String, Object> rowLevel2 = (Map<String, Object>) deepRowLevel2[j];

                                _printerCoreManager.addText(rowLevel2.get("ICDEPT_THAIDESC").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.addText(
                                                decimalWithoutCommas
                                                                .format(Double.parseDouble(convertReal(
                                                                                rowLevel2.get("COUNTSKU").toString()))),
                                                70, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimalWithoutCommas
                                                                .format(Double.parseDouble(convertReal(
                                                                                rowLevel2.get("COUNTSKM").toString()))),
                                                100, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();

                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas
                                                        .format(Double.parseDouble(convertReal(
                                                                        rowLevel1.get("SUM_COUNTSKU").toString()))),
                                        70, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas
                                                        .format(Double.parseDouble(convertReal(
                                                                        rowLevel1.get("SUM_COUNTSKM").toString()))),
                                        100, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("** แสดงในรูปแบบ % **", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] deepRowLevel2PC = (Object[]) rowLevel1.get("ITEMS_PERCENT");

                        for (int j = 0; j < deepRowLevel2PC.length; j++) {
                                Map<String, Object> rowLevel2PC = (Map<String, Object>) deepRowLevel2PC[j];

                                _printerCoreManager.addText(rowLevel2PC.get("ICDEPT_THAIDESC").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(rowLevel3.get("COUNTAR_PERCENT").toString())))
                                // + "%", 55, PrinterConst.ALIGN_RIGHT);
                                // _printerCoreManager.addText(rowLevel2.get("COUNTSKU_PERCENT").toString() +
                                // "%", 70, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(rowLevel2PC.get("COUNTSKM_PERCENT").toString() + "%", 100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();

                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(rowLevel1.get("SUM_COUNTAR_PERCENT").toString())))
                        // + "%", 55, PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.addText(rowLevel1.get("SUM_COUNTSKU_PERCENT").toString()
                        // + "%", 70, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(rowLevel1.get("SUM_COUNTSKM_PERCENT").toString() + "%", 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("________________________________________________", 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                }

                if (deepRowLevel1.length > 1) {

                        _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Map<String, Object> summarySection = (Map<String, Object>) data.get("SUMMARY_SECTION");
                        Object[] sumItems = (Object[]) summarySection.get("SUMMARY_SECTION");

                        for (int k = 0; k < sumItems.length; k++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[k];

                                _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(row.get("ITEM_COUNTAR").toString()))),
                                // 55, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimalWithoutCommas
                                                                .format(Double.parseDouble(convertReal(
                                                                                row.get("ITEM_COUNTSKU").toString()))),
                                                70, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(
                                                decimalWithoutCommas
                                                                .format(Double.parseDouble(convertReal(
                                                                                row.get("ITEM_COUNTSKM").toString()))),
                                                100, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(summarySection.get("SUM_COUNTAR").toString()))),
                        // 55, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas
                                                        .format(Double.parseDouble(convertReal(summarySection
                                                                        .get("SUM_COUNTSKU").toString()))),
                                        70, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(
                                        decimalWithoutCommas
                                                        .format(Double.parseDouble(convertReal(summarySection
                                                                        .get("SUM_COUNTSKM").toString()))),
                                        100, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("** แสดงในรูปแบบ % **", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        for (int k = 0; k < sumItems.length; k++) {
                                Map<String, Object> row = (Map<String, Object>) sumItems[k];

                                _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                                                PrinterConst.ALIGN_LEFT);
                                // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(row.get("ITEM_COUNTAR_PERCENT").toString())))
                                // + "%", 55, PrinterConst.ALIGN_RIGHT);
                                // _printerCoreManager.addText(row.get("ITEM_COUNTSKU_PERCENT").toString() +
                                // "%", 70, PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.addText(row.get("ITEM_COUNTSKM_PERCENT").toString() + "%", 100,
                                                PrinterConst.ALIGN_RIGHT);
                                _printerCoreManager.flushText();
                        }

                        _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        // _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(summarySection.get("SUM_COUNTAR_PERCENT").toString())))
                        // + "%", 55, PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.addText(summarySection.get("ITEM_COUNTSKU_PERCENT").toString()
                        // + "%", 70, PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.addText(summarySection.get("SUM_COUNTSKM_PERCENT").toString() + "%", 100,
                                        PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.addText("________________________________________________",
                        // 1, PrinterConst.ALIGN_LEFT);

                        _printerCoreManager.flushText();

                }

                // if (deepRowLevel1.length > 1) {
                //
                // _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // Map<String, Object> summarySection = (Map<String, Object>)
                // data.get("SUMMARY_SECTION");
                // Object[] sumItems = (Object[]) summarySection.get("ITEMS");
                //
                // for (int k = 0; k < sumItems.length; k++) {
                // Map<String, Object> row = (Map<String, Object>) sumItems[k];
                //
                // _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                // PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(row.get("ITEM_COUNTSKU").toString(), 70,
                // PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(row.get("ITEM_COUNTSKM").toString(), 100,
                // PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                // }
                //
                // _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(summarySection.get("SUM_COUNTSKU").toString(),
                // 70, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(summarySection.get("SUM_COUNTSKM").toString(),
                // 100, PrinterConst.ALIGN_RIGHT);
                //
                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // }
                //
                // _printerCoreManager.addText("** แสดงในรูปแบบ % **", 1,
                // PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // for (int i = 0; i < deepRowLevel1.length; i++) {
                // Map<String, Object> rowLevel1 = (Map<String, Object>) deepRowLevel1[i];
                //
                // _printerCoreManager.addText("วันที่: " +
                // rowLevel1.get("GROUP_NAME").toString(), 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // Object[] deepRowLevel2 = (Object[]) rowLevel1.get("ITEMS_PERCENT");
                //
                // for (int j = 0; j < deepRowLevel2.length; j++) {
                // Map<String, Object> rowLevel2 = (Map<String, Object>) deepRowLevel2[j];
                //
                // _printerCoreManager.addText(rowLevel2.get("ICDEPT_THAIDESC").toString(), 1,
                // PrinterConst.ALIGN_LEFT);
                //// _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(rowLevel2.get("COUNTSKU").toString())))
                // + "%", 70, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(convertReal(rowLevel2.get("COUNTSKM").toString())
                // + "%", 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                //
                // }
                //
                // _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                //// _printerCoreManager.addText(decimalWithoutCommas.format(Double.parseDouble(convertReal(rowLevel1.get("SUM_COUNTSKU_PERCENT").toString())))
                // + "%", 70, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(convertReal(rowLevel1.get("SUM_COUNTSKM_PERCENT").toString())
                // + "%", 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                //
                // _printerCoreManager.addText("________________________________________________",
                // 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // }
                //
                // if (deepRowLevel1.length > 1) {
                //
                // _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.flushText();
                //
                // Map<String, Object> summarySection = (Map<String, Object>)
                // data.get("SUMMARY_SECTION");
                // Object[] sumItems = (Object[]) summarySection.get("ITEMS");
                //
                // for (int k = 0; k < sumItems.length; k++) {
                // Map<String, Object> row = (Map<String, Object>) sumItems[k];
                //
                // _printerCoreManager.addText(row.get("ITEM_NAME").toString(), 1,
                // PrinterConst.ALIGN_LEFT);
                //// _printerCoreManager.addText(row.get("ITEM_COUNTSKU_PERCENT").toString() +
                // "%", 70, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(row.get("ITEM_COUNTSKM_PERCENT").toString() +
                // "%", 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                // }
                //
                // _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                //// _printerCoreManager.addText(summarySection.get("SUM_COUNTSKU_PERCENT").toString()
                // + "%", 70, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(summarySection.get("SUM_COUNTSKM_PERCENT").toString()
                // + "%", 100, PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();
                // }

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        private boolean printSalesOrderBySaleman(String title, Map<String, Object> data, Map<String, Object> vanConfig,
                        Map<String, Object> companyInfo, Map<String, Object> salesMan, String dateFrom,
                        String printTime)
                        throws Exception {

                printHeaderReportPatternC(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(), dateFrom, printTime);

                _printerCoreManager.addText("บิลเริ่มต้น", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(data.get("F_TIME").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("บิลสุดท้าย", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(data.get("E_TIME").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                Map<String, Object> book = (Map<String, Object>) data.get("BOOK");

                _printerCoreManager.addText("ยอดจองรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(book.get("SUM_AMT").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ลดต่อรายการรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(book.get("SUM_ITEM_DSC").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ลดท้ายบิลรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(book.get("SUM_BILL_DSC").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนบิลรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(book.get("COUNT_DOC").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนรายการจอง", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(book.get("SUM_PCS").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนชิ้นรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(book.get("SUM_QTY").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนชิ้น (แถม)", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(book.get("SUM_FREE_ITEM_QTY").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                Map<String, Object> sell = (Map<String, Object>) data.get("SELL");

                _printerCoreManager.addText("ยอดขายรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(sell.get("SUM_AMT").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ลดต่อรายการรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(sell.get("SUM_ITEM_DSC").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ลดท้ายบิลรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(sell.get("SUM_BILL_DSC").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนบิลรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(sell.get("COUNT_DOC").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนรายการขาย", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(sell.get("SUM_PCS").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนชิ้นรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(sell.get("SUM_QTY").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนชิ้น (แถม)", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(sell.get("SUM_FREE_ITEM_QTY").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                Map<String, Object> returnObj = (Map<String, Object>) data.get("RETURN");

                _printerCoreManager.addText("ยอดคืนรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(returnObj.get("SUM_AMT").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ส่วนต่อรายการรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(returnObj.get("SUM_ITEM_DSC").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ส่วนลดท้ายบิลรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(returnObj.get("SUM_BILL_DSC").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนบิลรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(returnObj.get("COUNT_DOC").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนรายการคืน", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(returnObj.get("SUM_PCS").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนชิ้นรวม", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(returnObj.get("SUM_QTY").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวนชิ้น (แถม)", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(returnObj.get("SUM_FREE_ITEM_QTY").toString(), 100,
                                PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("โอนเข้าลูกหนี้", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(data.get("TRANSFER_TO_AR").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                // transfer is locked
                // _printerCoreManager.addText("โอนธนาคาร", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(data.get("PAID_BY_TRANSFER").toString(), 100,
                // PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();

                _printerCoreManager.addText("ชำระเช็ค", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(data.get("PAID_BY_CHEQUE").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ชำระเงินสด", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(data.get("PAID_BY_CASH").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("คืนเงินสด", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(data.get("SUM_CASH_RTN").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เงินสดจากการขาย", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(data.get("CASH_FROM_SELL").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เศษทอนไม่ได้", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(data.get("PGL").toString(), 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เลขไมล์ เริ่มต้น", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(decimal2digitWithCommas.format(data.get("MILE_START")), 100,
                                PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เลขไมล์ สิ้นสุด", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(decimal2digitWithCommas.format(data.get("MILE_END")), 100,
                                PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("รวมระยะทาง(วิ่ง)", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(decimal2digitWithCommas.format(data.get("DISTANCE")), 100,
                                PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        private boolean printStockBalanceByWL(String title, Map<String, Object> data, Object[] items,
                        Map<String, Object> vanConfig, Map<String, Object> companyInfo, Map<String, Object> salesMan,
                        String dateFrom, String dateTo, String printTime) throws Exception {
                printHeaderReportPatternC(title, vanConfig.get("VANCNF_REG_NAME").toString(),
                                salesMan.get("SLMN_NAME").toString(), dateFrom, printTime);

                _printerCoreManager.addText("รหัส : ชื่อสินค้า", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("จำนวน", 30, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("จำนวน", 66, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("จำนวน", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("หน่วย", 30, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("หน่วย", 66, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.addText("หน่วย", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();
                // items.length
                for (int i = 0; i < items.length; i++) {
                        Map<String, Object> item = (Map<String, Object>) items[i];

                        _printerCoreManager.addText(
                                        "ตน.เก็บ " + item.get("WL_CODE").toString() + " : "
                                                        + item.get("WL_NAME").toString(),
                                        1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        Object[] obj = (Object[]) item.get("ITEMS");
                        // obj.length
                        for (int j = 0; j < obj.length; j++) {
                                Map<String, Object> objChildren = (Map<String, Object>) obj[j];

                                _printerCoreManager.addText(
                                                objChildren.get("SKU_CODE").toString() + " : "
                                                                + objChildren.get("SKU_NAME").toString(),
                                                1,
                                                PrinterConst.ALIGN_LEFT);
                                _printerCoreManager.flushText();

                                String col1 = ((Double) objChildren.get("WL_QTY_S")).intValue() != 0 && !objChildren
                                                .get("SKU_S_UTQ_NAME").toString()
                                                .equals(objChildren.get("SKU_T_UTQ_NAME").toString())
                                                                ? withoutDecimal.format(objChildren.get("WL_QTY_S"))
                                                                                + objChildren.get("SKU_S_UTQ_NAME")
                                                                                                .toString()
                                                                : null;
                                String col2 = ((Double) objChildren.get("WL_QTY_T")).intValue() != 0 && !objChildren
                                                .get("SKU_T_UTQ_NAME").toString()
                                                .equals(objChildren.get("SKU_K_UTQ_NAME").toString())
                                                                ? withoutDecimal.format(objChildren.get("WL_QTY_T"))
                                                                                + objChildren.get("SKU_T_UTQ_NAME")
                                                                                                .toString()
                                                                : null;
                                String col3 = ((Double) objChildren.get("WL_QTY_K")).intValue() != 0
                                                ? withoutDecimal.format(objChildren.get("WL_QTY_K"))
                                                                + objChildren.get("SKU_K_UTQ_NAME").toString()
                                                : null;

                                if (col2 != null && col3 == null) {
                                        col3 = col2;
                                        col2 = null;
                                }

                                if (col1 != null && col2 == null && col3 == null) {
                                        col3 = col1;
                                        col1 = null;
                                } else if (col1 != null && col2 == null && col3 != null) {
                                        col2 = col1;
                                        col1 = null;
                                }

                                boolean shouldFlush = false;

                                if (col1 != null) {
                                        shouldFlush = true;
                                        _printerCoreManager.addText(col1, 30, PrinterConst.ALIGN_RIGHT);
                                }

                                if (col2 != null) {
                                        shouldFlush = true;
                                        _printerCoreManager.addText(col2, 66, PrinterConst.ALIGN_RIGHT);
                                }
                                if (col3 != null) {
                                        shouldFlush = true;
                                        _printerCoreManager.addText(col3, 100, PrinterConst.ALIGN_RIGHT);
                                }

                                if (shouldFlush)
                                        _printerCoreManager.flushText();

                        }

                        // _printerCoreManager.addText(withoutDecimal.format(item.get("SUM_WL_QTY_S")),
                        // 30, PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.addText(withoutDecimal.format(item.get("SUM_WL_QTY_T")),
                        // 66, PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.addText(withoutDecimal.format(item.get("SUM_WL_QTY_K")),
                        // 100, PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.flushText();

                        // _printerCoreManager.addText("รวม", 1, PrinterConst.ALIGN_LEFT);
                        // _printerCoreManager.addText(item.get("SUM_WL_QTY").toString(), 66,
                        // PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.addText(item.get("SUM_TRD_NX_QTY").toString(), 100,
                        // PrinterConst.ALIGN_RIGHT);
                        // _printerCoreManager.flushText();

                        _printerCoreManager.addFeedLine(1);

                        _printerCoreManager.addText("________________________________________________", 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();
                }

                // _printerCoreManager.addText("รวมทั้งสิ้น", 1, PrinterConst.ALIGN_LEFT);
                // _printerCoreManager.addText(data.get("SUM_ALL_WL_QTY").toString(), 66,
                // PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.addText(data.get("SUM_ALL_TRD_NX_QTY").toString(), 100,
                // PrinterConst.ALIGN_RIGHT);
                // _printerCoreManager.flushText();

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        private boolean printHeaderReport(String title, String regName, String slmnName, String dateFrom, String dateTo,
                        String printTime) throws Exception {
                String titleSecondLine = "";

                if (title.equals("รายงานสรุปการขายตามประเภทเอกสาร")
                                && _printerCoreManager.getModel() == PrinterConst.ZIJIANG
                                && _printerCoreManager.getPaperWidth() == PrinterConst.PAPER_WIDTH_58MM) {
                        title = "รายงานสรุปการขาย";
                        titleSecondLine = "ตามประเภทเอกสาร";
                }

                if (title.equals("รายงานรายละเอียดการขายตามเอกสาร")) {
                        _printerCoreManager.addText("รายงานรายละเอียดการขายตาม", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();
                        _printerCoreManager.addText("เอกสาร", 50, PrinterConst.ALIGN_CENTER);
                        _printerCoreManager.flushText();
                } else {
                        _printerCoreManager.addText(title, 50, PrinterConst.ALIGN_CENTER);
                        _printerCoreManager.flushText();
                }

                if (!titleSecondLine.equals("")) {
                        _printerCoreManager.addText(titleSecondLine, 50, PrinterConst.ALIGN_CENTER);
                        _printerCoreManager.flushText();
                }

                _printerCoreManager.addText("ทะเบียนรถ:", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(regName, 35, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ชื่อพนักงาน:", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(slmnName, 35, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("วันที่ " + dateFrom + " ถึง " + dateTo, 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เวลาที่พิมพ์: " + printTime, 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                return true;
        }

        private boolean printHeaderReportPatternC(String title, String regName, String slmnName, String dateFrom,
                        String printTime) throws Exception {

                String titleSecondLine = "";

                if (title.equals("รายงานประสิทธิภาพยอดขาย ตามพนักงานขาย")
                                && _printerCoreManager.getModel() == PrinterConst.ZIJIANG
                                && _printerCoreManager.getPaperWidth() == PrinterConst.PAPER_WIDTH_58MM) {
                        title = "รายงานประสิทธิภาพยอดขาย";
                        titleSecondLine = "ตามพนักงานขาย";
                }

                if (title.equals("รายงานสรุปสินค้าคงเหลือ ตามตำแหน่งเก็บ")
                                && _printerCoreManager.getModel() == PrinterConst.ZIJIANG
                                && _printerCoreManager.getPaperWidth() == PrinterConst.PAPER_WIDTH_58MM) {
                        title = "รายงานสรุปสินค้าคงเหลือ";
                        titleSecondLine = "ตามตำแหน่งเก็บ";
                }

                _printerCoreManager.addText(title, 50, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.flushText();

                if (!titleSecondLine.equals("")) {
                        _printerCoreManager.addText(titleSecondLine, 50, PrinterConst.ALIGN_CENTER);
                        _printerCoreManager.flushText();
                }

                _printerCoreManager.addText("ทะเบียนรถ:", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(regName, 35, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ชื่อพนักงาน:", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(slmnName, 35, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ณ.วันที่ " + dateFrom, 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เวลาที่พิมพ์: " + printTime, 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                return true;
        }

        public boolean printPaymentReceipt(Map<String, Object> header, Map<String, Object> createHeader,
                        Object[] createItems, Map<String, Object> vanConfig, Map<String, Object> companyInfo,
                        Map<String, Object> customerInfo, String printTime, String printType) throws Exception {
                if (!_printerCoreManager.isConnected())
                        return false;

                _printerCoreManager.setPaperWidth(((Double) vanConfig.get("VANCNF_FRM_ALLCONFIG")).intValue());

                _printerCoreManager.setBold(false);

                String headerPayment = printType;

                Double vanConfigShowVat = (Double) vanConfig.get("VANCNF_SHOW_VAT");
                Double vanConfigRound = (Double) vanConfig.get("VANCNF_ROUND");
                Double vanConfigprintADDB = new Double(1);// first way

                String brachPrefix = "สาขา ";
                String[] companyNameArr = companyInfo.get("CMPNY_TCOMPANYNAME").toString().split("สาขา", 2);

                if (companyNameArr.length <= 1) {
                        companyNameArr = companyInfo.get("CMPNY_TCOMPANYNAME").toString().split("สำนักงานใหญ่", 2);

                        if (companyNameArr.length == 2) {
                                companyNameArr[1] = "สำนักงานใหญ่";
                        }

                        brachPrefix = "";
                }

                for (int k = 0; k < companyNameArr.length; k++) {
                        String companyName = companyNameArr[k];
                        if ((companyNameArr.length - 1) == k) {
                                companyName = brachPrefix + companyName;
                        }
                        Log.i("companyName", companyName);
                        _printerCoreManager.addText(companyName, 50, PrinterConst.ALIGN_CENTER, false);
                        _printerCoreManager.flushText();

                }

                switch (printType) {
                        case "credit":
                                vanConfigprintADDB = (Double) vanConfig.get("VANCNF_INV_ADDB");
                                break;
                        case "cash":
                                vanConfigprintADDB = (Double) vanConfig.get("VANCNF_CASHSALES_ADDB");
                                break;
                        // case '':
                        // vanConfigprintADDB = vanConfig.VANCNF_PREPRCPT_ADDB;
                        // break;
                        default:
                                vanConfigprintADDB = new Double(1);// first way
                                break;
                }

                if (vanConfigShowVat.intValue() == 1) {
                        if (vanConfigprintADDB.intValue() == 1) {

                                if (companyInfo.get("CMPNY_TADDRESS_1") != null
                                                && !companyInfo.get("CMPNY_TADDRESS_1").equals("")) {
                                        _printerCoreManager.addText(companyInfo.get("CMPNY_TADDRESS_1").toString(), 50,
                                                        PrinterConst.ALIGN_CENTER, false);
                                        _printerCoreManager.flushText();
                                }

                                if (companyInfo.get("CMPNY_TADDRESS_2") != null
                                                && !companyInfo.get("CMPNY_TADDRESS_2").equals("")) {
                                        _printerCoreManager.addText(companyInfo.get("CMPNY_TADDRESS_2").toString(), 50,
                                                        PrinterConst.ALIGN_CENTER, false);
                                        _printerCoreManager.flushText();
                                }

                                if (companyInfo.get("CMPNY_TADDRESS_3") != null
                                                && !companyInfo.get("CMPNY_TADDRESS_3").equals("")) {
                                        _printerCoreManager.addText(companyInfo.get("CMPNY_TADDRESS_3").toString(), 50,
                                                        PrinterConst.ALIGN_CENTER, false);
                                        _printerCoreManager.flushText();
                                }
                                if (companyInfo.get("CMPNY_TSUB_DISTRICT") != null
                                                && !companyInfo.get("CMPNY_TSUB_DISTRICT").equals("")) {
                                        _printerCoreManager.addText(companyInfo.get("CMPNY_TSUB_DISTRICT").toString(),
                                                        50,
                                                        PrinterConst.ALIGN_CENTER, false);
                                        _printerCoreManager.flushText();
                                }
                                if (companyInfo.get("CMPNY_TDISTRICT") != null
                                                && !companyInfo.get("CMPNY_TDISTRICT").equals("")) {
                                        _printerCoreManager.addText(companyInfo.get("CMPNY_TDISTRICT").toString(), 50,
                                                        PrinterConst.ALIGN_CENTER, false);
                                        _printerCoreManager.flushText();
                                }

                                if ((companyInfo.get("CMPNY_TPROVINCE") != null
                                                && !companyInfo.get("CMPNY_TPROVINCE").equals(""))
                                                && (companyInfo.get("CMPNY_POST") != null
                                                                && !companyInfo.get("CMPNY_POST").equals(""))) {

                                        _printerCoreManager.addText(companyInfo.get("CMPNY_TPROVINCE").toString(), 50,
                                                        PrinterConst.ALIGN_CENTER, false);
                                        _printerCoreManager.flushText();
                                        _printerCoreManager.addText(companyInfo.get("CMPNY_POST").toString(), 50,
                                                        PrinterConst.ALIGN_CENTER, false);
                                        _printerCoreManager.flushText();
                                }
                                String CMPNY_REG_NO = companyInfo.get("CMPNY_REG_NO").toString();
                                if (CMPNY_REG_NO != null || !CMPNY_REG_NO.trim().equals("")) {
                                        _printerCoreManager.addText("เลขผู้เสียภาษี: " + CMPNY_REG_NO, 50,
                                                        PrinterConst.ALIGN_CENTER, false);
                                        _printerCoreManager.flushText();
                                }
                        }

                }

                _printerCoreManager.addText(headerPayment, 50, PrinterConst.ALIGN_CENTER);
                _printerCoreManager.flushText();

                _printerCoreManager.addText(customerInfo.get("AR_NAME").toString(), 1, PrinterConst.ALIGN_LEFT, false);
                _printerCoreManager.flushText();

                String addbBranch = customerInfo.get("ADDB_BRANCH") != null
                                && !customerInfo.get("ADDB_BRANCH").toString().equals("")
                                                ? "สาขา " + customerInfo.get("ADDB_BRANCH").toString()
                                                : "";

                if (!addbBranch.equals("")) {
                        _printerCoreManager.addText(addbBranch, 1, PrinterConst.ALIGN_LEFT, false);
                        _printerCoreManager.flushText();
                }

                if (customerInfo.get("ADDB_ADDB_1") != null && !customerInfo.get("ADDB_ADDB_1").toString().equals("")) {
                        _printerCoreManager.addText(customerInfo.get("ADDB_ADDB_1").toString(), 1,
                                        PrinterConst.ALIGN_LEFT, false);
                        _printerCoreManager.flushText();
                }

                if (customerInfo.get("ADDB_ADDB_2") != null && !customerInfo.get("ADDB_ADDB_2").toString().equals("")) {
                        _printerCoreManager.addText(customerInfo.get("ADDB_ADDB_2").toString(), 1,
                                        PrinterConst.ALIGN_LEFT, false);
                        _printerCoreManager.flushText();
                }

                if (customerInfo.get("ADDB_ADDB_3") != null && !customerInfo.get("ADDB_ADDB_3").toString().equals("")) {
                        _printerCoreManager.addText(customerInfo.get("ADDB_ADDB_3").toString(), 1,
                                        PrinterConst.ALIGN_LEFT, false);
                        _printerCoreManager.flushText();
                }

                String addressADDB4 = "";

                addressADDB4 = customerInfo.get("ADDB_PROVINCE") != null
                                && !customerInfo.get("ADDB_PROVINCE").toString().equals("")
                                                ? customerInfo.get("ADDB_PROVINCE").toString()
                                                : "";

                addressADDB4 = customerInfo.get("ADDB_POST") != null
                                && !customerInfo.get("ADDB_POST").toString().equals("")
                                                ? addressADDB4 + " " + customerInfo.get("ADDB_POST").toString()
                                                : addressADDB4;

                if (!addressADDB4.equals("")) {
                        _printerCoreManager.addText(addressADDB4, 1, PrinterConst.ALIGN_LEFT, false);
                        _printerCoreManager.flushText();
                }
                String ADDB_TAX_ID = customerInfo.get("ADDB_TAX_ID").toString();

                if (ADDB_TAX_ID != null && !ADDB_TAX_ID.trim().equals("")) {
                        _printerCoreManager.addText("เลขผู้เสียภาษี: " + ADDB_TAX_ID, 1, PrinterConst.ALIGN_LEFT,
                                        false);
                        _printerCoreManager.flushText();
                }

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                String[] dateStr = header.get("VDI_DATE").toString().split("T");
                dateStr = dateStr[0].split(":");

                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                SimpleDateFormat dateFormat2 = new SimpleDateFormat("dd/MM/yyyy");

                Calendar calender = Calendar.getInstance();
                Date receiptdate = dateFormat.parse(dateStr[0]);

                calender.setTime(receiptdate);
                calender.add(Calendar.YEAR, 543);

                _printerCoreManager.addText("วันที่ " + dateFormat2.format(calender.getTime()), 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("เวลา " + printTime, 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("เลขที่ " + createHeader.get("VPH_USER_REF").toString(), 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("รายละเอียด", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText("ยอดเงิน", 100, PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                for (int i = 0; i < createItems.length; i++) {
                        Map<String, Object> item = (Map<String, Object>) createItems[i];

                        _printerCoreManager.addText(item.get("VPD_DIREF").toString(), 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(item.get("VPD_PAY")), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("รวมทั้งหมด", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(decimal2digitWithCommas.format(createHeader.get("VPH_TOTAL_B4ROUND")), 100,
                                PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("หลังปัดเศษ", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.addText(decimal2digitWithCommas.format(createHeader.get("VPH_TOTAL_AFROUND")), 100,
                                PrinterConst.ALIGN_RIGHT);
                _printerCoreManager.flushText();

                if (((Double) createHeader.get("VPH_CASH_AMT")).intValue() > 0) {
                        _printerCoreManager.addText("รับชำระ(เงินสด)", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(createHeader.get("VPH_CASH_AMT")),
                                        100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                if (((Double) createHeader.get("VPH_TRANSFER_AMT")).intValue() > 0) {
                        _printerCoreManager.addText("รับชำระ(โอน)", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas.format(createHeader.get("VPH_TRANSFER_AMT")), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText(createHeader.get("VPH_TRANSFER_BANK_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();
                }

                if (((Double) createHeader.get("VPH_TRANSFER_QR_AMT")).intValue() > 0) {
                        _printerCoreManager.addText("รับชำระ(QRCode)", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        decimal2digitWithCommas.format(createHeader.get("VPH_TRANSFER_QR_AMT")), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                if (((Double) createHeader.get("VPH_CHEQUE1_AMT")).intValue() > 0) {
                        _printerCoreManager.addText("รับชำระ (เช็ค1) ", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(createHeader.get("VPH_CHEQUE1_AMT")),
                                        100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText(createHeader.get("VPH_CHEQUE1_BANK_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("เลขที่ ", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(createHeader.get("VPH_CHEQUE1_NO").toString(), 18,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText("วันที่", 51, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        convertJSONDateToString(createHeader.get("VPH_CHEQUE1_DATE").toString()), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                if (((Double) createHeader.get("VPH_CHEQUE2_AMT")).intValue() > 0) {
                        _printerCoreManager.addText("รับชำระ (เช็ค2) ", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(createHeader.get("VPH_CHEQUE2_AMT")),
                                        100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText(createHeader.get("VPH_CHEQUE2_BANK_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("เลขที่ ", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(createHeader.get("VPH_CHEQUE2_NO").toString(), 18,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText("วันที่", 51, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        convertJSONDateToString(createHeader.get("VPH_CHEQUE2_DATE").toString()), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                if (((Double) createHeader.get("VPH_CHEQUE3_AMT")).intValue() > 0) {
                        _printerCoreManager.addText("รับชำระ (เช็ค3) ", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(decimal2digitWithCommas.format(createHeader.get("VPH_CHEQUE3_AMT")),
                                        100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText(createHeader.get("VPH_CHEQUE3_BANK_NAME").toString(), 1,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.flushText();

                        _printerCoreManager.addText("เลขที่ ", 1, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(createHeader.get("VPH_CHEQUE3_NO").toString(), 18,
                                        PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText("วันที่", 51, PrinterConst.ALIGN_LEFT);
                        _printerCoreManager.addText(
                                        convertJSONDateToString(createHeader.get("VPH_CHEQUE3_DATE").toString()), 100,
                                        PrinterConst.ALIGN_RIGHT);
                        _printerCoreManager.flushText();
                }

                _printerCoreManager.addText("________________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ได้รับชำระค่าสินค้าข้างต้นเรียบร้อยแล้ว", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ผู้รับเงิน", 1, PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addText("ลงชื่อ______________________________________________", 1,
                                PrinterConst.ALIGN_LEFT);
                _printerCoreManager.flushText();

                _printerCoreManager.addPageEnd();

                _printerCoreManager.sendData();

                _printerCoreManager.addPageEnd();

                _printerCoreManager.addCut();

                _printerCoreManager.sendData();

                return true;
        }

        public String convertJSONDateToString(String JSONDate) throws Exception {
                String[] dateStr = JSONDate.toString().split("T");
                dateStr = dateStr[0].split(":");

                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                SimpleDateFormat dateFormat2 = new SimpleDateFormat("dd/MM/yyyy");

                Calendar calender = Calendar.getInstance();
                Date receiptdate = dateFormat.parse(dateStr[0]);

                calender.setTime(receiptdate);
                calender.add(Calendar.YEAR, 543);

                return dateFormat2.format(calender.getTime());

        }
}
