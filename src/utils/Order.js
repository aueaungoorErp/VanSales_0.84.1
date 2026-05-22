import moment from 'moment';

export const generateHeader = (customer, orderType) => {
  result = {
    VDI_KEY: customer.AR_KEY,
    VDI_DATE: moment().format(),
    VDI_REF: null,
    VDI_AR: customer.AR_KEY,
    VDI_PROPERTIES: null,
    VDI_ACTIVE: null,
    VDI_CRE_DATE: null,
    VDI_UPD_DATE: null,
    VDI_DEL_DATE: null,
    VDI_1ST_ITEMS: null,
    VDI_1ST_PCS: null,
    VDI_1ST_AMOUNT: null,
    VDI_1ST_PMT: null,
    VDI_ITEMS: null,
    VDI_PCS: null,
    VDI_AMOUNT: null,
    VDI_AF_ROUND: null,
    VDI_PMT: null,
    VDI_MILE: null,
    VDI_SHIP_DATE: null,
    VDI_EXP_DATE: null,
    VDI_MACHINE: null,
    VDI_DISC_1: null,
    VDI_DISC_2: null,
    VDI_DISC_V1: null,
    VDI_DISC_V2: null,
    VDI_AF_DISC: null,
    VDI_BANK: null,
    VDI_BANK_NAME: null,
    VDI_CHEQUE_DATE: null,
    VDI_CHEQUE_NO: null,
    VDI_VISIT: null,
    VDI_GPS_LAT_S: null,
    VDI_GPS_LONG_S: null,
    VDI_GPS_LAT_V: null,
    VDI_GPS_LONG_V: null,
    VDI_GPS_DATE_S: null,
    VDI_GPS_DISTANCE: null,
    VDI_PRN_TIME: null,
    VDI_PRN_DATE: null,
    VDI_ANS_1: null,
    VDI_ANS_2: null,
    VDI_ANS_3: null,
    VDI_ANS_4: null,
    VDI_ANS_5: null,
    VDI_ANS_6: null,
    VDI_ANS_7: null,
    VDI_ANS_8: null,
    VDI_WL: null,
    VDI_USER_REF: null,
    VDI_VANCNF_KEY: null,
    AR_NAME: customer.AR_NAME,
    AR_CODE: customer.AR_CODE,
    AR_ORDER_TYPE: orderType,
    ADDB_ADDB_1: customer.ADDB_ADDB_1,
    ADDB_ADDB_2: customer.ADDB_ADDB_2,
    ADDB_ADDB_3: customer.ADDB_ADDB_3,
    ADDB_SUB_DISTRICT: customer.ADDB_SUB_DISTRICT,
    ADDB_DISTRICT: customer.ADDB_DISTRICT,
  };

  return result;
};

export const generateHeaderStockTransfer = (dropPoint, orderType) => {
  result = {
    VDI_KEY: dropPoint.WL_KEY,
    VDI_DATE: moment().format(),
    VDI_REF: null,
    VDI_AR: dropPoint.WL_KEY,
    VDI_PROPERTIES: null,
    VDI_ACTIVE: null,
    VDI_CRE_DATE: null,
    VDI_UPD_DATE: null,
    VDI_DEL_DATE: null,
    VDI_1ST_ITEMS: null,
    VDI_1ST_PCS: null,
    VDI_1ST_AMOUNT: null,
    VDI_1ST_PMT: null,
    VDI_ITEMS: null,
    VDI_PCS: null,
    VDI_AMOUNT: null,
    VDI_AF_ROUND: null,
    VDI_PMT: null,
    VDI_MILE: null,
    VDI_SHIP_DATE: null,
    VDI_EXP_DATE: null,
    VDI_MACHINE: null,
    VDI_DISC_1: null,
    VDI_DISC_2: null,
    VDI_DISC_V1: null,
    VDI_DISC_V2: null,
    VDI_AF_DISC: null,
    VDI_BANK: null,
    VDI_CHEQUE_DATE: null,
    VDI_CHEQUE_NO: null,
    VDI_VISIT: null,
    VDI_GPS_LAT_S: null,
    VDI_GPS_LONG_S: null,
    VDI_GPS_LAT_V: null,
    VDI_GPS_LONG_V: null,
    VDI_GPS_DATE_S: null,
    VDI_GPS_DISTANCE: null,
    VDI_PRN_TIME: null,
    VDI_PRN_DATE: null,
    VDI_ANS_1: null,
    VDI_ANS_2: null,
    VDI_ANS_3: null,
    VDI_ANS_4: null,
    VDI_ANS_5: null,
    VDI_ANS_6: null,
    VDI_ANS_7: null,
    VDI_ANS_8: null,
    VDI_WL: dropPoint.WL_KEY,
    VDI_USER_REF: null,
    VDI_VANCNF_KEY: null,
    AR_NAME: dropPoint.WL_NAME,
    AR_CODE: dropPoint.WL_CODE,
    AR_ORDER_TYPE: orderType,
    ADDB_ADDB_1: null,
    ADDB_ADDB_2: null,
    ADDB_ADDB_3: null,
    WL_WH: dropPoint.WL_WH,
    WH_NAME: dropPoint.WH_NAME,
  };

  return result;
};
export const generateHeaderStockTransferV3 = (FROM, TO, orderType) => {
  result = {
    VDI_DATE: moment().format(),
    FROM: FROM,
    TO: TO,
    AR_ORDER_TYPE: orderType,
  };

  return result;
};

export const generateHeaderForUpdate = (
  customer,
  header,
  orderType,
  orderSubType,
) => {
  result = {
    ...header,
    VDI_KEY: customer.AR_KEY,
    AR_NAME: customer.AR_NAME,
    AR_CODE: customer.AR_CODE,
    AR_ORDER_TYPE: orderType,
    AR_ORDER_SUB_TYPE: orderSubType,
    ADDB_ADDB_1: customer.ADDB_ADDB_1,
    ADDB_ADDB_2: customer.ADDB_ADDB_2,
    ADDB_ADDB_3: customer.ADDB_ADDB_3,
    ADDB_SUB_DISTRICT: customer.ADDB_SUB_DISTRICT,
    ADDB_DISTRICT: customer.ADDB_DISTRICT,
    VDI_DATE: header.VDI_DATE,
  };

  return result;
};

export const convertProductItemToOrderItem = (item, ignoreCpgn) => {
  console.log('convertProductItemToOrderItem b ', item);
  // return;
  result = {
    VTRD_KEY: null,
    VTRD_DI: null,
    VTRD_GOODS: null,
    VTRD_CODE: item.GOODS_CODE,
    VTRD_NAMES: item.GOODS_NAME,
    VTRD_UTQ_NAME: item.UTQ_NAME,
    VTRD_UTQ_QTY: item.UTQ_QTY, // Bazz
    VTRD_QTY: item.GOODS_QTY,
    VTRD_U_PRC: null,
    VTRD_U_PRC_KEYIN: item.ARPLU_U_PRC,
    VTRD_U_DSC: null,
    VTRD_U_STEP: null,
    VTRD_CPSKU_PRC: null,
    VTRD_CPALT_PRC: null,
    VTRD_Q_FREE: item.GOODS_FREE,
    VTRD_CPSKU_QTY: null,
    VTRD_CPALT_QTY: null,
    VTRD_CPAKU_QTY: null,
    VTRD_B4_VAT: null,
    VTRD_VAT: item.GOODS_VAT,
    VTRD_VALUES: null,
    VTRD_VAT_TY: null,
    VTRD_TDSC_V: null,
    VTRD_AF_SELL: null,
    VTRD_AF_VAT: null,
    VTRD_AF_VALUES: null,
    VTRD_AUTO: null,
    VTRD_U_DISC_TEXT: item.GOODS_DISCOUNT,
    VTRD_VALUES_G_SELL: null,
    VTRD_VALUES_G_VAT: null,
    VTRD_VALUES_G_AMT: null,
    VTRD_VALUES_B_VAT_B_DISC: null,
    VTRD_VALUES_C_B_VAT: null,
    VTRD_VALUES_C_A_VAT: null,
    VTRD_VALUES_C_VAT: null,
    VTRD_VANCNF_KEY: null,
    ICDEPT_THAIDESC: null,
    GOODS_TOTAL_PRC: item.GOODS_TOTAL_PRC,
    GOODS_TOTAL_DISCOUNT: item.GOODS_TOTAL_DISCOUNT,
    GOODS_NET_PRC: item.GOODS_NET_PRC,
    VTRD_SH_VALUES: null,
    IGNORE_CPGN: ignoreCpgn,
    TMP_GOOD_QTY: item.TMP_GOOD_QTY,
    TMP_GOOD_MODEL: 4,
    good_inVan_qty: item.good_inVan_qty,
  };

  return result;
};

