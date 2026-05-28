import { strings } from '../locales/i18n';

export const SaleSearchCriteria = ['ทั้งหมด', 'เครดิต', 'เงินสด'];

export const BillCriteriaButtonGroup = ['ทั้งหมด', 'เครดิต', 'เงินสด'];

export const distanceSelectItems = [
  {
    label: 'ระยะ 5 กิโลเมตร',
    value: 5,
  },
  {
    label: 'ระยะ 10 กิโลเมตร',
    value: 10,
  },
  {
    label: 'ระยะ 20 กิโลเมตร',
    value: 20,
  },
  {
    label: 'ระยะ 30 กิโลเมตร',
    value: 30,
  },
  {
    label: 'ระยะ 50 กิโลเมตร',
    value: 50,
  },
  {
    label: 'ระยะ 100 กิโลเมตร',
    value: 100,
  },
  {
    label: 'ระยะ 200 กิโลเมตร',
    value: 200,
  },
  {
    label: 'ระยะ 300 กิโลเมตร',
    value: 300,
  },
  {
    label: 'ระยะ 500 กิโลเมตร',
    value: 500,
  },
];

export const BluetoothModels = {
  items: [
    {
      label: 'ZIJIANG',
      value: 0,
    },
    {
      label: 'EPSON',
      value: 1,
    },
    {
      label: 'BARIGAN',
      value: 4,
    },
  ],
};

export const MOBILE5INCH = 370;

//export const APP_VERSION_FULL = '3.0.10.0 (18/05/2023)';
export const APP_VERSION_FULL = '3.1.0.36  (28/05/2026)';
export const APP_VERSION = '3.1.0.36';

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// Theme Color /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////// Main Color Theme ///////////////////////////////////

export const MainTheme = {
  colorPrimary: '#47BA8F',
  colorSecondary: '#FFFFFF',
  colorTertiary: '#2FBA74',
  colorQuaternary: '#1C8365',
  colorQuinary: '#2E858E',
  colorSenary: '#8AB291',
  colorSeptenary: '#D4EADE',
  colorOctonary: '#FFB6BB',
  colorNonary: '#D9D9D9',
  colorDenary: '#0084C5',
  colorElevendary: '#E63C49',
  colorDuodenary: '#848b79',
  colorThirteendary: '#FFB6BB',
  colorFourteendary: '#A31A34',
  colorEnabled: '#8FEA80',
  colorDisabled: '#B6B6B4',
  activePrimary: '#8FEA80',
  inActivePrimary: '#FFFFFF',
  colorSuccess: '#00FF00',
  colorDanger: '#FF0000',
  placeholder: '#000000',
  searchBarInput: '#347C17',
  searchBarContainer: '#C3FDB8',
  searchHeaderListItems: '#F9F995',
  colorHeaderSection: '#F9F995',
  placeholerTextInput: '#D6D7DA',
  colorButtonBorder: '#B6B6B4',
};

///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// Default container //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

export const mainContainer = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  backgroundColor: MainTheme.colorSecondary,
  // padding: 5,
};

export const mainDivider = {
  borderBottomWidth: 0.7,
  borderBottomColor: '#000000',
};

///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// Button Group ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

