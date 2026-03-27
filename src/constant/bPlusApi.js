export const BPAPUS_FUNCTION_DC_CODE = 'Dc000110'; //หาประเภทเอกสาร (Dc000110)
export const BPAPUS_FUNCTION_WH_CODE = 'Wh000220' //หาตำแหน่งเก็บสินค้า  (Wh000220)
export const BPAPUS_FUNCTION_DP_CODE = 'Vans0106' //หาจุดเติมสินค้าที่ได้รับมอบหมาย  (Vans0106)

export const BPAPUS_LOOKUP_QR_CODE = 'Bk000620' //หาประเภท QR Code (Bk000620)
export const BPAPUS_LOOKUP_OT_REC_CODE = 'Ps000103' //ประเภทการรับชำระอื่นๆ (Ps000103)
export const BPAPUS_LOOKUP_OT_PAY_CODE = 'Ps000104' //ประเภทการจ่ายชำระอื่นๆ (Ps000104)


export const BPAPUS_REMAIN_OPTION_UNDER = 'Rm001200' //82.วิธีจัดการการจ่ายชำระขาด (Rm001200) (Rm001200)
export const BPAPUS_REMAIN_OPTION_OVER = 'Rm001300' //83.วิธีจัดการการจ่ายชำระเกิน (Rm001300)


export const BPAPUS_FUNCTION_V_CODE = 'Oe000304'; //หาเอกสารขาย-รับคืนสินค้า (Oe000304)  จะได้ IS(ใบรับคืนเงินสด) V(ใบขายสินค้า) CS(ใบขายสด)
export const BPAPUS_FUNCTION_CB_CODE = 'Oe000404'; //หาเอกสารซื้อ-ส่งคืนสินค้า (Oe000404)
export const BPAPUS_FUNCTION_DM_CODE = 'Oe001304'; //หาเอกสารรับ-จ่ายสินค้าอื่น (Oe001304) จะได้ DM(ใบโอนย้ายสินค้า) BK(ใบจอง) CS(ใบขายสด) V(ใบขายสินค้า) IS(ใบรับคืนเงินสด)
export const BPAPUS_FUNCTION_BK_CODE = 'Oe002304'; //หาใบจองสินค้า (Oe002304) จะได้ BK(ใบจอง)
export const BPAPUS_FUNCTION_OR_CODE = 'Oe002404'; //หาใบสั่งซื้อ (Oe002404)

export const GET_SELL_ORDER_DOC_INFO = 'GetSellOrderDocinfo'; //อ่านรายละเอียดเอกสารจอง (Q , BK)
export const GET_INVOICE_DOC_INFO = 'GetInvoiceDocinfo'; //อ่านรายละเอียดเอกสารขาย-รับคืน(V,CS , IS)
export const GET_RECEIVE_DOC_INFO = 'GetReceiveDocinfo'; 
export const GET_OTHER_DOC_INFO = 'GetOtherIcDocinfo'; 

export const GET_CASH_SELL_DOC_INFO = 'GetCashSalesDocinfo' //อ่านรายละเอียดเอกสารขายสด(GetCashSalesDocinfo)
export const CAL_CASH_SELL_DOC_INFO = 'CalcCashSalesDocinfo' //รวมยอดขายสด(CalcCashSalesDocinfo)
export const Save_CASH_SELL_DOC_INFO = 'SaveCashSalesDocinfo' //บันทึกรายละเอียดเอกสารขายสด(SaveCashSalesDocinfo)


export const GET_REPORT_NAME = 'GETREPORTNAME'; 
export const GET_PRINT_REPORT = 'PRINTREPORT'; 
export const GET_PRINT_STATUS = 'GETPRINTSTATUS'; 

export const GET_UPDATE_MEMBER = 'UPDMEMBER';  //12 แก้ไขต้ังค่าสมาชิก(UpdMember)   >> CreateUpdateMaster
export const CREATE_NEWMEMBER = 'NEWMEMBER';  //07 เพิ่มเติมต้้งค่าสมาชิก(NEWMEMBER) >> CreateUpdateMaster
export const FIND_MEMBER_NAME = 'Mb000130';  //50.หาชื่อสมาชิก (Mb000130) >> LookupErp


export const BPAPUS_DT_PROPERTIES = [
  {
    code: '307',
    desc: 'ใบขายสินค้า',
    docCode: 'V',
    engDesc: 'Sale',
  },
  {
    code: '411',
    desc: 'เตรียมใบเสร็จ',
    docCode: 'PR',
  },
  {
    code: '302',
    desc: 'ใบขายสด',
    docCode: 'CS',
    engDesc: 'CashSale',
  },
  {
    code: '207',
    desc: 'ใบจองสินค้า',
    docCode: 'BK',
    engDesc: 'Book',
  },
  {
    code: '206',
    desc: 'ใบตรวจนับ',
    docCode: 'Q',
  },
  {
    code: '337',
    desc: 'ใบรับคืนเงินสด',
    docCode: 'IS',
    engDesc: 'CashReturnSales',
  },
  {
    code: '311',
    desc: 'ใบย้ายออกสินค้า',
    docCode: 'DM',
  },
  {
    code: '348',
    desc: 'ใบเยี่ยมลูกค้า',
    docCode: 'VS',
  },
  {
    code: '349',
    desc: 'ใบสำรวจ',
    docCode: 'SV',
  },
];