export const convertProductItemToOrderItemSCR = (items, ignoreCpgn) => {
  console.log('convertProductItemToOrderItemSCR items');
  const result = items.map((item) => {
    return {
      VTRD_KEY: null,
      VTRD_DI: null,
      VTRD_GOODS: null,
      VTRD_CODE: item.GOODS_CODE,
      VTRD_NAMES: item.GOODS_NAME ? item.GOODS_NAME : item.SKU_NAME,
      VTRD_QTY: item.GOODS_QTY,
      VTRD_U_PRC: null,
      VTRD_U_PRC_KEYIN: item.ARPLU_U_PRC,
      VTRD_U_DSC: null,
      VTRD_U_STEP: null,
      VTRD_CPSKU_PRC: null,
      VTRD_CPALT_PRC: null,
      VTRD_Q_FREE: item.GOODS_FREE,
      VTRD_CPSKU_QTY: null,
      VTRD_CPALT_QTY: null,
      VTRD_CPAKU_QTY: null,
      VTRD_B4_VAT: null,
      VTRD_VAT: item.GOODS_VAT,
      VTRD_VALUES: null,
      VTRD_VAT_TY: null,
      VTRD_TDSC_V: null,
      VTRD_AF_SELL: null,
      VTRD_AF_VAT: null,
      VTRD_AF_VALUES: null,
      VTRD_AUTO: item.VTRD_AUTO,
      VTRD_U_DISC_TEXT: item.GOODS_DISCOUNT,
      VTRD_VALUES_G_SELL: null,
      VTRD_VALUES_G_VAT: null,
      VTRD_VALUES_G_AMT: null,
      VTRD_VALUES_B_VAT_B_DISC: null,
      VTRD_VALUES_C_B_VAT: null,
      VTRD_VALUES_C_A_VAT: null,
      VTRD_VALUES_C_VAT: null,
      VTRD_VANCNF_KEY: null,
      ICDEPT_THAIDESC: null,
      GOODS_TOTAL_PRC: item.GOODS_TOTAL_PRC,
      GOODS_TOTAL_DISCOUNT: item.GOODS_TOTAL_DISCOUNT,
      GOODS_NET_PRC: item.GOODS_NET_PRC,
      VTRD_SH_VALUES: item.VTRD_SH_VALUES,
      IGNORE_CPGN: ignoreCpgn,
      SKU_ALT: item.SKU_ALT,
      TMP_GOOD_QTY: item.TMP_GOOD_QTY,
      TMP_GOOD_MODEL: 5,
      good_inVan_qty: item.good_inVan_qty,
    };
  });

  return result;
};

export const convertProductItemsToOrderItems = (items, ignoreCpgn) => {
  console.log('convertProductItemsToOrderItems items');
  const result = items.map((item) => {
    return {
      VTRD_KEY: null,
      VTRD_DI: null,
      VTRD_GOODS: null,
      VTRD_CODE: item.GOODS_CODE,
      VTRD_NAMES: item.GOODS_NAME ? item.GOODS_NAME : item.SKU_NAME,
      VTRD_QTY: item.GOODS_QTY,
      VTRD_U_PRC: null,
      VTRD_U_PRC_KEYIN: item.ARPLU_U_PRC,
      VTRD_U_DSC: null,
      VTRD_U_STEP: null,
      VTRD_CPSKU_PRC: null,
      VTRD_CPALT_PRC: null,
      VTRD_Q_FREE: item.GOODS_FREE,
      VTRD_CPSKU_QTY: null,
      VTRD_CPALT_QTY: null,
      VTRD_CPAKU_QTY: null,
      VTRD_B4_VAT: null,
      VTRD_VAT: item.GOODS_VAT,
      VTRD_VALUES: null,
      VTRD_VAT_TY: null,
      VTRD_TDSC_V: null,
      VTRD_AF_SELL: null,
      VTRD_AF_VAT: null,
      VTRD_AF_VALUES: null,
      VTRD_AUTO: null,
      VTRD_U_DISC_TEXT: item.GOODS_DISCOUNT,
      VTRD_VALUES_G_SELL: null,
      VTRD_VALUES_G_VAT: null,
      VTRD_VALUES_G_AMT: null,
      VTRD_VALUES_B_VAT_B_DISC: null,
      VTRD_VALUES_C_B_VAT: null,
      VTRD_VALUES_C_A_VAT: null,
      VTRD_VALUES_C_VAT: null,
      VTRD_VANCNF_KEY: null,
      ICDEPT_THAIDESC: item.ICDEPT_THAIDESC,
      GOODS_TOTAL_PRC: item.GOODS_TOTAL_PRC,
      GOODS_TOTAL_DISCOUNT: item.GOODS_TOTAL_DISCOUNT,
      GOODS_NET_PRC: item.GOODS_NET_PRC,
      VTRD_SH_VALUES: item.VTRD_SH_VALUES,
      IGNORE_CPGN: ignoreCpgn,
      SKU_ALT: item.SKU_ALT,
      TMP_GOOD_QTY: item.TMP_GOOD_QTY,
      TMP_GOOD_MODEL: 6,
      good_inVan_qty: item.good_inVan_qty,
    };
  });

  return result;
};

