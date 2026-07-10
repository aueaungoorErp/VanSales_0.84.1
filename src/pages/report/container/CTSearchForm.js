import moment from 'moment';
import React, { Component } from 'react';
import { Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNHTMLtoPDF, { generatePDF } from 'react-native-html-to-pdf';
import { connect } from 'react-redux';
import { getReportData, getReportDataNoGroup, getReportV3, setInitialState } from '../../../action/report';
import { systemCheck } from '../../../action/setting';
import IDurationDateSearchForm from '../../../component/input/IDurationDateSearchForm';
import { printReport } from '../../../constant/printing-pdf-lov';
import { BluetoothFinder, BplusPrinting } from '../../../module';
import Navigator from '../../../services/Navigator';
import { toBuddhistYear } from '../../../utils/Date';
import { getSettingConfig, getUserToken } from '../../../utils/Token';
import { getCustomerReportPerformance } from '../customer-line-performance/action';
import { getProductCategoryReportPerformance } from '../product-category-performance/action';
import { getSalespersonSalesPerformance } from '../salesperson-sales-performance/action';
import { getStockBalanceByLocation, getStockBalanceByLocationReportRows } from '../stock-balance-by-location/action';
const REPORT_ERROR_LATEST_KEY = '@ReportErrorLatest';
const REPORT_ERROR_HISTORY_KEY = '@ReportErrorHistory';
const REPORT_ERROR_HISTORY_LIMIT = 20;
class CTSearchForm extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: null,
      dateTo: null,
      reportParams: {
        title: null,
        type: null,
        pattern: null,
        seachForm: null
      },
      selected: null,
      dialogMessage: null,
      isLoading: false,
      loadingMessage: '',
      errorMessage: null,
      userToken: null
    };
    this._getUserToken();
  }
  componentDidMount = props => {
    this._isMounted = true;
    this.props.setInitialState();
    this._prepareData();
  };
  componentWillUnmount = props => {
    this._isMounted = false;
  };
  _prepareData = () => {
    const {
      routes,
      index
    } = Navigator.getCurrentRoute();
    const {
      params
    } = routes[index].params;
    this._setReportParams(params);
  };
  _getUserToken = async () => {
    const userToken = await getUserToken();
    if (userToken) {
      this._isMounted && (await this.setState(oldState => {
        return {
          userToken: userToken
        };
      }));
    }
  };
  _normalizeErrorForStorage = error => {
    if (error instanceof Error) {
      return {
        message: error.message,
        name: error.name,
        stack: error.stack || null
      };
    }
    if (error && typeof error === 'object') {
      return {
        message: error.message || JSON.stringify(error),
        name: error.name || null,
        stack: error.stack || null,
        raw: JSON.stringify(error)
      };
    }
    return {
      message: String(error),
      name: null,
      stack: null
    };
  };
  _buildReportErrorPayload = (source, error, extra = {}) => {
    const normalizedError = this._normalizeErrorForStorage(error);
    return {
      timestamp: new Date().toISOString(),
      source,
      error: normalizedError,
      reportType: this.state.reportParams?.type || null,
      reportPattern: this.state.reportParams?.pattern || null,
      reportTitle: this.state.reportParams?.title || null,
      dateFrom: this.state.dateFrom || null,
      dateTo: this.state.dateTo || null,
      selected: this.state.selected || null,
      extra
    };
  };
  _persistReportError = async (source, error, extra = {}) => {
    try {
      const payload = this._buildReportErrorPayload(source, error, extra);
      await AsyncStorage.setItem(REPORT_ERROR_LATEST_KEY, JSON.stringify(payload));
      const existingHistory = (await AsyncStorage.getItem(REPORT_ERROR_HISTORY_KEY)) || '[]';
      let parsedHistory = [];
      try {
        parsedHistory = JSON.parse(existingHistory);
      } catch (historyError) {
        parsedHistory = [];
      }
      const nextHistory = [payload, ...parsedHistory].slice(0, REPORT_ERROR_HISTORY_LIMIT);
      await AsyncStorage.setItem(REPORT_ERROR_HISTORY_KEY, JSON.stringify(nextHistory));
    } catch (storageError) {
      console.log('persist report error failed:', storageError);
    }
  };
  _onSearch = async (dateFrom, dateTo) => {
    try {
      await this._setState('isLoading', true);
      await this._setState('loadingMessage', 'กำลังโหลดข้อมูลรายงาน...');
      await this._setState('errorMessage', null);
      await this._setState('dateFrom', dateFrom);
      await this._setState('dateTo', dateTo);
      if (this.state.reportParams.type === 'PerformanceByArlineItem') {
        await this.props.getCustomerReportPerformance({
          FROM: dateFrom,
          TO: dateTo
        });
        return;
      }
      if (this.state.reportParams.type === 'PeformanceByProductCategory') {
        await this.props.getProductCategoryReportPerformance({
          FROM: dateFrom,
          TO: dateTo
        });
        return;
      }
      if (this.state.reportParams.type === 'DocumentItems' && this.props.getSalesSummaryByDocumentViaHook) {
        await this.props.getSalesSummaryByDocumentViaHook({
          FROM: dateFrom,
          TO: dateTo
        });
        return;
      }
      if (this.state.reportParams.type === 'SalesOrderBySaleman') {
        const fetchSalespersonPerformance = this.props.getSalespersonSalesPerformanceViaHook || this.props.getSalespersonSalesPerformance;
        await fetchSalespersonPerformance({
          FROM: dateFrom
        });
        return;
      }
      if (this.state.reportParams.type === 'StockBalanceByWL') {
        await this.props.getStockBalanceByLocation({
          FROM: dateFrom
        });
        return;
      }
      const reportParams = {
        FROM: moment(dateFrom, 'DD/MM/YYYY').add(1, 'days').toJSON(),
        TO: moment(dateTo, 'DD/MM/YYYY').add(1, 'days').toJSON(),
        WL_KEY: this.state.reportParams.type === 'StockBalanceByWL' ? this.state.selected : null
      };
      if (this.state.reportParams.type === 'SalesOrderByPmt') {}

      // เรียก getReportV3 และรอมันเสร็จ (นี่คือ API หลักที่แสดงข้อมูล)
      await this.props.getReportV3(this.state.reportParams.type, this.state.reportParams.pattern, reportParams);
      // เรียก getReportDataNoGroup แบบ "fire and forget" (ไม่ต้อง await)
      // ถ้า timeout หรือ error ก็ไม่ส่งผลต่อ modal loading
      if (this.state.reportParams.type === 'SalesOrderByPmt') {} else {
        this.props.getReportDataNoGroup(this.state.reportParams.type, this.state.reportParams.pattern, reportParams).catch(err => {
          this._persistReportError('getReportDataNoGroup(background)', err, {
            reportParams
          });
          // ไม่ต้องทำอะไร เพราะข้อมูลหลักมาจาก getReportV3 แล้ว
        });
      }
    } catch (error) {
      console.log('_onSearch error:', error);
      await this._persistReportError('_onSearch', error, {
        requestDateFrom: dateFrom,
        requestDateTo: dateTo
      });
      const errorMessage = error?.message || error;
      if (errorMessage !== 'ไม่พบการส่งรหัสหน่วยรถ') {
        await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + errorMessage);
      }
    } finally {
      // ใช้ finally เพื่อให้แน่ใจว่า loading จะถูกปิดเสมอ

      this._isMounted && this.setState({
        loadingMessage: '',
        isLoading: false
      });
    }
  };
  _printPDF = async () => {
    try {
      await this._setState('isLoading', true);
      await this._setState('loadingMessage', 'กำลังโหลดข้อมูลรายงาน...');
      const userToken = await getUserToken();
      const {
        baseUrl,
        vanCNFMachine,
        SALESMAN
      } = await getSettingConfig();
      const {
        VANCONFIG
      } = await getUserToken();
      const resolvedSalesman = userToken?.SALESMAN || SALESMAN || {
        SLMN_NAME: ''
      };
      const response = await this.props.systemCheck({
        baseUrl: baseUrl,
        vanCNFMachine: vanCNFMachine || VANCONFIG?.VANCNF_MACHINE
      });
      if (response.ResponseCode == '200') {
        const {
          RESPONSE_DATETIME,
          ResponseData
        } = response;
        const res = JSON.parse(ResponseData);
        // const vanConfig = res.Vans0103[0];
        const vanConfig = VANCONFIG;
        let printTime = RESPONSE_DATETIME;
        const reportPrintTime = RESPONSE_DATETIME;
        //let date = toBuddhistYear(printTime[0], '-', 2);

        //printTime = printTime[1].split('.');

        const dateFrom = toBuddhistYear(this.state.dateFrom);
        const dateTo = toBuddhistYear(this.state.dateTo);
        let fileName = 'report';
        if (this.state.reportParams.type === 'SalesOrderByCategory') fileName = 'salesorderbycategory';else if (this.state.reportParams.type === 'SalesOrderByProduct') fileName = 'salesorderbyproduct';else if (this.state.reportParams.type === 'SalesOrderByArline') fileName = 'salesorderbyarline';else if (this.state.reportParams.type === 'SalesOrderByDocType') fileName = 'salesorderbydoctype';else if (this.state.reportParams.type === 'SalesOrderByPmt') fileName = 'salesorderbypmt';else if (this.state.reportParams.type === 'DocumentItems') fileName = 'documentitems';else if (this.state.reportParams.type === 'DocumentItemsDetails') fileName = 'documentitemsdetails';else if (this.state.reportParams.type === 'PerformanceByArlineItem') fileName = 'performancebyarlineitem';else if (this.state.reportParams.type === 'PeformanceByProductCategory') fileName = 'peformancebyproductcategory';else if (this.state.reportParams.type === 'SalesOrderBySaleman') fileName = 'salesorderbysaleman';else if (this.state.reportParams.type === 'StockBalanceByWL') fileName = 'stockbalancebywl';
        if (this.state.reportParams.pattern === 'A') {
          if (this.props.report.data && this.props.report.data.ITEMS //&&
          // this.props.report.data.RPT_DATA.RESULT
          ) {
            const html = printReport(this.state.reportParams.title, this.state.reportParams.type, this.props.report.data, this.props.report.data.ITEMS, vanConfig, userToken.COMPANYINFO, resolvedSalesman, dateFrom, dateTo, reportPrintTime);
            let options = {
              html: html,
              fileName: fileName,
              directory: 'Documents/bplus_vansales/',
              base64: true
            };
            let file = await this._generatePDFFile(options);
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
            this._pdfAlertDialog(file.filePath);
          } else {
            await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน');
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
          }
        } else if (this.state.reportParams.pattern === 'B') {
          if (this.props.report.data && this.props.report.data.RPT_DATA && this.props.report.data.RPT_DATA.RESULT || this.state.reportParams.type === 'PeformanceByProductCategory' && this.props.report.data) {
            const html = printReport(this.state.reportParams.title, this.state.reportParams.type, this.props.report.data, [], VANCONFIG, userToken.COMPANYINFO, resolvedSalesman, dateFrom, dateTo, reportPrintTime);
            let options = {
              html: html,
              fileName: fileName,
              directory: 'Documents/bplus_vansales/',
              base64: true
            };
            let file = await this._generatePDFFile(options);
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
            this._pdfAlertDialog(file.filePath);
          } else {
            await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน');
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
          }
        } else if (this.state.reportParams.pattern === 'C') {
          if (this.props.report.data) {
            const html = printReport(this.state.reportParams.title, this.state.reportParams.type, this.props.report.data, [], VANCONFIG, userToken.COMPANYINFO, SALESMAN, dateFrom, dateTo, reportPrintTime);
            let options = {
              html: html,
              fileName: fileName,
              directory: 'Documents/bplus_vansales/',
              base64: true
            };
            let file = await this._generatePDFFile(options);
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
            this._pdfAlertDialog(file.filePath);
          } else {
            await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน');
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
          }
        } else if (this.state.reportParams.pattern === 'D') {
          const stockBalanceRows = getStockBalanceByLocationReportRows(this.props.report.data);
          if (stockBalanceRows.length > 0) {
            const html = printReport(this.state.reportParams.title, this.state.reportParams.type, this.props.report.data, stockBalanceRows, userToken.VANCONFIG || VANCONFIG, userToken.COMPANYINFO, resolvedSalesman, dateFrom, dateTo, reportPrintTime);
            let options = {
              html: html,
              fileName: fileName,
              directory: 'Documents/bplus_vansales/',
              base64: true
            };
            let file = await this._generatePDFFile(options);
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
            this._pdfAlertDialog(file.filePath);
          } else {
            await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน');
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
          }
        }
      } else if (response.STATUS === '10' && response.ERROR_MESSAGES[0]) {
        await this._setState('loadingMessage', '');
        await this._setState('isLoading', false);
        await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + response.ERROR_MESSAGES[0]);
      }
    } catch (error) {
      await this._persistReportError('_printPDF', error, {
        baseUrl: (await getSettingConfig())?.baseUrl || null
      });
      await this._setState('loadingMessage', '');
      await this._setState('isLoading', false);
      await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error);
    }
  };
  _pdfAlertDialog = path => Alert.alert('ประกาศ', 'สร้างไฟล์ PDF สำเร็จ', [{
    text: 'แสดง',
    onPress: () => Navigator.navigate('PDFPreview', {
      title: '',
      source: path
    }),
    style: 'cancel'
  }, {
    text: 'ปิด',
    onPress: () => {},
    style: 'cancel'
  }], {
    cancelable: false
  });
  _generatePDFFile = async options => {
    if (RNHTMLtoPDF && typeof RNHTMLtoPDF.convert === 'function') {
      return RNHTMLtoPDF.convert(options);
    }
    if (typeof generatePDF === 'function') {
      return generatePDF(options);
    }
    throw new Error('ไม่พบ PDF module ใน runtime กรุณา build แอป Android ใหม่');
  };
  _printerReport = async () => {
    try {
      if (this.props.bluetooth.state !== 'connected') {
        this._bluetoothAlertDialog();
        return;
      }
      await this._setState('isLoading', true);
      await this._setState('loadingMessage', 'กำลังโหลดข้อมูลรายงาน...');
      // this._setDialogMessage('กำลังโหลดข้อมูลรายงาน...')

      if (this.props.bluetooth.state == 'connected') {
        const userToken = await getUserToken();
        const {
          baseUrl,
          vanCNFMachine,
          SALESMAN
        } = await getSettingConfig();
        const {
          VANCONFIG
        } = await getUserToken();
        const resolvedSalesman = userToken?.SALESMAN || SALESMAN || {
          SLMN_NAME: ''
        };
        const response = await this.props.systemCheck({
          baseUrl: baseUrl,
          vanCNFMachine: VANCONFIG
        });
        if (response.ResponseCode == '200') {
          const {
            RESPONSE_DATETIME
          } = response;
          let printTime = RESPONSE_DATETIME;
          const reportPrintTime = RESPONSE_DATETIME;
          //let date = toBuddhistYear(printTime[0], '-', 2);

          //printTime = printTime[1].split('.');

          const dateFrom = toBuddhistYear(this.state.dateFrom);
          const dateTo = toBuddhistYear(this.state.dateTo);

          //แก้เรื่อง พิมพ์ข้อมูลเยอะๆ
          // let i = 0;
          // let u = [];
          // for (let x of this.props.report.data.ITEMS[0].ITEMS) {
          //   i++;
          //   if (i == 1) {
          //     u.push(x);
          //     break;
          //   };
          // }
          // this.props.report.data.ITEMS[0].ITEMS = u;
          //แก้เรื่อง พิมพ์ข้อมูลเยอะๆ

          if (this.state.reportParams.pattern === 'A') {
            if (this.props.report.data && this.props.report.data.ITEMS
            // this.props.report.data.RPT_DATA &&
            // this.props.report.data.RPT_DATA.RESULT
            ) {
              BplusPrinting.printReport(this.state.reportParams.title, this.state.reportParams.type, this.props.report.data,
              //this.props.report.data.RPT_DATA.RESULT,
              this.props.report.data.ITEMS,
              //uu,
              userToken.VANCONFIG, userToken.COMPANYINFO,
              //userToken.SALESMAN,
              resolvedSalesman, dateFrom, dateTo, printTime);
              await this._setState('loadingMessage', '');
              await this._setState('isLoading', false);
            } else {
              await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน');
            }
          } else if (this.state.reportParams.pattern === 'B') {
            if (this.props.report.data && this.props.report.data.RPT_DATA && this.props.report.data.RPT_DATA.RESULT || this.state.reportParams.type === 'PeformanceByProductCategory' && this.props.report.data) {
              BplusPrinting.printReport(this.state.reportParams.title, this.state.reportParams.type, this.props.report.data, [], userToken.VANCONFIG, userToken.COMPANYINFO, resolvedSalesman, dateFrom, dateTo, printTime);
              await this._setState('loadingMessage', '');
              await this._setState('isLoading', false);
            } else {
              await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน');
            }
          } else if (this.state.reportParams.pattern === 'C') {
            if (this.props.report.data) {
              BplusPrinting.printReport(this.state.reportParams.title, this.state.reportParams.type, this.props.report.data, [], userToken.VANCONFIG, userToken.COMPANYINFO, resolvedSalesman, dateFrom, dateTo, reportPrintTime);
              await this._setState('loadingMessage', '');
              await this._setState('isLoading', false);
            } else {
              await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน');
            }
          } else if (this.state.reportParams.pattern === 'D') {
            const stockBalanceRows = getStockBalanceByLocationReportRows(this.props.report.data);
            if (stockBalanceRows.length > 0) {
              BplusPrinting.printReport(this.state.reportParams.title, this.state.reportParams.type, this.props.report.data, stockBalanceRows, userToken.VANCONFIG, userToken.COMPANYINFO, resolvedSalesman, dateFrom, dateTo, reportPrintTime);
              await this._setState('loadingMessage', '');
              await this._setState('isLoading', false);
            } else {
              await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน');
            }
          }
        } else if (response.STATUS === '10' && response.ERROR_MESSAGES[0]) {
          await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + response.ERROR_MESSAGES[0]);
        }
      }
    } catch (error) {
      await this._persistReportError('_printerReport', error);
      await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error);
    }
  };
  _setState = async (key, value) => {
    this._isMounted && (await this.setState(oldState => {
      return {
        [key]: value
      };
    }));
  };
  _setReportParams = async value => {
    this._isMounted && (await this.setState(oldState => {
      return {
        reportParams: value
      };
    }));
  };
  _bluetoothAlertDialog = () => Alert.alert('ประกาศ', 'เนื่องจากไม่ได้ทำการ Connect printer ต้องการจะไปที่หน้า Bluetooth setting หรือไม่', [{
    text: 'ยกเลิก',
    onPress: () => {},
    style: 'cancel'
  }, {
    text: 'ยืนยัน',
    onPress: () => this._goToBluetoothSetting()
  }], {
    cancelable: false
  });
  _goToBluetoothSetting = () => {
    BluetoothFinder.checkBluetoothEnable(value => {
      if (value.result) {
        Navigator.navigate('Bluetooth');
      }
    });
  };
  render() {
    const wareLocationListItems = this.props.masterData.wareLocationListItems.map(item => ({
      label: item.WL_NAME,
      value: item.WL_KEY
    }));
    const useInlineReportLayout = this.state.reportParams.type === 'SalesOrderBySaleman' || this.state.reportParams.type === 'StockBalanceByWL';
    return <IDurationDateSearchForm title={this.state.reportParams.title} inlineActionsWithFields={useInlineReportLayout} titleFullWidth={useInlineReportLayout} hideRight={this.state.reportParams.seachForm === 'B' ? true : false}
    datePickerOverlayCardStyle={styles.reportDatePickerOverlayCard}
    // showDropdown={this.state.reportParams.type === 'StockBalanceByWL'}
    selected={this.state.selected} selectItems={wareLocationListItems} setState={this._setState} onSearch={this._onSearch} printerReport={this._printerReport} printPDF={this._printPDF} setStateFromParent={this._setState} errorMessage={this.state.errorMessage} isLoading={this.state.isLoading} loadingMessage={this.state.loadingMessage} printEnabled={this.state.userToken && this.state.userToken.VANCONFIG && this.state.userToken.VANCONFIG.VANCNF_RPT_ALLCONFIG && this.state.userToken.VANCONFIG.VANCNF_RPT_ALLCONFIG !== 2 && this.state.userToken.VANCONFIG.VANCNF_RPT_ALLCONFIG !== 3 ? false : true} printerType={this.props.bluetooth.printingType} />;
  }
}
const styles = StyleSheet.create({
  reportDatePickerOverlayCard: {
    marginTop: 56
  }
});
const mapStateToProps = state => ({
  bluetooth: state.bluetooth,
  report: state.report,
  masterData: state.masterData
});
const mapDispatchToProps = dispatch => {
  return {
    setInitialState: () => dispatch(setInitialState()),
    getReportData: (uri, pattern, data) => dispatch(getReportData(uri, pattern, data)),
    getReportDataNoGroup: (uri, pattern, data) => dispatch(getReportDataNoGroup(uri, pattern, data)),
    getCustomerReportPerformance: criteria => dispatch(getCustomerReportPerformance(criteria)),
    getProductCategoryReportPerformance: criteria => dispatch(getProductCategoryReportPerformance(criteria)),
    getSalespersonSalesPerformance: criteria => dispatch(getSalespersonSalesPerformance(criteria)),
    getStockBalanceByLocation: criteria => dispatch(getStockBalanceByLocation(criteria)),
    getReportV3: (uri, pattern, data) => dispatch(getReportV3(uri, pattern, data)),
    systemCheck: data => dispatch(systemCheck(data))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CTSearchForm);