export const homeMenuButtonGroup = [
  {
    title: strings('home_menu.order'),
    buttonStyle: { backgroundColor: '#FF0000' },
    imgSrc: require('../images/Order.png'),
    screen: 'Order',
    methodType: 'new-page',
    methodName: null,
  },
  {
    title: strings('home_menu.warehouse'),
    buttonStyle: { backgroundColor: '#B1FB17' },
    imgSrc: require('../images/warehouse.png'),
    screen: 'Stock',
    methodType: 'new-page',
    methodName: null,
  },
  // {
  //     title: 'เติมสินค้า',
  //     buttonStyle: {backgroundColor: '#A74AC7'},
  //     iconName: 'truck',
  //     iconType: 'font-awesome',
  //     screen: null,
  //     methodType: 'new-page',
  //     methodName: null
  // },
  {
    title: strings('home_menu.report'),
    buttonStyle: { backgroundColor: '#B6B6B4' },
    imgSrc: require('../images/Report.png'),
    screen: 'Report',
    orderType: 'check-stock',
    methodType: 'new-page',
    methodName: null,
  },
  // {
  //   title: strings('home_menu.paperless'),
  //   buttonStyle: {backgroundColor: '#B6B6B4'},
  //   imgSrc: require('../images/Report.png'),
  //   screen: 'Paperless',
  //   methodType: 'new-page',
  //   methodName: null,
  // },
  {
    title: strings('home_menu.report_sales'),
    buttonStyle: { backgroundColor: '#3BB9FF' },
    imgSrc: require('../images/Chart.png'),
    screen: 'ReportSales',
    methodType: 'new-page',
    methodName: null,
  },
  {
    title: strings('home_menu.customer'),
    buttonStyle: { backgroundColor: '#FFA500' },
    imgSrc: require('../images/customer.png'),
    screen: 'Customer',
    methodType: 'new-page',
    methodName: null,
  },
  // {
  //   title: strings('home_menu.mile'),
  //   buttonStyle: {backgroundColor: '#FFA500'},
  //   imgSrc: require('../images/Mile.png'),
  //   screen: 'MileStartRunOut',
  //   methodType: 'new-page',
  //   methodName: null,
  // },
  // {
  //   title: strings('home_menu.campaign'),
  //   buttonStyle: {backgroundColor: '#FFA500'},
  //   imgSrc: require('../images/campaign.png'),
  //   screen: 'Campaign',
  //   methodType: 'new-page',
  //   methodName: null,
  // },
  {
    title: strings('home_menu.setting'),
    buttonStyle: { backgroundColor: '#FFA500' },
    imgSrc: require('../images/Setting.png'),
    screen: 'Setting',
    methodType: 'new-page',
    methodName: null,
  },
  {
    title: strings('home_menu.logout'),
    buttonStyle: { backgroundColor: '#FFA500' },
    imgSrc: require('../images/LogOut.png'),
    screen: 'Auth',
    methodType: 'function',
    methodName: 'logout',
  },
];

export const orderChoiceButtonGroup = [
  {
    title: 'จองสินค้า',
    imgSrc: require('../images/Cart.png'),
    screen: 'OrderSales',
    orderType: 'reserv-product',
  },
  {
    title: 'ขายสินค้า',
    imgSrc: require('../images/Payment.png'),
    screen: 'OrderSales',
    orderType: 'sale-product',
  },
  {
    title: 'รับคืนสินค้า',
    imgSrc: require('../images/Send_Back.png'),
    screen: 'OrderSales',
    orderType: 'return-product',
  },
  {
    title: 'ใบเสนอราคา',
    imgSrc: require('../images/warehouse.png'),
    screen: 'OrderCheckStock',
    orderType: 'check-stock',
  },
  // {
  //     title: 'เช็คสต็อค',
  //     buttonStyle: {backgroundColor: '#B6B6B4'},
  //     iconName: 'cubes',
  //     iconType: 'font-awesome',
  //     screen: 'OrderCheckStock',
  //     orderType: 'check-stock'
  // },
  {
    title: 'เยี่ยม',
    imgSrc: require('../images/Visit_Customer.png'),
    screen: 'OrderVisit',
    orderType: 'visit',
  },
  {
    title: 'สำรวจร้านค้า',
    imgSrc: require('../images/Check.png'),
    screen: 'OrderSurvey',
    orderType: 'survey',
  },

  {
    title: 'เช็คอิน',
    imgSrc: require('../images/Checkin.png'),
    screen: 'CheckIn',
    orderType: 'Check-in',
  },
  {
    title: 'บันทึกเลขไมล์',
    imgSrc: require('../images/Mile.png'),
    screen: 'Mile',
    orderType: 'mile',
  },
  {
    title: 'บิลเอกสาร',
    imgSrc: require('../images/Bill.png'),
    screen: 'OrderBill',
    orderType: 'bill',
  },
  // {
  //     title: 'ใบเสร็จรับเงิน',
  //     imgSrc: require('../images/Bill.png'),
  //     screen: 'OrderOutstandingBalance',
  //     orderType: 'outstanding-balance'
  // }
];