export const convertProductItemLastBillToOrderItem = (items) => {
  console.log('convertProductItemLastBillToOrderItem items', items);
  return items.map((item, key) => {
    return (result = {
      VTRD_KEY: item.TRD_SKU, //
      VTRD_DI: item.DI_KEY, //

      VTRD_GOODS: item.TRD_GOODS, //
      VTRD_CODE: item.GOODS_CODE, // รหัสสินค้า หน้าแสดงรายการ
      VTRD_NAMES: item.SKU_NAME, // ชื่อสินค้า หน้าแสดงรายการ
      VTRD_QTY: item.TRD_QTY, //  จำนวน หน้าแสดงรายการ
      VTRD_U_PRC: item.TRD_U_PRC, //
      VTRD_U_PRC_KEYIN: item.TRD_U_PRC, //ราคาต่อหน่วย หน้าแสดงรายการ
      VTRD_UTQ_NAME: item.TRD_UTQNAME, //
      VTRD_UTQQTY: item.TRD_UTQQTY, //
      VTRD_U_DSC: item.TRD_DSC_KEYINV, //
      // VTRD_U_STEP: item.VTRD_U_STEP,
      // VTRD_CPSKU_PRC: item.VTRD_CPSKU_PRC,
      // VTRD_CPALT_PRC: item.VTRD_CPALT_PRC,
      VTRD_Q_FREE: item.TRD_Q_FREE, // แถม หน้าแสดงรายการ
      // VTRD_CPSKU_QTY: item.VTRD_CPSKU_QTY,
      // VTRD_CPALT_QTY: item.VTRD_CPALT_QTY,
      // VTRD_CPAKU_QTY: item.VTRD_CPAKU_QTY,
      // VTRD_B4_VAT: item.VTRD_B4_VAT,
      VTRD_VAT: item.TRD_VAT, //
      // VTRD_VALUES: item.VTRD_VALUES,
      VTRD_VAT_TY: item.TRD_VAT_TY, //
      VTRD_TDSC_V: item.TRD_DSC_KEYIN, // ส่วนลด หน้าแสดงรายการ
      // VTRD_AF_SELL: item.VTRD_AF_SELL,
      // VTRD_AF_VAT: item.VTRD_AF_VAT,
      VTRD_AF_VALUES: item.TRD_G_AMT,
      // VTRD_AUTO: item.VTRD_AUTO,
      VTRD_U_DISC_TEXT: item.TRD_DSC_KEYIN,
      VTRD_VALUES_G_SELL: item.TRD_G_SELL, //
      VTRD_VALUES_G_VAT: item.TRD_G_VAT, //
      VTRD_VALUES_G_AMT: item.TRD_G_AMT, //
      // VTRD_VALUES_B_VAT_B_DISC: item.VTRD_VALUES_B_VAT_B_DISC,
      // VTRD_VALUES_C_B_VAT: item.VTRD_VALUES_C_B_VAT,
      // VTRD_VALUES_C_A_VAT: item.VTRD_VALUES_C_A_VAT,
      // VTRD_VALUES_C_VAT: item.VTRD_VALUES_C_VAT,
      // VTRD_VANCNF_KEY: item.VTRD_VANCNF_KEY,
      // ICDEPT_THAIDESC: "xxxxxxxx",
      GOODS_TOTAL_PRC: item.TRD_G_AMT, //ราคารวม หน้าแสดงรายการ
      GOODS_TOTAL_DISCOUNT: item.TRD_DSC_KEYINV, //
      GOODS_NET_PRC: item.TRD_N_AMT, //
      VTRD_SH_VALUES: item.TRD_N_AMT, //
      FROMWL_CODE: item.FROMWL_CODE,
      FROMWL_NAME: item.FROMWL_NAME,
      TOWL_CODE: item.TOWL_CODE,
      TOWL_NAME: item.TOWL_NAME,
      TRD_WL: item.TRD_WL,
      TMP_GOOD_QTY: item.TMP_GOOD_QTY,
      TMP_GOOD_MODEL: 7,
      good_inVan_qty: item.good_inVan_qty,
    });
  });
};

export const convertOrderItemToProductItem = (item) => {
  console.log('convertOrderItemToProductItem item', item);
  result = {
    ICDEPT_THAIDESC: item.ICDEPT_THAIDESC,
    GOODS_CODE: item.VTRD_CODE,
    GOODS_NAME: item.VTRD_NAMES,
    UTQ_NAME: item.VTRD_UTQ_NAME,
    SKU_CODE: null,
    SKUALT_CODE: null,
    UTQ_QTY: item.VTRD_UTQ_QTY,
    ARPLU_U_PRC: item.VTRD_U_PRC_KEYIN,
    GOODS_DISCOUNT: item.VTRD_U_DISC_TEXT,
    GOODS_TOTAL_DISCOUNT: item.GOODS_TOTAL_DISCOUNT,
    GOODS_QTY: item.VTRD_QTY,
    GOODS_TOTAL_PRC: item.GOODS_TOTAL_PRC,
    GOODS_FREE: item.VTRD_Q_FREE,
    GOODS_NET_PRC: item.GOODS_NET_PRC,
    VTRD_SH_VALUES: item.VTRD_SH_VALUES,
    GOODS_VAT: item.VTRD_VAT,
    good_inVan_qty: item.good_inVan_qty,
    TMP_GOOD_QTY: item.TMP_GOOD_QTY,
    TMP_GOOD_MODEL: 8,
  };

  return result;
};

export const convertOrderItemsToProductItems = (items) => {
  console.log('convertOrderItemsToProductItems items', items);
  return items.map((item, key) => {
    return {
      ICDEPT_THAIDESC: item.ICDEPT_THAIDESC,
      GOODS_CODE: item.VTRD_CODE,
      GOODS_NAME: item.VTRD_NAMES,
      UTQ_NAME: null,
      SKU_CODE: null,
      SKUALT_CODE: null,
      UTQ_QTY: null,
      ARPLU_U_PRC: item.VTRD_U_PRC_KEYIN,
      GOODS_DISCOUNT: item.VTRD_U_DISC_TEXT,
      GOODS_TOTAL_DISCOUNT: item.GOODS_TOTAL_DISCOUNT,
      GOODS_QTY: item.VTRD_QTY,
      GOODS_TOTAL_PRC: item.GOODS_TOTAL_PRC,
      GOODS_FREE: item.VTRD_Q_FREE,
      GOODS_NET_PRC: item.GOODS_NET_PRC,
      VTRD_SH_VALUES: item.VTRD_SH_VALUES,
      GOODS_VAT: item.VTRD_VAT,
      good_inVan_qty: item.good_inVan_qty,
      TMP_GOOD_QTY: item.TMP_GOOD_QTY,
      TMP_GOOD_MODEL: 9,
    };
  });
};

