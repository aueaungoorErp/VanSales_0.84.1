import moment from 'moment';
import React, { Component } from 'react';
import { Alert } from 'react-native';
import RNHTMLtoPDF, { generatePDF } from 'react-native-html-to-pdf';
import { connect } from 'react-redux';
import {
  getReportData,
  getReportDataNoGroup,
  getReportV3,
  setInitialState,
} from '../../../action/report';
import { systemCheck } from '../../../action/setting';
import IDurationDateSearchForm from '../../../component/input/IDurationDateSearchForm';
import { printReport } from '../../../constant/printing-pdf-lov';
import { BluetoothFinder, BplusPrinting } from '../../../module';
import Navigator from '../../../services/Navigator';
import { toBuddhistYear } from '../../../utils/Date';
import { getSettingConfig, getUserToken } from '../../../utils/Token';

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
        seachForm: null,
      },
      selected: null,
      dialogMessage: null,
      isLoading: false,
      loadingMessage: '',
      errorMessage: null,
      userToken: null,
    };

    this._getUserToken();
  }

  componentDidMount = (props) => {
    this._isMounted = true;
    this.props.setInitialState();
    this._prepareData();
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
  };

  _prepareData = () => {
    const {routes, index} = Navigator.getCurrentRoute();
    const {params} = routes[index].params;
    this._setReportParams(params);
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      this._isMounted &&
        (await this.setState((oldState) => {
          return {
            userToken: userToken,
          };
        }));
    }
  };

  _onSearch = async (dateFrom, dateTo) => {
    try {
      await this._setState('isLoading', true);
      await this._setState('loadingMessage', 'กำลังโหลดข้อมูลรายงาน...');
      await this._setState('errorMessage', null);

        console.log("จาก 3:" , dateFrom);
        console.log("ถึง 3 :" , dateTo);
      await this._setState('dateFrom', dateFrom);
      await this._setState('dateTo', dateTo);

      const reportParams = {
        FROM: moment(dateFrom, 'DD/MM/YYYY').add(1, 'days').toJSON(),
        TO: moment(dateTo, 'DD/MM/YYYY').add(1, 'days').toJSON(),
        WL_KEY:
          this.state.reportParams.type === 'StockBalanceByWL'
            ? this.state.selected
            : null,
      };

      // เรียก getReportV3 และรอมันเสร็จ (นี่คือ API หลักที่แสดงข้อมูล)
      await this.props.getReportV3(
        this.state.reportParams.type,
        this.state.reportParams.pattern,
        reportParams,
      );

      console.log("จาก 4:" , this.state.dateFrom);
      console.log("ถึง 4 :" , this.state.dateTo);

      // เรียก getReportDataNoGroup แบบ "fire and forget" (ไม่ต้อง await)
      // ถ้า timeout หรือ error ก็ไม่ส่งผลต่อ modal loading
      this.props.getReportDataNoGroup(
        this.state.reportParams.type,
        this.state.reportParams.pattern,
        reportParams,
      ).catch(err => {
        console.log('getReportDataNoGroup background error (ignored):', err);
        // ไม่ต้องทำอะไร เพราะข้อมูลหลักมาจาก getReportV3 แล้ว
      });

    } catch (error) {
      console.log('_onSearch error:', error);
      if(error !== 'ไม่พบการส่งรหัสหน่วยรถ'){
        await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error);
      }
    } finally {
      // ใช้ finally เพื่อให้แน่ใจว่า loading จะถูกปิดเสมอ
      console.log('_onSearch finally - closing loading modal');
      this._isMounted && this.setState({ loadingMessage: '', isLoading: false });
    }
  };

  _printPDF = async () => {

    try {



      await this._setState('isLoading', true);
      await this._setState('loadingMessage', 'กำลังโหลดข้อมูลรายงาน...');

      const userToken = await getUserToken();
      const {baseUrl, vanCNFMachine, SALESMAN} = await getSettingConfig();
      const {VANCONFIG} = await getUserToken();
      const response = await this.props.systemCheck({
        baseUrl: baseUrl,
        vanCNFMachine: VANCONFIG,
      });

      if (response.ResponseCode == '200') {
        const {RESPONSE_DATETIME, ResponseData} = response;
        console.log('res 1', ResponseData);

        const res = JSON.parse(ResponseData);
        // const vanConfig = res.Vans0103[0];
       const vanConfig = VANCONFIG;




        console.log('res 2', JSON.stringify(res));
        console.log('userToken ', JSON.stringify(userToken));
        let printTime = RESPONSE_DATETIME;
        const reportPrintTime = RESPONSE_DATETIME;
        //let date = toBuddhistYear(printTime[0], '-', 2);

        //printTime = printTime[1].split('.');

     console.log("จาก 2:" , this.state.dateFrom);
        console.log("ถึง 2 :" , this.state.dateTo);



        const dateFrom = toBuddhistYear(this.state.dateFrom);
        const dateTo = toBuddhistYear(this.state.dateTo);

        let fileName = 'report';

        if (this.state.reportParams.type === 'SalesOrderByCategory')
          fileName = 'salesorderbycategory';
        else if (this.state.reportParams.type === 'SalesOrderByProduct')
          fileName = 'salesorderbyproduct';
        else if (this.state.reportParams.type === 'SalesOrderByArline')
          fileName = 'salesorderbyarline';
        else if (this.state.reportParams.type === 'SalesOrderByDocType')
          fileName = 'salesorderbydoctype';
        else if (this.state.reportParams.type === 'SalesOrderByPmt')
          fileName = 'salesorderbypmt';
        else if (this.state.reportParams.type === 'DocumentItems')
          fileName = 'documentitems';
        else if (this.state.reportParams.type === 'DocumentItemsDetails')
          fileName = 'documentitemsdetails';
        else if (this.state.reportParams.type === 'PerformanceByArlineItem')
          fileName = 'performancebyarlineitem';
        else if (this.state.reportParams.type === 'PeformanceByProductCategory')
          fileName = 'peformancebyproductcategory';
        else if (this.state.reportParams.type === 'SalesOrderBySaleman')
          fileName = 'salesorderbysaleman';
        else if (this.state.reportParams.type === 'StockBalanceByWL')
          fileName = 'stockbalancebywl';

        console.log(
          '_printPDF this.props.report.data ',
          JSON.stringify(this.props.report.data),
        );
        if (this.state.reportParams.pattern === 'A') {
          if (
            this.props.report.data &&
            this.props.report.data.ITEMS //&&
            // this.props.report.data.RPT_DATA.RESULT
          ) {


              console.log("ณ.วันที่ dateFrom 1", dateFrom);
  console.log("ถึงวันที่ dateTo", dateTo);
            console.log("SALESMAN >> ", SALESMAN);
            const html = printReport(
              this.state.reportParams.title,
              this.state.reportParams.type,
              this.props.report.data,
              this.props.report.data.ITEMS,
              vanConfig,
              userToken.COMPANYINFO,
              SALESMAN,
              dateFrom,
              dateTo,
              reportPrintTime,
            );

            let options = {
              html: html,
              fileName: fileName ,
              directory: 'Documents/bplus_vansales/',
              base64: true,
            };
// console.log('HTML == >' , html + ' ' + fileName)
            let file = await this._generatePDFFile(options);

            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);

            console.log("filePath4: ",file)
            this._pdfAlertDialog(file.filePath);
          } else {
            await this._setState(
              'errorMessage',
              'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน',
            );
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
          }
        } else if (this.state.reportParams.pattern === 'B') {
          if (
            (this.props.report.data &&
              this.props.report.data.RPT_DATA &&
              this.props.report.data.RPT_DATA.RESULT) ||
            (this.state.reportParams.type === 'PeformanceByProductCategory' &&
              this.props.report.data)
          ) {
            const html = printReport(
              this.state.reportParams.title,
              this.state.reportParams.type,
              this.props.report.data,
              [],
              VANCONFIG,
              userToken.COMPANYINFO,
              SALESMAN,
              dateFrom,
              dateTo,
              reportPrintTime,
            );

            let options = {
              html: html,
              fileName: fileName,
              directory: 'Documents/bplus_vansales/',
              base64: true,
            };

            let file = await this._generatePDFFile(options);

            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);

            console.log("filePath5: ",file)
            this._pdfAlertDialog(file.filePath);
          } else {
            await this._setState(
              'errorMessage',
              'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน',
            );
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
          }
        } else if (this.state.reportParams.pattern === 'C') {
          if (this.props.report.data) {
            const html = printReport(
              this.state.reportParams.title,
              this.state.reportParams.type,
              this.props.report.data,
              [],
              VANCONFIG,
              userToken.COMPANYINFO,
              SALESMAN,
              dateFrom,
              dateTo,
              reportPrintTime,
            );

            let options = {
              html: html,
              fileName: fileName,
              directory: 'Documents/bplus_vansales/',
              base64: true,
            };

            let file = await this._generatePDFFile(options);

            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);

            console.log("filePath6: ",file)
            this._pdfAlertDialog(file.filePath);
          } else {
            await this._setState(
              'errorMessage',
              'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน',
            );
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
          }
        } else if (this.state.reportParams.pattern === 'D') {
          if (
            this.props.report.data &&
            this.props.report.data.RESULT &&
            this.props.report.data.RESULT
          ) {
            const html = printReport(
              this.state.reportParams.title,
              this.state.reportParams.type,
              this.props.report.data,
              this.props.report.data.RESULT,
              VANCONFIG,
              userToken.COMPANYINFO,
              SALESMAN,
              dateFrom,
              dateTo,
              reportPrintTime,
            );

            let options = {
              html: html,
              fileName: fileName,
              directory: 'Documents/bplus_vansales/',
              base64: true,
            };

            let file = await this._generatePDFFile(options);

            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);

            console.log("filePath7: ",file)
            this._pdfAlertDialog(file.filePath);
          } else {
            await this._setState(
              'errorMessage',
              'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน',
            );
            await this._setState('loadingMessage', '');
            await this._setState('isLoading', false);
          }
        }
      } else if (response.STATUS === '10' && response.ERROR_MESSAGES[0]) {
        await this._setState('loadingMessage', '');
        await this._setState('isLoading', false);
        await this._setState(
          'errorMessage',
          'เกิดข้อผิดพลาด: ' + response.ERROR_MESSAGES[0],
        );
      }
    } catch (error) {
      await this._setState('loadingMessage', '');
      await this._setState('isLoading', false);
      await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error);
    }
  };

  _pdfAlertDialog = (path) =>
    Alert.alert(
      'ประกาศ',
      path,
      [
        {
          text: 'แสดง',
          onPress: () =>
            Navigator.navigate('PDFPreview', {title: '', source: path}),
          style: 'cancel',
        },
        {text: 'ปิด', onPress: () => {}, style: 'cancel'},
      ],
      {cancelable: false},
    );

  _generatePDFFile = async (options) => {
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

      console.log('_printerReport ' , this.props.bluetooth.state);

      if (this.props.bluetooth.state == 'connected') {
        const userToken = await getUserToken();

        const {baseUrl, vanCNFMachine,SALESMAN} = await getSettingConfig();
        const {VANCONFIG} = await getUserToken();
        const response = await this.props.systemCheck({
          baseUrl: baseUrl,
          vanCNFMachine: VANCONFIG,
        });

      console.log('_printerReport response ' , response);


       if (response.ResponseCode == '200') {
          const {RESPONSE_DATETIME} = response;
          
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
          console.log("userToken >> ", userToken);
          console.log("his.props.report.data >> ", JSON.stringify(this.props.report.data));
          console.log("his.props.report.data.ITEMS pattern >> ", this.state.reportParams.pattern);


          if (this.state.reportParams.pattern === 'A') {
            if (
              this.props.report.data &&
               this.props.report.data.ITEMS
              // this.props.report.data.RPT_DATA &&
              // this.props.report.data.RPT_DATA.RESULT
            ) {
              BplusPrinting.printReport(
                this.state.reportParams.title,
                this.state.reportParams.type,
                this.props.report.data,
                //this.props.report.data.RPT_DATA.RESULT,
                this.props.report.data.ITEMS,
//uu,
                userToken.VANCONFIG,
                userToken.COMPANYINFO,
                //userToken.SALESMAN,
                SALESMAN,
                dateFrom,
                dateTo,
                printTime
              );

              await this._setState('loadingMessage', '');
              await this._setState('isLoading', false);
            } else {
              await this._setState(
                'errorMessage',
                'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน',
              );
            }
          } else if (this.state.reportParams.pattern === 'B') {
            if (
              (this.props.report.data &&
                this.props.report.data.RPT_DATA &&
                this.props.report.data.RPT_DATA.RESULT) ||
              (this.state.reportParams.type === 'PeformanceByProductCategory' &&
                this.props.report.data)
            ) {
              BplusPrinting.printReport(
                this.state.reportParams.title,
                this.state.reportParams.type,
                this.props.report.data,
                [],
                userToken.VANCONFIG,
                userToken.COMPANYINFO,
                userToken.SALESMAN,
                dateFrom,
                dateTo,
                printTime,
              );

              await this._setState('loadingMessage', '');
              await this._setState('isLoading', false);
            } else {
              await this._setState(
                'errorMessage',
                'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน',
              );
            }
          } else if (this.state.reportParams.pattern === 'C') {
            if (this.props.report.data) {
              BplusPrinting.printReport(
                this.state.reportParams.title,
                this.state.reportParams.type,
                this.props.report.data,
                [],
                userToken.VANCONFIG,
                userToken.COMPANYINFO,
                userToken.SALESMAN,
                dateFrom,
                dateTo,
                reportPrintTime,
              );

              await this._setState('loadingMessage', '');
              await this._setState('isLoading', false);
            } else {
              await this._setState(
                'errorMessage',
                'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน',
              );
            }
          } else if (this.state.reportParams.pattern === 'D') {
            if (
              this.props.report.data &&
              this.props.report.data.RESULT &&
              this.props.report.data.RESULT
            ) {
              BplusPrinting.printReport(
                this.state.reportParams.title,
                this.state.reportParams.type,
                this.props.report.data,
                this.props.report.data.RESULT,
                userToken.VANCONFIG,
                userToken.COMPANYINFO,
                userToken.SALESMAN,
                dateFrom,
                dateTo,
                reportPrintTime,
              );

              await this._setState('loadingMessage', '');
              await this._setState('isLoading', false);
            } else {
              await this._setState(
                'errorMessage',
                'เกิดข้อผิดพลาด: ไม่พบข้อมูลรายงาน',
              );
            }
          }
        } else if (response.STATUS === '10' && response.ERROR_MESSAGES[0]) {
          await this._setState(
            'errorMessage',
            'เกิดข้อผิดพลาด: ' + response.ERROR_MESSAGES[0],
          );
        }
      }
    } catch (error) {
      await this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error);
    }
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  _setReportParams = async (value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          reportParams: value,
        };
      }));
  };

  _bluetoothAlertDialog = () =>
    Alert.alert(
      'ประกาศ',
      'เนื่องจากไม่ได้ทำการ Connect printer ต้องการจะไปที่หน้า Bluetooth setting หรือไม่',
      [
        {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
        {text: 'ยืนยัน', onPress: () => this._goToBluetoothSetting()},
      ],
      {cancelable: false},
    );

  _goToBluetoothSetting = () => {
    BluetoothFinder.checkBluetoothEnable((value) => {
      if (value.result) {
        Navigator.navigate('Bluetooth');
      }
    });
  };

  render() {
    const wareLocationListItems = this.props.masterData.wareLocationListItems.map(
      (item) => ({label: item.WL_NAME, value: item.WL_KEY}),
    );

    return (
      <IDurationDateSearchForm
        title={this.state.reportParams.title}
        hideRight={this.state.reportParams.seachForm === 'B' ? true : false}
        // showDropdown={this.state.reportParams.type === 'StockBalanceByWL'}
        selected={this.state.selected}
        selectItems={wareLocationListItems}
        setState={this._setState}
        onSearch={this._onSearch}
        printerReport={this._printerReport}
        printPDF={this._printPDF}
        setStateFromParent={this._setState}
        errorMessage={this.state.errorMessage}
        isLoading={this.state.isLoading}
        loadingMessage={this.state.loadingMessage}
        printEnabled={
          this.state.userToken &&
          this.state.userToken.VANCONFIG &&
          this.state.userToken.VANCONFIG.VANCNF_RPT_ALLCONFIG &&
          this.state.userToken.VANCONFIG.VANCNF_RPT_ALLCONFIG !== 2 &&
          this.state.userToken.VANCONFIG.VANCNF_RPT_ALLCONFIG !== 3
            ? false
            : true
        }
        printerType={this.props.bluetooth.printingType}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  bluetooth: state.bluetooth,
  report: state.report,
  masterData: state.masterData,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setInitialState: () => dispatch(setInitialState()),
    getReportData: (uri, pattern, data) =>
      dispatch(getReportData(uri, pattern, data)),
    getReportDataNoGroup: (uri, pattern, data) =>
      dispatch(getReportDataNoGroup(uri, pattern, data)),
    getReportV3: (uri, pattern, data) =>
      dispatch(getReportV3(uri, pattern, data)),
    systemCheck: (data) => dispatch(systemCheck(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTSearchForm);
