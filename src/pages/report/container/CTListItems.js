import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, ScrollView, Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import IList from '../../../component/list/IList';
import ErrorMessage from '../../../component/announce/ErrorMessage';
import Navigator from '../../../services/Navigator';
import {MainTheme} from '../../../constant/lov';
import IButtonGroup from '../../../component/button/IButtonGroup';
import {getUserToken} from '../../../utils/Token';

import {
  salesOrderByProduct,
  salesOrderByCategory,
  salesOrderByArline,
  salesOrderByDocType,
  salesOrderByPmt,
  documentItems,
  documentItemsDetails,
  performanceByArlineItem,
  peformanceByProductCategory,
  salesOrderBySaleman,
  stockBalanceByWL,
} from '../../../constant/report-lov';

class CTListItems extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      reportParams: {
        title: null,
        type: null,
        pattern: null,
      },
      dialogMessage: null,
      userToken: null,
    };

    this._getUserToken();
  }

  componentDidMount = (props) => {
    this._isMounted = true;
    this._prepareData();
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      await this._setState('userToken', userToken);
    }
  };

  _prepareData = async () => {
    const {routes, index} = Navigator.getCurrentRoute();
    const {params} = routes[index].params;
    await this._setReportParams(params);
  };

  _setReportParams = async (value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          reportParams: value,
        };
      }));
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  _renderList = (reportPattern) => {
    console.log('_renderList reportPattern ', reportPattern);
    console.log(
      '_renderList this.state.reportParams ',
      this.state.reportParams,
    );
    if (
      this.state.reportParams.pattern === 'A' ||
      this.state.reportParams.pattern === 'D'
    ) {
      return this._patternA(reportPattern, this.state.reportParams.pattern);
    } else if (this.state.reportParams.pattern === 'B') {
      return this._patternB(reportPattern);
    } else if (this.state.reportParams.pattern === 'C') {
      return this._patternC(reportPattern);
    }
  };

  _listButton = () => (
    <Icon
      name="counter"
      type="material-community"
      color={
        this.state.selectedIndex == 0
          ? MainTheme.colorSecondary
          : MainTheme.colorPrimary
      }
    />
  );
  _gridButton = () => (
    <Icon
      name="percent"
      type="material-community"
      color={
        this.state.selectedIndex == 1
          ? MainTheme.colorSecondary
          : MainTheme.colorPrimary
      }
    />
  );

  _buttons = [{element: this._listButton}, {element: this._gridButton}];

  _patternA = (reportPattern) => {
    let listData = [];
    console.log(
      'this.state.reportParams ',
      JSON.stringify(this.state.reportParams),
    );
    if (this.state.reportParams.pattern === 'A') {
      if (
        this.state.reportParams.type == 'SalesOrderByCategory' ||
        this.state.reportParams.type == 'SalesOrderByArline' ||
        this.state.reportParams.type == 'SalesOrderByDocType'
      ) {
        this.props.report.data ? (listData = this.props.report.data) : [];
      } else {
        this.props.report.data
          ? (listData = this.props.report.data?.ITEMS)
          : [];
      }
    } else if (this.state.reportParams.pattern === 'D') {
      this.props.report.data && this.props.report.data.RESULT
        ? (listData = this.props.report.data.RESULT)
        : [];
    }
    console.log('listData ', JSON.stringify(listData));
    console.log(
      'this.props.report.data ',
      JSON.stringify(this.props.report.data),
    );
    return (
      <View style={{flex: 1}}>
        {(reportPattern &&
          reportPattern.horizontalScreen === 'phone' &&
          Dimensions.get('window').width < 450) ||
        (reportPattern && reportPattern.horizontalScreen === 'both') ? (
          <ScrollView
            horizontal
            contentContainerStyle={{flexDirection: 'column'}}>
            <View
              style={{
                flex:
                  reportPattern.footerSummary && this.props.report.data
                    ? 0.9
                    : 1,
              }}>
              <IList
                header={reportPattern.header}
                data={listData}
                footer={
                  reportPattern.footerItem && this.props.report.data
                    ? reportPattern.footerRenderItem(this.props.report.data)
                    : null
                }
                renderItem={reportPattern.renderItem}
                stickyHeaderIndices={[0]}
              />
            </View>
            {reportPattern.footerSummary && this.props.report.data ? (
              <View
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: MainTheme.colorThirteendary,
                }}>
                {reportPattern.footer(this.props.report.data)}
              </View>
            ) : null}
          </ScrollView>
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{
                flex:
                  reportPattern.footerSummary && this.props.report.data
                    ? 0.9
                    : 1,
              }}>
              <IList
                header={reportPattern.header}
                data={listData.ITEMS}
                footer={
                  reportPattern.footerItem && this.props.report.data
                    ? reportPattern.footerRenderItem(this.props.report.data)
                    : null
                }
                renderItem={reportPattern.renderItem}
                stickyHeaderIndices={[0]}
              />
            </View>

            {reportPattern.footerSummary && this.props.report.data ? (
              <View
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: MainTheme.colorThirteendary,
                }}>
                {reportPattern.footer(this.props.report.data)}
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  _patternB = (reportPattern) => {
    let listData = [];
    console.log('_patternB', this.state.reportParams.pattern);
    // if (this.state.selectedIndex == 0) {
    //     this.props.report.data &&
    //     this.props.report.data.ITEMS ?
    //     listData = this.props.report.data.ITEMS : []
    // } else if (this.state.selectedIndex == 1) {
    //     this.props.report.data &&
    //     this.props.report.data.ITEMS_PERCENT  ?
    //     listData = this.props.report.data.ITEMS_PERCENT : []
    // }

    // if (this.state.reportParams.pattern === 'A') {
    //     this.props.report.data &&
    //     this.props.report.data.RPT_DATA &&
    //     this.props.report.data.RPT_DATA.RESULT ?
    //     listData = this.props.report.data.RPT_DATA.RESULT : []
    // } else if (this.state.reportParams.pattern === 'D') {
    //     this.props.report.data &&
    //     this.props.report.data.RESULT ?
    //     listData = this.props.report.data.RESULT : []
    // }

    // if (this.state.selectedIndex == 0) {

    const {routes, index} = Navigator.getCurrentRoute();
    const {params} = routes[index].params;

    // if (params.type == 'PeformanceByProductCategory') {
    //     if (this.state.selectedIndex === 0) {
    //         this.props.report.data && this.props.report.data.ITEMS ? listData = this.props.report.data.ITEMS : []
    //     } else if (this.state.selectedIndex === 1) {
    //         this.props.report.data && this.props.report.data.ITEMS_PERCENT ? listData = this.props.report.data.ITEMS_PERCENT : []
    //     }
    // } else {
    this.props.report.data &&
    this.props.report.data.RPT_DATA &&
    this.props.report.data.RPT_DATA.RESULT
      ? (listData = this.props.report.data.RPT_DATA.RESULT)
      : [];
    // }

    return (
      <View style={{flex: 1}}>
        <View style={{alignItems: 'center', marginBottom: 5}}>
          <IButtonGroup
            buttons={this._buttons}
            selectedIndex={this.state.selectedIndex}
            onPress={(value) => {
              this._setState('selectedIndex', value);
            }}
            containerStyle={{
              flex: 0.2,
              height: 40,
              borderRadius: 6,
              borderColor: MainTheme.colorPrimary,
            }}
            buttonStyle={{backgroundColor: MainTheme.colorSecondary}}
            selectedButtonStyle={{backgroundColor: MainTheme.colorPrimary}}
            selectedTextStyle={{color: MainTheme.inActivePrimary}}
            textStyle={{color: MainTheme.colorPrimary}}
            containerBorderRadius={50}
          />
        </View>

        {(reportPattern.horizontalScreen === 'phone' &&
          Dimensions.get('window').width < 450) ||
        reportPattern.horizontalScreen === 'both' ? (
          <ScrollView
            horizontal
            contentContainerStyle={{flexDirection: 'column'}}>
            <View
              style={{
                flex:
                  reportPattern.footerSummary && this.props.report.data
                    ? 0.9
                    : 1,
              }}>
              {/* <IList 
                                        header={reportPattern.header}
                                        data={listData} 
                                        footer={reportPattern.footerItem && this.props.report.data ? reportPattern.footerItem(this.props.report.data) : null}
                                        renderItem={this.state.selectedIndex == 0 ? reportPattern.renderItem : reportPattern.renderItemPercent} 
                                        stickyHeaderIndices={[0]} /> */}
              <IList
                header={reportPattern.header}
                data={listData}
                footer={
                  reportPattern.footerItem && this.props.report.data
                    ? this.state.selectedIndex === 0
                      ? reportPattern.footerRenderItem(this.props.report.data)
                      : reportPattern.footerRenderItemPercent(
                          this.props.report.data,
                        )
                    : null
                }
                renderItem={
                  this.state.selectedIndex == 0
                    ? reportPattern.renderItem
                    : reportPattern.renderItemPercent
                }
                stickyHeaderIndices={[0]}
              />
            </View>

            {reportPattern.footerSummary && this.props.report.data ? (
              <View
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: MainTheme.colorThirteendary,
                }}>
                {reportPattern.footer(
                  this.state.selectedIndex,
                  this.props.report.data,
                )}
              </View>
            ) : null}

            {/* {
                                    reportPattern.footerSummary && this.props.report.data ? 
                                        <View 
                                            style={{ 
                                                flex: 0.1, 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                backgroundColor: MainTheme.colorThirteendary 
                                            }}>
                                                { reportPattern.footer(this.state.selectedIndex, this.props.report.data) }
                                        </View>
                                    : null
                                } */}
          </ScrollView>
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{
                flex:
                  reportPattern.footerSummary && this.props.report.data
                    ? 0.9
                    : 1,
              }}>
              <IList
                header={reportPattern.header}
                data={listData}
                footer={
                  reportPattern.footerItem && this.props.report.data
                    ? this.state.selectedIndex == 0
                      ? reportPattern.footerRenderItem(this.props.report.data)
                      : reportPattern.footerRenderItemPercent(
                          this.props.report.data,
                        )
                    : null
                }
                renderItem={
                  this.state.selectedIndex == 0
                    ? reportPattern.renderItem
                    : reportPattern.renderItemPercent
                }
                stickyHeaderIndices={[0]}
              />
            </View>

            {reportPattern.footerSummary && this.props.report.data ? (
              <View
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: MainTheme.colorThirteendary,
                }}>
                {reportPattern.footer(
                  this.state.selectedIndex,
                  this.props.report.data,
                )}
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  _patternC = (reportPattern) => {
    return reportPattern.renderItem(
      this.state.userToken && this.state.userToken.SALESMAN
        ? this.state.userToken.SALESMAN
        : null,
      this.props.report.data,
    );
  };

  render() {
    const {routes, index} = Navigator.getCurrentRoute();
    const {params} = routes[index].params;
    let reportPattern = null;

    if (params.type === 'SalesOrderByCategory') {
      reportPattern = salesOrderByCategory;
    } else if (params.type === 'SalesOrderByProduct') {
      reportPattern = salesOrderByProduct;
    } else if (params.type === 'SalesOrderByArline') {
      reportPattern = salesOrderByArline;
    } else if (params.type === 'SalesOrderByDocType') {
      reportPattern = salesOrderByDocType;
    } else if (params.type === 'SalesOrderByPmt') {
      reportPattern = salesOrderByPmt;
    } else if (params.type === 'DocumentItems') {
      reportPattern = documentItems;
    } else if (params.type === 'DocumentItemsDetails') {
      reportPattern = documentItemsDetails;
    } else if (params.type === 'PerformanceByArlineItem') {
      reportPattern = performanceByArlineItem;
    } else if (params.type === 'PeformanceByProductCategory') {
      reportPattern = peformanceByProductCategory;
    } else if (params.type === 'SalesOrderBySaleman') {
      reportPattern = salesOrderBySaleman;
    } else if (params.type === 'StockBalanceByWL') {
      reportPattern = stockBalanceByWL;
    }

    return (
      <View style={{flex: 1}}>
        {!this.props.report.errorMessage
          ? this._renderList(reportPattern)
          : null}

        <ErrorMessage
          isDisplaying={this.props.report.errorMessage}
          message={this.props.report.errorMessage}
          iconName="warning"
          type="font-awesome"
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  report: state.report,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setDiscountPercentFirstRound: (value) =>
      dispatch(setDiscountPercentFirstRound(value)),
    setDiscountPercentSecondRound: (value) =>
      dispatch(setDiscountPercentSecondRound(value)),
    calculateOrderNetPriceAfterDiscount: () =>
      dispatch(calculateOrderNetPriceAfterDiscount()),
    clearDiscountPercent: () => dispatch(clearDiscountPercent()),
    sendOrder: (data) => dispatch(sendOrder(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);