export const convertProductItemFromServerProcessV3 = (item) => {
  console.log('convertProductItemFromServerProcessV3 itemห', item);
  console.log('convertProductItemFromServerProcessV3 includes', item.GOODS_QTY + '*' + parseFloat(item.GOODS_DISCOUNT) + 'B');
  console.log('convertProductItemFromServerProcessV3 includes', item.GOODS_DISCOUNT);


  result = {
    TRD_KEYIN: item.GOODS_CODE /* Any key in for lookup*/,
    TRD_QTY: parseFloat(item.GOODS_QTY).toFixed(2),
    TRD_Q_FREE: item.GOODS_FREE
      ? parseFloat(item.GOODS_FREE).toFixed(2)
      : '' /* จำนวนแถม*/,
    TRD_K_U_PRC: parseFloat(item.ARPLU_U_PRC).toFixed(
      3,
    ) /* ราคาที่ใช้ขายในบิลนี้*/,
    TRD_DSC_KEYIN: item.GOODS_DISCOUNT ?
      (item.GOODS_DISCOUNT.includes('B') && item.GOODS_DISCOUNT.includes('*')) ?
        (
          (
            item.GOODS_DISCOUNT != parseFloat(item.GOODS_DISCOUNT.split('*')[0]) + '*' + item.GOODS_QTY + 'B'
          ) ?
            parseFloat(item.GOODS_DISCOUNT.split('*')[0]) + '*' + item.GOODS_QTY + 'B' :
            item.GOODS_DISCOUNT
        ) :
        parseFloat(item.GOODS_DISCOUNT) + '*' + item.GOODS_QTY + 'B' :
      '0' /* ส่วนลดตามที่บันทึกจากจอภาพ*/,
    TRD_WL: '01' /* ตำแหน่งเก็บที่เก็บสินค้า*/,
    TRD_TO_WL: '' /* เฉพาะกรณีย้ายตำแหน่งเก็บ ให้ทำการระบุคลังที่รับย้าย*/,
    TRD_OPTION: '',
    TRD_U_VATIO: '2' /* 0 ไม่ได้ใช้ 1 ยังไม่รวมภพ 2 รวมภพแล้ว*/,
    X_MODEL: 2,
  };
  console.log('result', result);
  return result;
};
export const convertProductItemFromServerProcess2V3 = (item) => {
  console.log('convertProductItemFromServerProcess2V3 item ', item);
  result = {
    TRD_KEYIN: item.VTRD_CODE,
    TRD_QTY: parseFloat(item.VTRD_QTY).toFixed(2),
    TRD_Q_FREE: parseFloat(item.VTRD_Q_FREE).toFixed(2),
    // TRD_DSC_KEYIN: item.VTRD_U_DISC_TEXT
    //   ? parseFloat(item.VTRD_U_DISC_TEXT).toFixed(2)
    //   : parseFloat(item.VTRD_U_DSC).toFixed(2),
    TRD_DSC_KEYIN: item.VTRD_U_DISC_TEXT
      ? parseFloat(item.VTRD_U_DISC_TEXT) + '*' + (item.VTRD_QTY) + 'B'
      : parseFloat(item.VTRD_U_DSC) + '*' + (item.VTRD_QTY) + 'B',
    TRD_K_U_PRC: parseFloat(item.VTRD_U_PRC_KEYIN).toFixed(2),
    TRD_WL: item.FROMWL_CODE
      ? item.FROMWL_CODE
      : '' /* ตำแหน่งเก็บที่เก็บสินค้า*/,
    TRD_TO_WL: item.TOWL_CODE
      ? item.TOWL_CODE
      : '' /* เฉพาะกรณีย้ายตำแหน่งเก็บ ให้ทำการระบุคลังที่รับย้าย*/,
    TRD_OPTION: '',
    TRD_U_VATIO: '2' /* 0 ไม่ได้ใช้ 1 ยังไม่รวมภพ 2 รวมภพแล้ว*/,
    X_MODEL: 1,
  };
  console.log('result convertProductItemFromServerProcess2V3', result);
  return result;
};
export const convertProductItemFromServerProcess = (product, item, _round) => {
  console.log('convertProductItemFromServerProcess product', product);
  console.log('convertProductItemFromServerProcess item', item);

  //Bazz ปัดเศษสะดวกทอน
  let ret = 0
  let bath = parseInt(item.TRANSTKD[0].TRD_G_KEYIN);
  let satang = Math.abs(bath - parseFloat(item.TRANSTKD[0].TRD_G_KEYIN));

  switch (_round) {
    case 0: //  ไม่ต้องปัด
      ret = bath + satang;
      break;
    case 1: //  ปัดขึ้นลงเป็นบาท
      ret = bath + ((satang * 100) >= 50 ? Math.ceil(satang) : Math.floor(satang));
      break;
    case 2: //  ปัดขึ้นลงเป็นสลึง
      ret = bath + (
        ((satang * 100) > 1 && (satang * 100) <= 12) ? 0 :
          ((satang * 100) > 13 && (satang * 100) <= 25) ? 25 :
            ((satang * 100) > 26 && (satang * 100) <= 37) ? 25 :
              ((satang * 100) > 38 && (satang * 100) <= 50) ? 50 :
                ((satang * 100) > 51 && (satang * 100) <= 62) ? 50 :
                  ((satang * 100) > 63 && (satang * 100) <= 75) ? 75 :
                    ((satang * 100) > 76 && (satang * 100) <= 87) ? 75 :
                      ((satang * 100) > 88 && (satang * 100) <= 100) ? 100 : 100
      ) / 100;
      break;
    case 11: //  ปัดขึ้นเป็นบาท
      ret = bath + (satang == 0 ? 0 : Math.ceil(satang));
      break;
    case 12: //  ปัดขึ้นเป็นสลึง
      ret = bath + (
        ((satang * 100) > 1 && (satang * 100) <= 25) ? 25 :
          ((satang * 100) > 25 && (satang * 100) <= 50) ? 50 :
            ((satang * 100) > 50 && (satang * 100) <= 75) ? 75 : 100
      ) / 100;
      break;
    case 21: //  ปัดลงเป็นบาท
      ret = bath + (satang == 0 ? 0 : Math.floor(satang));
      break;
    case 22: //  ปัดลงเป็นสลึง
      ret = bath + (
        ((satang * 100) > 75 && (satang * 100) <= 100) ? 100 :
          ((satang * 100) > 50 && (satang * 100) <= 75) ? 75 :
            ((satang * 100) > 25 && (satang * 100) <= 50) ? 50 : 0
      ) / 100;
      break;
  }
  //Bazz ปัดเศษสะดวกทอน

  result = {
    ICDEPT_THAIDESC: product.ICDEPT_THAIDESC,
    GOODS_CODE: item.TRANSTKD[0].TRD_SH_CODE,
    GOODS_NAME: item.TRANSTKD[0].TRD_SH_NAME,
    VTRD_UTQ_NAME: item.TRANSTKD[0].TRD_UTQNAME,
    UTQ_NAME: item.TRANSTKD[0].TRD_UTQNAME,
    SKU_CODE: product.SKU_CODE,
    SKUALT_CODE: null,
    UTQ_QTY: item.TRANSTKD[0].TRD_UTQQTY,
    ARPLU_U_PRC: item.TRANSTKD[0].TRD_K_U_PRC /* ราคาต่อหน่วย*/,
    GOODS_DISCOUNT: item.TRANSTKD[0].TRD_DSC_KEYIN,
    GOODS_TOTAL_DISCOUNT: item.TRANSTKD[0].TRD_DSC_KEYINV,
    GOODS_QTY: item.TRANSTKD[0].TRD_QTY,
    // bazzz
    GOODS_TOTAL_PRC: item.TRANSTKD[0].TRD_G_KEYIN,
    //GOODS_TOTAL_PRC: ret,
    GOODS_FREE: item.TRANSTKD[0].TRD_Q_FREE,
    GOODS_NET_PRC: item.TRANSTKD[0].TRD_N_SELL,
    VTRD_SH_VALUES: product.VTRD_SH_VALUES,
    GOODS_VAT: item.TRANSTKD[0].TRD_VAT,
    SKU_ALT: item.TRANSTKD[0].TRD_SKUALT,
    TRD_LOT_NO: product.TRD_LOT_NO,
    TRD_SERIAL: product.TRD_SERIAL,
    good_inVan_qty: product.good_inVan_qty,
    TMP_GOOD_QTY: product.TMP_GOOD_QTY,
    TMP_GOOD_MODEL: 10
  };
  console.log('convertProductItemFromServerProcess ', result);
  return result;
};

export const convertProductItemFromServerProcessSCR = (items) => {
  result = items.map((item, key) => {
    return {
      // ICDEPT_THAIDESC: product.ICDEPT_THAIDESC,
      GOODS_CODE: item.VTRD_CODE,
      GOODS_NAME: item.VTRD_NAMES,
      UTQ_NAME: null,
      SKU_CODE: null,
      SKUALT_CODE: null,
      UTQ_QTY: null,
      ARPLU_U_PRC: item.VTRD_U_PRC_KEYIN,
      GOODS_DISCOUNT: item.VTRD_U_DISC_TEXT,
      GOODS_TOTAL_DISCOUNT: item.VTRD_U_DSC,
      GOODS_QTY: item.VTRD_QTY,
      // bazzz
      //GOODS_TOTAL_PRC:  item.TRANSTKD[0].TRD_G_KEYIN / (item.TRANSTKD[0].TRD_UTQQTY  ),  
      GOODS_TOTAL_PRC: item.VTRD_VALUES_B_VAT_B_DISC,
      GOODS_FREE: item.VTRD_Q_FREE,
      GOODS_NET_PRC: item.VTRD_VALUES,
      VTRD_SH_VALUES: item.VTRD_SH_VALUES,
      GOODS_VAT: item.VTRD_VAT,
      SKU_ALT: item.SKU_ALT,
      VTRD_AUTO: item.VTRD_AUTO,
      good_inVan_qty: item.good_inVan_qty,
      TMP_GOOD_QTY: item.TMP_GOOD_QTY,
      TMP_GOOD_MODEL: 11
    };
  });

  return result;
};