export const orderSalesButtonGroup = [
  {
    title: 'เพิ่ม',
    buttonStyle: {
      backgroundColor: MainTheme.colorTertiary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorTertiary,
      borderWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'new-page',
    methodName: null,
    screen: 'ProductAddTo',
  },
  {
    title: 'ล่าสุด',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderBottomWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'last-bill',
    screen: null,
  },
  {
    title: 'ลบ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderBottomWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'remove-all',
    screen: null,
  },
];

export const orderSalesButtonGroupAddSCR = [
  {
    title: 'เพิ่ม',
    buttonStyle: {
      backgroundColor: MainTheme.colorTertiary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorTertiary,
      borderWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'new-page',
    methodName: null,
    screen: 'ProductAddTo',
  },
  {
    title: 'ลบ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderBottomWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'remove-all',
    screen: null,
  },
];

export const orderSalesButtonGroupEditSCR = [
  {
    title: 'แก้ไข',
    buttonStyle: {
      backgroundColor: MainTheme.colorTertiary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorTertiary,
      borderWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'new-page',
    methodName: null,
    screen: 'ProductEditTo',
  },
  {
    title: 'ลบ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderBottomWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'remove-all',
    screen: null,
  },
];

export const orderSalesReturnButtonGroup = [
  {
    title: 'เพิ่ม',
    buttonStyle: {
      backgroundColor: MainTheme.colorTertiary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorTertiary,
      borderWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'new-page',
    methodName: null,
    screen: 'ProductAddTo',
  },
  {
    title: 'ลบ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderBottomWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'remove-all',
    screen: null,
  },
];

export const orderSalesFooterButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'new-page',
    methodName: null,
    screen: 'OrderSalesFinalize',
  },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'cancel',
    screen: null,
  },
];

export const orderCheckStockButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: { backgroundColor: MainTheme.colorPrimary, width: 100 },
    size: 50,
    methodType: 'function',
    methodName: null,
    screen: 'confirm',
  },
  {
    title: 'ลบ',
    buttonStyle: { backgroundColor: MainTheme.colorPrimary, width: 100 },
    size: 50,
    methodType: 'function',
    methodName: 'cancel',
    screen: null,
  },
];

export const productDetailFormButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorTertiary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
  },
  {
    title: 'คำนวณ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderTopWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'process',
  },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderTopWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'cancel',
  },
];

export const productFinalizeFormButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorTertiary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorNonary,
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
    screen: null,
  },
  {
    title: 'คำนวณ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorNonary,
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'process',
    screen: null,
  },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorNonary,
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorDuodenary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'back',
    screen: null,
  },
];

export const visitFormButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
    screen: null,
  },
  // {
  //     title: 'ถ่ายรูป',
  //     buttonStyle: {backgroundColor: MainTheme.colorSecondary, height: 60, borderRadius: 0, borderColor: "#E5E4E2", borderWidth: 0.3},
  //     titleStyle: {color: '#000'},
  //     containerStyle: {flex: 1},
  //     size: 50,
  //     methodType: 'newPage',
  //     methodName: null,
  //     screen: 'Camera'
  // },
  // {
  //     title: 'ล้าง',
  //     buttonStyle: {backgroundColor: MainTheme.colorSecondary, height: 60, borderRadius: 0, borderColor: "#E5E4E2", borderWidth: 0.3},
  //     titleStyle: {color: '#000'},
  //     containerStyle: {flex: 1},
  //     size: 50,
  //     methodType: 'function',
  //     methodName: 'clear',
  //     screen: null
  // },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'cancel',
    screen: null,
  },
];