export const genenrateOrderForProcessToServer = (
  item,
  ignoreCpgn,
  processType,
  check,
  processTypeDetail,
) => {
  // console.log('genenrateOrderForProcessToServer item', item);
  // console.log('genenrateOrderForProcessToServer check', check);
  const { header, orderProductSummary, productListItems } = item;
  let result;
  if (!check) {
    result = {
      HEADER: {
        VDI_AR: header.VDI_KEY ? header.VDI_KEY.toString() : null,
        VDI_WL: header.VDI_WL ? header.VDI_WL.toString() : null,
        VDI_REMARK: header.VDI_REMARK ? header.VDI_REMARK : null,
        VDI_USER_REF: header.VDI_USER_REF ? header.VDI_USER_REF : null,
      },
      DIS_BILL_1: orderProductSummary.DIS_BILL_1
        ? orderProductSummary.DIS_BILL_1 !== ''
          ? orderProductSummary.DIS_BILL_1 + 'B'
          : orderProductSummary.DIS_BILL_1
        : '',

      DIS_BILL_2: orderProductSummary.DIS_BILL_2
        ? orderProductSummary.DIS_BILL_2
        : '',
      ITEMS: productListItems.filter((item) => item.VTRD_QTY !== 0),
      IGNORE_CPGN: ignoreCpgn,
      PROCESS_TYPE: processType,
      PROCESS_DETAIL: processTypeDetail,
    };
    // console.log('genenrateOrderForProcessToServer !result', result);
  } else {
    result = {
      HEADER: {
        VDI_AR: header.VDI_KEY ? header.VDI_KEY.toString() : null,
        VDI_WL: header.VDI_WL ? header.VDI_WL.toString() : null,
        VDI_REMARK: header.VDI_REMARK ? header.VDI_REMARK : null,
        VDI_USER_REF: header.VDI_USER_REF ? header.VDI_USER_REF : null,
      },
      DIS_BILL_1: orderProductSummary.DIS_BILL_1,
      DIS_BILL_2: orderProductSummary.DIS_BILL_2,
      ITEMS: productListItems.filter((item) => item.VTRD_QTY !== 0),
      IGNORE_CPGN: ignoreCpgn,
      PROCESS_TYPE: processType,
      PROCESS_DETAIL: processTypeDetail,
    };
    // console.log('genenrateOrderForProcessToServer result', result);
  }

  header.VDI_WL && header.VDI_WL ? delete result.HEADER.VDI_AR : null;

  return result;
};

export const genenrateOrderForProcessToServerSCR = (
  order,
  items,
  ignoreCpgn,
  processType,
) => {
  const { header, orderProductSummary } = order;

  const result = {
    HEADER: {
      VDI_AR: header.VDI_KEY.toString(),
    },
    DIS_BILL_1: orderProductSummary.DIS_BILL_1,
    DIS_BILL_2: orderProductSummary.DIS_BILL_2,
    ITEMS: items,
    IGNORE_CPGN: ignoreCpgn,
    PROCESS_TYPE: processType,
  };

  return result;
};

export const genenrateOrderForCreateToServer = (
  item,
  mile,
  position,
  dscfTxnId,
) => {
  //  console.log('genenrateOrderForCreateToServer  item', item);
  let {
    headerProcessed,
    orderProductSummaryProcessed,
    productListItemsProcessed,
    productListItemsPRTProcessed,
    paymentMethod // Bazz เพิ่ม
  } = item;

  headerProcessed = {
    ...headerProcessed,
    VDI_MILE: mile,
    VDI_GPS_LAT_V: position.latitude,
    VDI_GPS_LONG_V: position.longitude,
    VDI_QR_REFER: dscfTxnId,
  };

  const result = {
    HEADER: headerProcessed,
    ImpTranPayd: paymentMethod,
    DIS_BILL_1: orderProductSummaryProcessed.DIS_BILL_1,
    DIS_BILL_2: orderProductSummaryProcessed.DIS_BILL_2,
    ITEMS: productListItemsProcessed,
    ITEMS_PRT: productListItemsPRTProcessed,
  };
  //  console.log('result >>>>> ', result);
  return result;
};

export const genenrateOrderForUpdateToServer = (item, header) => {
  let { HEADER } = item;
  HEADER = {
    ...HEADER,
    VDI_REF: header.VDI_REF,
    VDI_USER_REF: header.VDI_USER_REF,
  };

  const result = {
    ...item,
    HEADER: HEADER,
  };

  return result;
};

export const generateProductItemsToServer = (items) => {
  return items.map((item, key) => {
    return {
      VTRD_CODE: item.GOODS_CODE,
      VTRD_NAMES: item.GOODS_NAME ? item.GOODS_NAME : item.SKU_NAME,
      VTRD_QTY: parseFloat(item.GOODS_QTY),
      VTRD_U_PRC_KEYIN: item.ARPLU_U_PRC,
      VTRD_Q_FREE: parseFloat(item.GOODS_FREE),
      VTRD_U_DISC_TEXT: item.GOODS_DISCOUNT,
      X_MODEL: 3,
      // WL_CODE: null,
      // TRD_REFER_TRH: null,
      // TRD_REFER_REF: null,
      // SKU_CODE: item.VGOODS_SKU,
      // TRD_KEYIN: item.VGOODS_SKU,
      // SKM_QTY: item.VGOODS_QTY,
      // TRD_QTY: item.VGOODS_QTY,
      // TRD_QFREE: item.VGOODS_FREE,
      // TRD_U_PRC: item.VGOODS_U_PRC,
      // TRD_DSC_KEYINV: item.VGOODS_DISCOUNT,
      // TRD_B_SELL: null,
      // TRD_B_VAT: null,
      // TRD_B_AMT: item.VGOODS_NET_PRC
    };
  });
};

export const generateItemsProcessedFromServer = (items, productListItems) => {
  return items.map((item, key) => {
    return {
      ...item,
      TRD_SH_NAME: productListItems[key].VTRD_NAMES,
      TRD_AC_G_KEYIN: parseFloat(item.TRD_AC_G_KEYIN),
      TRD_AC_QTY: parseFloat(item.TRD_AC_QTY),
      TRD_AC_Q_FREE: parseFloat(item.TRD_AC_Q_FREE),
      TRD_ADJ_MAMT: parseFloat(item.TRD_ADJ_MAMT),
      TRD_ADJ_PAMT: parseFloat(item.TRD_ADJ_PAMT),
      TRD_ARCPGN: parseFloat(item.TRD_ARCPGN),
      TRD_ASRTH: parseFloat(item.TRD_ASRTH),
      TRD_ASRT_FREE: parseFloat(item.TRD_ASRT_FREE),
      TRD_ASRT_QTY: parseFloat(item.TRD_ASRT_QTY),
      TRD_B_AMT: parseFloat(item.TRD_B_AMT),
      TRD_B_GROUP: parseFloat(item.TRD_B_GROUP),
      TRD_B_PCNT: parseFloat(item.TRD_B_PCNT),
      TRD_B_RELOCATE: parseFloat(item.TRD_B_RELOCATE),
      TRD_B_SELL: parseFloat(item.TRD_B_SELL),
      TRD_B_UPRC: parseFloat(item.TRD_B_UPRC),
      TRD_B_VAT: parseFloat(item.TRD_B_VAT),
      TRD_CAMPAIGN: parseFloat(item.TRD_CAMPAIGN),
      TRD_COMM_AMT: parseFloat(item.TRD_COMM_AMT),
      TRD_COMM_RATE: parseFloat(item.TRD_COMM_RATE),
      TRD_COST_TY: parseFloat(item.TRD_COST_TY),
      TRD_CREATOR: parseFloat(item.TRD_CREATOR),
      TRD_C_DSCV: parseFloat(item.TRD_C_DSCV),
      TRD_C_U_PRC: parseFloat(item.TRD_C_U_PRC),
      TRD_DSC_KEYIN: parseFloat(item.TRD_DSC_KEYIN),
      TRD_EQ_V: parseFloat(item.TRD_EQ_V),
      TRD_G_AMT: parseFloat(item.TRD_G_AMT),
      TRD_G_KEYIN: parseFloat(item.TRD_G_KEYIN),
      TRD_G_SELL: parseFloat(item.TRD_G_SELL),
      TRD_G_VAT: parseFloat(item.TRD_G_VAT),
      TRD_K_U_PRC: parseFloat(item.TRD_K_U_PRC),
      TRD_NM_PRC: parseFloat(item.TRD_NM_PRC),
      TRD_NM_VATIO: parseFloat(item.TRD_NM_VATIO),
      TRD_NX_DSC_KEYINV: parseFloat(item.TRD_NX_DSC_KEYINV),
      TRD_NX_G_KEYIN: parseFloat(item.TRD_NX_G_KEYIN),
      TRD_NX_QTY: parseFloat(item.TRD_NX_QTY),
      TRD_NX_Q_FREE: parseFloat(item.TRD_NX_Q_FREE),
      TRD_N_AMT: parseFloat(item.TRD_N_AMT),
      TRD_N_SELL: parseFloat(item.TRD_N_SELL),
      TRD_N_VAT: parseFloat(item.TRD_N_VAT),
      TRD_OR_QTY: parseFloat(item.TRD_OR_QTY),
      TRD_OR_Q_FREE: parseFloat(item.TRD_OR_Q_FREE),
      TRD_OR_U_PRC: parseFloat(item.TRD_OR_U_PRC),
      TRD_PRICE: parseFloat(item.TRD_PRICE),
      TRD_QTY: parseFloat(item.TRD_QTY),
      TRD_Q_FREE: parseFloat(item.TRD_Q_FREE),
      TRD_REFER_TRD: parseFloat(item.TRD_REFER_TRD),
      TRD_REFER_TRH: parseFloat(item.TRD_REFER_TRH),
      TRD_RTN_AMT: parseFloat(item.TRD_RTN_AMT),
      TRD_RTN_UPRC: parseFloat(item.TRD_RTN_UPRC),
      TRD_SH_GAMT: parseFloat(item.TRD_SH_GAMT),
      TRD_SH_GSELL: parseFloat(item.TRD_SH_GSELL),
      TRD_SH_GVAT: parseFloat(item.TRD_SH_GVAT),
      TRD_SH_QTY: parseFloat(item.TRD_SH_QTY),
      TRD_SH_UPRC: parseFloat(item.TRD_SH_UPRC),
      TRD_TO_WL: parseFloat(item.TRD_TO_WL),
      TRD_UTQQTY: parseFloat(item.TRD_UTQQTY),
      TRD_U_PRC: parseFloat(item.TRD_U_PRC),
      TRD_U_VATIO: parseFloat(item.TRD_U_VATIO),
      TRD_VAT_R: parseFloat(item.TRD_VAT_R),
      TRD_VAT_TY: parseFloat(item.TRD_VAT_TY),
      TRD_WEIGHT: parseFloat(item.TRD_WEIGHT),
      TRD_WH_RATE: parseFloat(item.TRD_WH_RATE),
      TRD_WH_TAX: parseFloat(item.TRD_WH_TAX),
      TRD_WH_TY: parseFloat(item.TRD_WH_TY),
      TRD_WL: parseFloat(item.TRD_WL),
    };
  });
};