export const checkStockTopButtonGroup = [
  {
    title: 'เพิ่ม',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorTertiary,
      borderWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'new-page',
    methodName: null,
    screen: 'ProductAddTo',
  },
  {
    title: 'ล่าสุด',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderBottomWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'last-bill',
    screen: null,
  },
  {
    title: 'ลบ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderBottomWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    },
    titleStyle: { color: MainTheme.colorTertiary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'remove-item-all',
    screen: null,
  },
];

export const checkStockButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
    screen: 'OrderCheckStockFinalize',
  },
  // {
  //   title: 'ถ่ายรูปสินค้า',
  //   buttonStyle: {
  //     backgroundColor: MainTheme.colorSecondary,
  //     height: 60,
  //     borderRadius: 0,
  //     borderColor: '#E5E4E2',
  //     borderWidth: 0.3,
  //   },
  //   titleStyle: {color: '#000'},
  //   containerStyle: {flex: 1},
  //   size: 50,
  //   methodType: 'new-page',
  //   methodName: null,
  //   screen: 'OrderCheckStockImageItems',
  // },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'cancel',
    screen: null,
  },
];

export const checkStockSummaryButtonGroup = [
  {
    title: 'พิมพ์',
    subTitle: 'PDF',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'print',
    screen: null,
  },
  {
    title: 'กลับสู่เมนูหลัก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'new-page',
    methodName: null,
    screen: 'OrderChoice',
  },
  {
    title: 'บันทึกการขาย',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'new-page',
    methodName: null,
    screen: 'OrderSales',
  },
];

export const checkStockImageButtonGroup = [
  {
    title: 'ถ่ายรูป',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'open-camera',
    screen: 'Camera',
  },
  {
    title: 'ลบทั้งหมด',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'remove-image-all',
    screen: null,
  },
  {
    title: 'ย้อนกลับ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'back',
    screen: null,
  },
];

export const customerAddButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'add',
    screen: null,
  },
  {
    title: 'ล้างข้อมูล',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'clear-profile',
    screen: 'OrderChoice',
  },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'back',
    screen: null,
  },
];

export const customerProfileDetailButtonGroup = [
  {
    title: 'ทำรายการ',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'order',
    screen: null,
  },
  {
    title: 'ปิดบัญชีลูกค้า',
    buttonStyle: {
      backgroundColor: MainTheme.colorDanger,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
      display: 'none',
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'close-customer-account',
    screen: 'OrderChoice',
  },
];

export const orderSummaryFormButtonGroup = [
  {
    title: 'พิมพ์ใบเสร็จ',
    subTitle: 'พิมพ์ใบโอนย้าย',
    subTitle2: 'PDF',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'print-receipt',
    screen: 'OrderChoice',
  },
  {
    title: 'กลับสู่เมนูหลัก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorDuodenary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'newPage',
    methodName: null,
    screen: 'OrderChoice',
  },
];

export const orderOutStandingPreProcessButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'pre-process',
    screen: null,
  },
  {
    title: 'ย้อนกลับ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'back',
    screen: null,
  },
];

export const orderOutStandingKeyStepButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'process',
    screen: null,
  },
  {
    title: 'ย้อนกลับ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'back',
    screen: null,
  },
];

export const orderOutStandingCreateStepButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'create',
    screen: null,
  },
  {
    title: 'ล้างข้อมูล',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'create-step-clear',
    screen: null,
  },
  {
    title: 'ย้อนกลับ',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'back',
    screen: null,
  },
];

export const orderOutStandingSummaryStepButtonGroup = [
  {
    title: 'พิมพ์ใบเสร็จ',
    subTitle: 'พิมพ์ใบโอนย้าย',
    subTitle2: 'PDF',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'print-receipt',
    screen: 'OrderChoice',
  },
  {
    title: 'กลับสู่เมนูหลัก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: MainTheme.colorDuodenary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'newPage',
    methodName: null,
    screen: 'OrderChoice',
  },
];

export const mileFormButtonGroup = [
  {
    title: 'ยืนยัน',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
  },
  // {
  //     title: 'ยกเลิก',
  //     buttonStyle: {backgroundColor: MainTheme.colorSecondary, height: 60, borderRadius: 0},
  //     titleStyle: {color: '#000'},
  //     containerStyle: {flex: 1},
  //     size: 50,
  //     methodType: 'function',
  //     methodName: 'clear'
  // },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: '#E5E4E2',
      borderWidth: 0.3,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'back',
  },
];