export const generateResponseFromServer = (obj) => {
  console.log('generateResponseFromServer obj', obj);
  let newAR = null;

  if (obj.AROE) {
    newAR = {
      ...obj.AROE,
      AROE_ARCD: obj.AROE.AROE_ARCD ? parseFloat(obj.AROE.AROE_ARCD) : null,
      AROE_A_AMT: obj.AROE.AROE_A_AMT ? parseFloat(obj.AROE.AROE_A_AMT) : null,
      AROE_A_SNV: obj.AROE.AROE_A_SNV ? parseFloat(obj.AROE.AROE_A_SNV) : null,
      AROE_A_SV: obj.AROE.AROE_A_S ? VparseFloat(obj.AROE.AROE_A_SV) : null,
      AROE_A_VAT: obj.AROE.AROE_A_VAT ? parseFloat(obj.AROE.AROE_A_VAT) : null,
      AROE_B_AMT: obj.AROE.AROE_B_AMT ? parseFloat(obj.AROE.AROE_B_AMT) : null,
      AROE_B_SNV: obj.AROE.AROE_B_SNV ? parseFloat(obj.AROE.AROE_B_SNV) : null,
      AROE_B_SV: obj.AROE.AROE_B_SV ? parseFloat(obj.AROE.AROE_B_SV) : null,
      AROE_B_VAT: obj.AROE.AROE_B_VA ? TparseFloat(obj.AROE.AROE_B_VAT) : null,
      AROE_G_KEYIN: obj.AROE.AROE_G_KEYIN
        ? parseFloat(obj.AROE.AROE_G_KEYIN)
        : null,
      AROE_G_SNV: obj.AROE.AROE_G_SNV ? parseFloat(obj.AROE.AROE_G_SNV) : null,
      AROE_G_SV: obj.AROE.AROE_G_SV ? parseFloat(obj.AROE.AROE_G_SV) : null,
      AROE_G_VAT: obj.AROE.AROE_G_VAT ? parseFloat(obj.AROE.AROE_G_VAT) : null,
      AROE_N_AMT: obj.AROE.AROE_N_AMT ? parseFloat(obj.AROE.AROE_N_AMT) : null,
      AROE_N_SNV: obj.AROE.AROE_N_SNV ? parseFloat(obj.AROE.AROE_N_SNV) : null,
      AROE_N_SV: obj.AROE.AROE_N_SV ? parseFloat(obj.AROE.AROE_N_SV) : null,
      AROE_N_VAT: obj.AROE.AROE_N_VAT ? parseFloat(obj.AROE.AROE_N_VAT) : null,
      AROE_TDSC_KEYINV: obj.AROE.AROE_TDSC_KEYINV
        ? parseFloat(obj.AROE.AROE_TDSC_KEYINV)
        : null,
      AROE_WH_TAX: obj.AROE.AROE_WH_TAX
        ? parseFloat(obj.AROE.AROE_WH_TAX)
        : null,
      AROE_XCHG: obj.AROE.AROE_XCHG ? parseFloat(obj.AROE.AROE_XCHG) : null,
    };
  } else {
    newAR = {
      ...obj.ARDETAIL,
      ARDETAIL_ARCD: obj.ARDETAIL.ARDETAIL_ARCD
        ? parseFloat(obj.ARDETAIL.ARDETAIL_ARCD)
        : null,
      ARDETAIL_A_AMT: obj.ARDETAIL.ARDETAIL_A_AMT
        ? parseFloat(obj.ARDETAIL.ARDETAIL_A_AMT)
        : null,
      ARDETAIL_A_SNV: obj.ARDETAIL.ARDETAIL_A_SNV
        ? parseFloat(obj.ARDETAIL.ARDETAIL_A_SNV)
        : null,
      ARDETAIL_A_SV: obj.ARDETAIL.ARDETAIL_A_SV
        ? parseFloat(obj.ARDETAIL.ARDETAIL_A_SV)
        : null,
      ARDETAIL_A_VAT: obj.ARDETAIL.ARDETAIL_A_VAT
        ? parseFloat(obj.ARDETAIL.ARDETAIL_A_VAT)
        : null,
      ARDETAIL_B_AMT: obj.ARDETAIL.ARDETAIL_B_AMT
        ? parseFloat(obj.ARDETAIL.ARDETAIL_B_AMT)
        : null,
      ARDETAIL_B_SNV: obj.ARDETAIL.ARDETAIL_B_SNV
        ? parseFloat(obj.ARDETAIL.ARDETAIL_B_SNV)
        : null,
      ARDETAIL_B_SV: obj.ARDETAIL.ARDETAIL_B_SV
        ? parseFloat(obj.ARDETAIL.ARDETAIL_B_SV)
        : null,
      ARDETAIL_B_VAT: obj.ARDETAIL.ARDETAIL_B_VAT
        ? parseFloat(obj.ARDETAIL.ARDETAIL_B_VAT)
        : null,
      ARDETAIL_G_KEYIN: obj.ARDETAIL.ARDETAIL_G_KEYIN
        ? parseFloat(obj.ARDETAIL.ARDETAIL_G_KEYIN)
        : null,
      ARDETAIL_G_SNV: obj.ARDETAIL.ARDETAIL_G_SNV
        ? parseFloat(obj.ARDETAIL.ARDETAIL_G_SNV)
        : null,
      ARDETAIL_G_SV: obj.ARDETAIL.ARDETAIL_G_SV
        ? parseFloat(obj.ARDETAIL.ARDETAIL_G_SV)
        : null,
      ARDETAIL_G_VAT: obj.ARDETAIL.ARDETAIL_G_VAT
        ? parseFloat(obj.ARDETAIL.ARDETAIL_G_VAT)
        : null,
      ARDETAIL_N_AMT: obj.ARDETAIL.ARDETAIL_N_AMT
        ? parseFloat(obj.ARDETAIL.ARDETAIL_N_AMT)
        : null,
      ARDETAIL_N_SNV: obj.ARDETAIL.ARDETAIL_N_SNV
        ? parseFloat(obj.ARDETAIL.ARDETAIL_N_SNV)
        : null,
      ARDETAIL_N_SV: obj.ARDETAIL.ARDETAIL_N_SV
        ? parseFloat(obj.ARDETAIL.ARDETAIL_N_SV)
        : null,
      ARDETAIL_N_VAT: obj.ARDETAIL.ARDETAIL_N_VAT
        ? parseFloat(obj.ARDETAIL.ARDETAIL_N_VAT)
        : null,
      ARDETAIL_TDSC_KEYINV: obj.ARDETAIL.ARDETAIL_TDSC_KEYINV
        ? parseFloat(obj.ARDETAIL.ARDETAIL_TDSC_KEYINV)
        : null,
      ARDETAIL_WH_TAX: obj.ARDETAIL.ARDETAIL_WH_TAX
        ? parseFloat(obj.ARDETAIL.ARDETAIL_WH_TAX)
        : null,
      ARDETAIL_XCHG: obj.ARDETAIL.ARDETAIL_XCHG
        ? parseFloat(obj.ARDETAIL.ARDETAIL_XCHG)
        : null,
    };
  }
  console.log('generateResponseFromServer newAR', newAR);
  let newDocInfo = {
    ...obj.DOCINFO,
    DI_AMOUNT: obj.DOCINFO.DI_AMOUNT ? parseFloat(obj.DOCINFO.DI_AMOUNT) : null,
    DI_ITEMS: obj.DOCINFO.DI_ITEMS ? parseFloat(obj.DOCINFO.DI_ITEMS) : null,
    DI_GPS_LAT_S: obj.DOCINFO.DI_GPS_LAT_S
      ? parseFloat(obj.DOCINFO.DI_GPS_LAT_S)
      : null,
    DI_GPS_LONG_S: obj.DOCINFO.DI_GPS_LONG_S
      ? parseFloat(obj.DOCINFO.DI_GPS_LONG_S)
      : null,
  };

  console.log('generateResponseFromServer newDocInfo', newDocInfo);
  let newTRANSTKD = [];
  for (let i in obj.TRANSTKD) {
    console.log('obj.TRANSTKD', obj.TRANSTKD[i]);
    let newObjSTKD = {
      ...obj.TRANSTKD[i],
      TRD_AC: parseFloat(obj.TRANSTKD[i].TRD_AC),
      TRD_AC_G_KEYIN: parseFloat(obj.TRANSTKD[i].TRD_AC_G_KEYIN),
      TRD_AC_QTY: parseFloat(obj.TRANSTKD[i].TRD_AC_QTY),
      TRD_AC_Q_FREE: parseFloat(obj.TRANSTKD[i].TRD_AC_Q_FREE),
      TRD_ADJ_MAMT: parseFloat(obj.TRANSTKD[i].TRD_ADJ_MAMT),
      TRD_ADJ_PAMT: parseFloat(obj.TRANSTKD[i].TRD_ADJ_PAMT),
      TRD_ARCPGN: parseFloat(obj.TRANSTKD[i].TRD_ARCPGN),
      TRD_ASRTH: parseFloat(obj.TRANSTKD[i].TRD_ASRTH),
      TRD_ASRT_FREE: parseFloat(obj.TRANSTKD[i].TRD_ASRT_FREE),
      TRD_ASRT_QTY: parseFloat(obj.TRANSTKD[i].TRD_ASRT_QTY),
      TRD_B_AMT: parseFloat(obj.TRANSTKD[i].TRD_B_AMT),
      TRD_B_GROUP: parseFloat(obj.TRANSTKD[i].TRD_B_GROUP),
      TRD_B_PCNT: parseFloat(obj.TRANSTKD[i].TRD_B_PCNT),
      TRD_B_RELOCATE: parseFloat(obj.TRANSTKD[i].TRD_B_RELOCATE),
      TRD_B_SELL: parseFloat(obj.TRANSTKD[i].TRD_B_SELL),
      TRD_B_UPRC: parseFloat(obj.TRANSTKD[i].TRD_B_UPRC),
      TRD_B_VAT: parseFloat(obj.TRANSTKD[i].TRD_B_VAT),
      TRD_CAMPAIGN: parseFloat(obj.TRANSTKD[i].TRD_CAMPAIGN),
      TRD_COMM_AMT: parseFloat(obj.TRANSTKD[i].TRD_COMM_AMT),
      TRD_COMM_RATE: parseFloat(obj.TRANSTKD[i].TRD_COMM_RATE),
      TRD_COST_TY: parseFloat(obj.TRANSTKD[i].TRD_COST_TY),
      TRD_CREATOR: parseFloat(obj.TRANSTKD[i].TRD_CREATOR),
      TRD_C_DSCV: parseFloat(obj.TRANSTKD[i].TRD_C_DSCV),
      TRD_C_U_PRC: parseFloat(obj.TRANSTKD[i].TRD_C_U_PRC),
      TRD_DSC_KEYIN: parseFloat(obj.TRANSTKD[i].TRD_DSC_KEYIN),
      TRD_EQ_V: parseFloat(obj.TRANSTKD[i].TRD_EQ_V),
      TRD_G_AMT: parseFloat(obj.TRANSTKD[i].TRD_G_AMT),
      TRD_G_KEYIN: parseFloat(obj.TRANSTKD[i].TRD_G_KEYIN),
      TRD_G_SELL: parseFloat(obj.TRANSTKD[i].TRD_G_SELL),
      TRD_G_VAT: parseFloat(obj.TRANSTKD[i].TRD_G_VAT),
      TRD_K_U_PRC: parseFloat(obj.TRANSTKD[i].TRD_K_U_PRC),
      TRD_NM_PRC: parseFloat(obj.TRANSTKD[i].TRD_NM_PRC),
      TRD_NM_VATIO: parseFloat(obj.TRANSTKD[i].TRD_NM_VATIO),
      TRD_NX_DSC_KEYINV: parseFloat(obj.TRANSTKD[i].TRD_NX_DSC_KEYINV),
      TRD_NX_G_KEYIN: parseFloat(obj.TRANSTKD[i].TRD_NX_G_KEYIN),
      TRD_NX_QTY: parseFloat(obj.TRANSTKD[i].TRD_NX_QTY),
      TRD_NX_Q_FREE: parseFloat(obj.TRANSTKD[i].TRD_NX_Q_FREE),
      TRD_N_AMT: parseFloat(obj.TRANSTKD[i].TRD_N_AMT),
      TRD_N_SELL: parseFloat(obj.TRANSTKD[i].TRD_N_SELL),
      TRD_N_VAT: parseFloat(obj.TRANSTKD[i].TRD_N_VAT),
      TRD_OR_QTY: parseFloat(obj.TRANSTKD[i].TRD_OR_QTY),
      TRD_OR_Q_FREE: parseFloat(obj.TRANSTKD[i].TRD_OR_Q_FREE),
      TRD_OR_U_PRC: parseFloat(obj.TRANSTKD[i].TRD_OR_U_PRC),
      TRD_PRICE: parseFloat(obj.TRANSTKD[i].TRD_PRICE),
      TRD_QTY: parseFloat(obj.TRANSTKD[i].TRD_QTY),
      TRD_Q_FREE: parseFloat(obj.TRANSTKD[i].TRD_Q_FREE),
      TRD_REFER_TRD: parseFloat(obj.TRANSTKD[i].TRD_REFER_TRD),
      TRD_REFER_TRH: parseFloat(obj.TRANSTKD[i].TRD_REFER_TRH),
      TRD_RTN_AMT: parseFloat(obj.TRANSTKD[i].TRD_RTN_AMT),
      TRD_RTN_UPRC: parseFloat(obj.TRANSTKD[i].TRD_RTN_UPRC),
      TRD_SH_GAMT: parseFloat(obj.TRANSTKD[i].TRD_SH_GAMT),
      TRD_SH_GSELL: parseFloat(obj.TRANSTKD[i].TRD_SH_GSELL),
      TRD_SH_GVAT: parseFloat(obj.TRANSTKD[i].TRD_SH_GVAT),
      TRD_SH_QTY: parseFloat(obj.TRANSTKD[i].TRD_SH_QTY),
      TRD_SH_UPRC: parseFloat(obj.TRANSTKD[i].TRD_SH_UPRC),
      TRD_TO_WL: parseFloat(obj.TRANSTKD[i].TRD_TO_WL),
      TRD_UTQQTY: parseFloat(obj.TRANSTKD[i].TRD_UTQQTY),
      TRD_U_PRC: parseFloat(obj.TRANSTKD[i].TRD_U_PRC),
      TRD_U_VATIO: parseFloat(obj.TRANSTKD[i].TRD_U_VATIO),
      TRD_VAT_R: parseFloat(obj.TRANSTKD[i].TRD_VAT_R),
      TRD_VAT_TY: parseFloat(obj.TRANSTKD[i].TRD_VAT_TY),
      TRD_WEIGHT: parseFloat(obj.TRANSTKD[i].TRD_WEIGHT),
      TRD_WH_RATE: parseFloat(obj.TRANSTKD[i].TRD_WH_RATE),
      TRD_WH_TAX: parseFloat(obj.TRANSTKD[i].TRD_WH_TAX),
      TRD_WH_TY: parseFloat(obj.TRANSTKD[i].TRD_WH_TY),
      TRD_WL: parseFloat(obj.TRANSTKD[i].TRD_WL),
    };
    console.log('newObjSTKD', newObjSTKD);
    newTRANSTKD.push(newObjSTKD);
  }
  console.log('generateResponseFromServer newTRANSTKD', newTRANSTKD);
  return { ...obj, AROE: newAR, DOCINFO: newDocInfo, TRANSTKD: newTRANSTKD, TRANPAYD: obj.paymentMethod };
};

export const genenrateDocVisitToServer = (vdiAr, vdiVisit, mile, position) => {
  var bodyFormData = new FormData();
  bodyFormData.append('VDI_AR', vdiAr);
  bodyFormData.append('VDI_VISIT', vdiVisit);

  if (mile) {
    bodyFormData.append('VDI_MILE', mile);
  }

  if (position.latitude) {
    bodyFormData.append('VDI_GPS_LAT_V', position.latitude);
  }

  if (position.latitude) {
    bodyFormData.append('VDI_GPS_LONG_V', position.longitude);
  }

  return bodyFormData;
};

export const genenrateDocServeyToServer = (vdiAr, vdiAns, mile, position) => {
  var bodyFormData = new FormData();
  bodyFormData.append('VDI_AR', vdiAr);
  bodyFormData.append('VDI_ANS_1', vdiAns[0]);
  bodyFormData.append('VDI_ANS_2', vdiAns[1]);
  bodyFormData.append('VDI_ANS_3', vdiAns[2]);
  bodyFormData.append('VDI_ANS_4', vdiAns[3]);
  bodyFormData.append('VDI_ANS_5', vdiAns[4]);
  bodyFormData.append('VDI_ANS_6', vdiAns[5]);
  bodyFormData.append('VDI_ANS_7', vdiAns[6]);
  bodyFormData.append('VDI_ANS_8', vdiAns[7]);

  if (mile) {
    bodyFormData.append('VDI_MILE', mile);
  }

  if (position.latitude) {
    bodyFormData.append('VDI_GPS_LAT_V', position.latitude);
  }

  if (position.latitude) {
    bodyFormData.append('VDI_GPS_LONG_V', position.longitude);
  }

  return bodyFormData;
};

export const genenrateAttachImageToServer = (vdiKey, vdiAr, imgFile) => {
  var bodyFormData = new FormData();
  bodyFormData.append('VDI_KEY', vdiKey);
  bodyFormData.append('VDI_AR', vdiAr);
  bodyFormData.append('IMG_FILE', {
    uri: imgFile,
    type: 'image/jpg',
    name: moment().valueOf().toString() + '.jpg',
  });

  return bodyFormData;
};

export const genenrateMultipleAttachImageToServer = (
  vdiKey,
  vdiAr,
  imgFiles,
) => {
  var bodyFormData = new FormData();
  bodyFormData.append('VDI_KEY', vdiKey);
  bodyFormData.append('VDI_AR', vdiAr);

  for (var i = 0; i < imgFiles.length; i++) {
    bodyFormData.append(`IMG_FILE[${i}]`, {
      uri: imgFiles[i],
      type: 'image/jpg',
      name: moment().valueOf().toString() + '.jpg',
    });
  }

  return bodyFormData;
};

export const generateHeaderOutStandingCreatePayment = (header, item) => {
  let cheques = null;
  let VPH_PAY_AMT = 0;

  for (var i = 0; i < item.cheques.length; i++) {
    const cheque = item.cheques[i];

    if (cheque.checked) {
      cheques = {
        ...cheques,
        [`VPH_CHEQUE${i + 1}_AMT`]: cheque.pay ? cheque.pay : 0,
        [`VPH_CHEQUE${i + 1}_NO`]: cheque.chequeNo,
        [`VPH_CHEQUE${i + 1}_DATE`]: moment(cheque.chequeDate, 'DD/MM/YYYY')
          .add(1, 'days')
          .toJSON(),
        [`VPH_CHEQUE${i + 1}_BANK`]: cheque.bankFileItem,
      };
    }
  }

  return {
    ...cheques,
    VPH_KEY: header.VPH_KEY,
    VPH_USER_REF: header.VPH_USER_REF,
    VPH_REF: header.VPH_REF,
    VPH_AR: header.VPH_AR,
    VPH_TOTAL: header.VPH_TOTAL,
    VPH_PAY_AMT: VPH_PAY_AMT,
    VPH_CASH_AMT: item.cash.checked && item.cash.pay ? item.cash.pay : 0,
    VPH_TRANSFER_QR_AMT:
      item.qrcode.checked && item.qrcode.pay ? item.qrcode.pay : 0,
    VPH_TRANSFER_BANK:
      item.transfer.checked && item.transfer.bankAccountItem
        ? item.transfer.bankAccountItem
        : 0,
    VPH_TRANSFER_AMT:
      item.transfer.checked && item.transfer.pay ? item.transfer.pay : 0,
    VPH_COUNT: header.VPH_UPLOAD,
    VPH_UPLOAD: header.VPH_UPLOAD,
    VPH_DATE: header.VPH_DATE,
    VPH_VANCNF: header.VPH_VANCNF,
    VPH_TRANSFER_QR_REFER: header.VPH_TRANSFER_QR_REFER,
  };
};

export const genenrateMileAttachImageToServer = (imgFile) => {
  var bodyFormData = new FormData();
  bodyFormData.append('IMG_FILE', {
    uri: imgFile,
    type: 'image/jpg',
    name: moment().valueOf().toString() + '.jpg',
  });

  return bodyFormData;
};