export const settingListItems = [
  {
    title: strings('setting.printer'),
    iconStyle: { width: 25, height: 25, alignSelf: 'center' },
    subIconStyle: { color: MainTheme.colorDanger },
    imgSrc: require('../images/Printer_Green.png'),
    subImgSrc: require('../images/Printer_Disconnect_Green.png'),
    methodType: 'new-page',
    methodName: null,
    screen: 'Bluetooth',
  },
  // {
  //   title: strings('setting.ERP_setting'),
  //   iconStyle: {color: MainTheme.colorPrimary},
  //   iconName: 'printer-settings',
  //   iconType: 'material-community',
  //   methodType: 'new-page',
  //   methodName: null,
  //   screen: 'PaperlessSetting',
  // },
  {
    title: strings('setting.sync_data'),
    iconStyle: { color: MainTheme.colorPrimary },
    subIconStyle: { color: MainTheme.colorDanger },
    iconName: 'sync',
    iconType: 'ant-design',
    size: 50,
    methodType: 'function',
    methodName: 'syncUserConfig',
    screen: null,
  },
  {
    title: strings('setting.web_service'),
    iconStyle: { color: MainTheme.colorPrimary },
    iconName: 'server',
    iconType: 'ant-design',
    size: 50,
    methodType: null,
    methodName: null,
    screen: null,
  },
  {
    title: strings('setting.app_version', { version: APP_VERSION_FULL }),
    iconStyle: { color: MainTheme.colorPrimary },
    iconName: 'mobile1',
    iconType: 'ant-design',
    methodType: null,
    methodName: null,
    screen: null,
  },
  {
    title: strings('setting.helper', { version: APP_VERSION_FULL }),
    iconStyle: { width: 35, height: 35 },
    iconName: 'tool',
    iconType: 'ant-design',
    imgSrc: require('../images/manual.png'),
    methodType: 'new-page',
    methodName: null,
    screen: 'Manual',
    // params: { title: 'คู่มือการใช้งาน', source: 'bundle-assets://pdf/BplusVansalesonMobileAndroid.pdf' }
  },
  {
    title: strings('setting.faq', { version: APP_VERSION_FULL }),
    iconStyle: { width: 35, height: 35 },
    iconName: 'infocirlceo',
    iconType: 'ant-design',
    imgSrc: require('../images/faq.png'),
    methodType: 'new-page',
    methodName: null,
    screen: 'FAQ',
    // params: { title: 'คำถามที่พบบ่อย', source: 'bundle-assets://pdf/FAQ.pdf' }
  },
  {
    title: strings('setting.logout'),
    iconStyle: { width: 35, height: 35 },
    iconName: 'poweroff',
    iconType: 'ant-design',
    size: 50,
    methodType: 'function',
    methodName: 'logout',
    imgSrc: require('../images/LogOut.png'),
    screen: 'Auth',
  },
];

export const checkInFormButtonGroup = [
  {
    title: 'เช็คอิน',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
  },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorTertiary,
    },
    titleStyle: { color: MainTheme.colorDuodenary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'back',
  },
];

export const storeChoiceListItems = [
  {
    title: 'สอบถามสินค้าคงเหลือ',
    iconStyle: { color: MainTheme.colorPrimary },
    subIconStyle: { color: MainTheme.colorDanger },
    iconName: 'isv',
    iconType: 'ant-design',
    size: 30,
    methodType: 'new-page',
    methodName: null,
    screen: 'StockDropPoint',
  },
  {
    title: 'โอนย้ายสินค้า',
    iconStyle: { color: MainTheme.colorPrimary },
    iconName: 'swap',
    iconType: 'ant-design',
    size: 30,
    methodType: 'new-page',
    methodName: null,
    screen: 'StockTransfer',
  },
];

export const customerChoices = [
  {
    title: strings('customer.add'),
    iconStyle: { color: MainTheme.colorPrimary },
    subIconStyle: { color: MainTheme.colorDanger },
    iconName: 'adduser',
    iconType: 'ant-design',
    imgSrc: require('../images/customer_add.png'),
    size: 25,
    methodType: 'new-page',
    methodName: null,
    screen: 'CustomerAdd',
  },
  {
    title: strings('customer.profile'),
    iconStyle: { color: MainTheme.colorPrimary },
    iconName: 'user',
    iconType: 'ant-design',
    imgSrc: require('../images/customer_infomation.png'),
    size: 25,
    methodType: 'new-page',
    methodName: null,
    screen: 'CustomerProfile',
  },
  // {
  //     title: strings('customer.destination'),
  //     iconStyle: {color: MainTheme.colorPrimary},
  //     iconName: 'routes',
  //     iconType: 'material-community',
  //     size: 25,
  //     methodType: 'new-page',
  //     methodName: null,
  //     screen: 'CustomerDestination'
  // }
];

export const settingConfigButtonGroup = [
  {
    title: strings('login_setting.connect'),
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      width: 100,
      elevation: 0,
      borderColor: MainTheme.colorPrimary,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
  },
  {
    title: strings('login_setting.clear'),
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      width: 100,
      elevation: 0,
      borderWidth: 0.5,
      borderColor: MainTheme.colorButtonBorder,
    },
    titleStyle: { color: MainTheme.colorPrimary },
    size: 50,
    methodType: 'function',
    methodName: 'clear',
  },
  {
    //title: strings('login_setting.back'),
    title: strings('login_setting.saveandback'),
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      width: 100,
      elevation: 0,
      borderWidth: 0.5,
      borderColor: MainTheme.colorButtonBorder,
    },
    titleStyle: { color: MainTheme.colorPrimary },
    size: 50,
    methodType: 'function',
    methodName: 'back',
  },
];

export const paymentButtonGroup = [
  {
    title: 'ตกลง',
    buttonStyle: {
      backgroundColor: MainTheme.colorTertiary,
      width: 100,
      elevation: 0,
      borderColor: MainTheme.colorTertiary,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
  },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      width: 100,
      elevation: 0,
      borderWidth: 0.5,
      borderColor: MainTheme.colorButtonBorder,
    },
    titleStyle: { color: MainTheme.colorDuodenary },
    size: 50,
    methodType: 'function',
    methodName: 'cancel',
  },
];

export const surveyFormButtonGroup = [
  {
    title: 'ยืนยัน',
    buttonStyle: {
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      borderRadius: 0,
    },
    titleStyle: { color: MainTheme.colorSecondary },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'confirm',
  },
  {
    title: 'ยกเลิก',
    buttonStyle: {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
    },
    titleStyle: { color: '#000' },
    containerStyle: { flex: 1 },
    size: 50,
    methodType: 'function',
    methodName: 'cancel',
  },
];

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// Menu Items /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// Menu Report ////////////////////////////////////////

export const reportMenu = [
  {
    title: strings('report.sales_summary_report_by_product_type'),
    screen: 'ReportSummary',
    type: 'SalesOrderByCategory',
    pattern: 'A',
    seachForm: 'A',
  },
  {
    title: strings('report.sales_summary_report_by_product'),
    screen: 'ReportSummary',
    type: 'SalesOrderByProduct',
    pattern: 'A',
    seachForm: 'A',
  },
  {
    title: strings('report.sales_summary_report_by_customer_line'),
    screen: 'ReportSummary',
    type: 'SalesOrderByArline',
    pattern: 'A',
    seachForm: 'A',
  },
  //------------

  {
    title: strings('report.sales_summary_report_by_document_type'),
    screen: 'ReportSummary',
    type: 'SalesOrderByDocType',
    pattern: 'A',
    seachForm: 'A',
  },
  // {
  //   title: strings('report.payment_type_summary_report'),
  //   screen: 'ReportSummary',
  //   type: 'SalesOrderByPmt',
  //   pattern: 'A',
  //   seachForm: 'A',
  // },
  {
    title: strings('report.sales_detail_report_by_document'),
    screen: 'ReportSummary',
    type: 'DocumentItemsDetails',
    pattern: 'A',
    seachForm: 'A',
  },
  {
    title: strings('report.sales_summary_report_by_document'),
    screen: 'ReportSummary',
    type: 'DocumentItems',
    pattern: 'A',
    seachForm: 'A',
  },
  //----------------------
  // {
  //   title: strings('report.performance_reports_based_on_customer_lines'),
  //   screen: 'ReportSummary',
  //   type: 'PerformanceByArlineItem',
  //   pattern: 'B',
  //   seachForm: 'A',
  // },
  // {
  //   title: strings('report.performance_report_by_product_category'),
  //   screen: 'ReportSummary',
  //   type: 'PeformanceByProductCategory',
  //   pattern: 'B',
  //   seachForm: 'A',
  // },
  // {
  //   title: strings('report.sales_performance_report_by_saleman'),
  //   screen: 'ReportSummary',
  //   type: 'SalesOrderBySaleman',
  //   pattern: 'C',
  //   seachForm: 'B',
  // },
  // {
  //   title: strings('report.stock_report_from_warehouse'),
  //   screen: 'ReportSummary',
  //   type: 'StockBalanceByWL',
  //   pattern: 'D',
  //   seachForm: 'B',
  // },
];

///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// LOV Items ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

export const manualListItems = [
  {
    title: '1.การเข้าใช้งาน',
    source: 'bundle-assets://pdf/1.pdf',
  },
  {
    title: '2.การเลือกลูกค้า',
    source: 'bundle-assets://pdf/2.pdf',
  },
  {
    title: '3.การบันทึกขายเชื่อ',
    source: 'bundle-assets://pdf/3.pdf',
  },
  {
    title: '4.การบันทึกขายสด',
    source: 'bundle-assets://pdf/4.pdf',
  },
  {
    title: '5.การบันทึกใบรับคืนเชื่อ',
    source: 'bundle-assets://pdf/5.pdf',
  },
  {
    title: '6.การบันทึกใบจอง',
    source: 'bundle-assets://pdf/6.pdf',
  },
  {
    title: '7.การบันทึกเสนอราคา',
    source: 'bundle-assets://pdf/7.pdf',
  },
  {
    title: '8.การบันทึกเยี่ยม',
    source: 'bundle-assets://pdf/8.pdf',
  },
  {
    title: '9.การบันทึกสำรวจ',
    source: 'bundle-assets://pdf/9.pdf',
  },
  {
    title: '10.การบันทึกเช็คอิน',
    source: 'bundle-assets://pdf/10.pdf',
  },
  {
    title: '11.การบันทึกเลขไมล์',
    source: 'bundle-assets://pdf/11.pdf',
  },
  {
    title: '12.บิลเอกสาร',
    source: 'bundle-assets://pdf/12.pdf',
  },
  {
    title: '13.ตรวจสอบสินค้าคงเหลือ',
    source: 'bundle-assets://pdf/13.pdf',
  },
  {
    title: '14.การโอนย้ายสินค้า',
    source: 'bundle-assets://pdf/14.pdf',
  },

  {
    title: '15.การสรุปงาน',
    source: 'bundle-assets://pdf/15.pdf',
  },
  {
    title: '16.แสดงยอดขาย',
    source: 'bundle-assets://pdf/16.pdf',
  },
  {
    title: '17.เพิ่มลูกค้าใหม่',
    source: 'bundle-assets://pdf/17.pdf',
  },
  {
    title: '18.ข้อมูลลูกค้า',
    source: 'bundle-assets://pdf/17.pdf',
  },
  {
    title: '19.การตั้งค่า',
    source: 'bundle-assets://pdf/19.pdf',
  },
  {
    title: '20.ออกจากระบบ',
    source: 'bundle-assets://pdf/20.pdf',
  },
];

export const paymentLOVItems = [
  {
    label: 'ขายสด',
    value: '1',
  },
  {
    label: 'ขายเชื่อ',
    value: '0',
  },
];

export const returnLOVItems = [
  {
    label: 'รับคืนเชื่อ',
    value: '0',
  },
  // {
  //   label: 'รับคืนสด',
  //   value: '1',
  // },
];

///////////////////////////////////////////////////////////////////////////////////////////////

export const monthItems = {
  thaiMonthNames: [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ],
  thaimonthNamesShort: [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ],
  thaimonthNamesNumber: [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ],
};

export const settingErpChoice = [
  {
    label: 'ไม่พิมพ์',
    value: 0,
  },
  {
    label: 'พิมพ์',
    value: 1,
  },
];
