import React, { Component } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import ErrorMessage from '../../../component/announce/ErrorMessage';
import IButtonGroup from '../../../component/button/IButtonGroup';
import IList from '../../../component/list/IList';
import { MainTheme } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';

import {
  documentItems,
  documentItemsDetails,
  peformanceByProductCategory,
  performanceByArlineItem,
  salesOrderByArline,
  salesOrderByCategory,
  salesOrderByDocType,
  salesOrderByPmt,
  salesOrderByProduct,
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

  componentDidMount = props => {
    this._isMounted = true;
    this._prepareData();
  };

  componentWillUnmount = props => {
    this._isMounted = false;
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      await this._setState('userToken', userToken);
    }
  };

  _prepareData = async () => {
    const { routes, index } = Navigator.getCurrentRoute();
    const { params } = routes[index].params;
    await this._setReportParams(params);
  };

  _setReportParams = async value => {
    this._isMounted &&
      (await this.setState(oldState => {
        return {
          reportParams: value,
        };
      }));
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState(oldState => {
        return {
          [key]: value,
        };
      }));
  };

  _renderList = reportPattern => {
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
    <AntDesign
      name="calculator"
      color={
        this.state.selectedIndex == 0
          ? MainTheme.colorSecondary
          : MainTheme.colorPrimary
      }
      size={18}
    />
  );
  _gridButton = () => (
    <MaterialCommunityIcons
      name="percent"
      color={
        this.state.selectedIndex == 1
          ? MainTheme.colorSecondary
          : MainTheme.colorPrimary
      }
      size={18}
    />
  );

  _buttons = [{ element: this._listButton }, { element: this._gridButton }];

  _renderViewToggle = () => (
    <View style={styles.toggleActionRow}>
      <IButtonGroup
        buttons={this._buttons}
        selectedIndex={this.state.selectedIndex}
        onPress={value => {
          this._setState('selectedIndex', value);
        }}
        containerStyle={styles.toggleButtonGroup}
        buttonStyle={styles.toggleButton}
        selectedButtonStyle={styles.toggleButtonSelected}
        selectedTextStyle={{ color: MainTheme.inActivePrimary }}
        textStyle={{ color: MainTheme.colorPrimary }}
        containerBorderRadius={999}
      />
    </View>
  );

  _renderFooterSummary = content =>
    content ? <View style={styles.footerSummary}>{content}</View> : null;

  _renderCardContainer = (content, horizontal = false) =>
    horizontal ? (
      <ScrollView
        horizontal
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        <View style={styles.reportCard}>{content}</View>
      </ScrollView>
    ) : (
      <View style={styles.reportCard}>{content}</View>
    );

  _patternA = reportPattern => {
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
      <View style={styles.contentArea}>
        {(reportPattern &&
          reportPattern.horizontalScreen === 'phone' &&
          Dimensions.get('window').width < 450) ||
        (reportPattern && reportPattern.horizontalScreen === 'both')
          ? this._renderCardContainer(
              <View
                style={{
                  flex:
                    reportPattern.footerSummary && this.props.report.data
                      ? 0.9
                      : 1,
                }}
              >
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
                {this._renderFooterSummary(
                  reportPattern.footerSummary && this.props.report.data
                    ? reportPattern.footer(this.props.report.data)
                    : null,
                )}
              </View>,
              true,
            )
          : this._renderCardContainer(
              <View
                style={{
                  flex:
                    reportPattern.footerSummary && this.props.report.data
                      ? 0.9
                      : 1,
                }}
              >
                <IList
                  header={reportPattern.header}
                  data={Array.isArray(listData) ? listData : listData.ITEMS}
                  footer={
                    reportPattern.footerItem && this.props.report.data
                      ? reportPattern.footerRenderItem(this.props.report.data)
                      : null
                  }
                  renderItem={reportPattern.renderItem}
                  stickyHeaderIndices={[0]}
                />
                {this._renderFooterSummary(
                  reportPattern.footerSummary && this.props.report.data
                    ? reportPattern.footer(this.props.report.data)
                    : null,
                )}
              </View>,
            )}
      </View>
    );
  };

  _patternB = reportPattern => {
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

    const { routes, index } = Navigator.getCurrentRoute();
    const { params } = routes[index].params;

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
      <View style={styles.contentArea}>
        {this._renderViewToggle()}

        {(reportPattern.horizontalScreen === 'phone' &&
          Dimensions.get('window').width < 450) ||
        reportPattern.horizontalScreen === 'both'
          ? this._renderCardContainer(
              <View
                style={{
                  flex:
                    reportPattern.footerSummary && this.props.report.data
                      ? 0.9
                      : 1,
                }}
              >
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
                {this._renderFooterSummary(
                  reportPattern.footerSummary && this.props.report.data
                    ? reportPattern.footer(
                        this.state.selectedIndex,
                        this.props.report.data,
                      )
                    : null,
                )}
              </View>,
              true,
            )
          : this._renderCardContainer(
              <View
                style={{
                  flex:
                    reportPattern.footerSummary && this.props.report.data
                      ? 0.9
                      : 1,
                }}
              >
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
                {this._renderFooterSummary(
                  reportPattern.footerSummary && this.props.report.data
                    ? reportPattern.footer(
                        this.state.selectedIndex,
                        this.props.report.data,
                      )
                    : null,
                )}
              </View>,
            )}
      </View>
    );
  };

  _patternC = reportPattern => {
    return reportPattern.renderItem(
      this.state.userToken && this.state.userToken.SALESMAN
        ? this.state.userToken.SALESMAN
        : null,
      this.props.report.data,
    );
  };

  render() {
    const { routes, index } = Navigator.getCurrentRoute();
    const { params } = routes[index].params;
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
      <View style={styles.root}>
        {!this.props.report.errorMessage
          ? this._renderList(reportPattern)
          : null}

        <ErrorMessage
          isDisplaying={this.props.report.errorMessage}
          message={this.props.report.errorMessage}
          iconName="warning"
          type="antdesign"
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  report: state.report,
});

const mapDispatchToProps = dispatch => {
  return {
    setDiscountPercentFirstRound: value =>
      dispatch(setDiscountPercentFirstRound(value)),
    setDiscountPercentSecondRound: value =>
      dispatch(setDiscountPercentSecondRound(value)),
    calculateOrderNetPriceAfterDiscount: () =>
      dispatch(calculateOrderNetPriceAfterDiscount()),
    clearDiscountPercent: () => dispatch(clearDiscountPercent()),
    sendOrder: data => dispatch(sendOrder(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  toggleActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -18,
    marginBottom: -2,
  },
  toggleButtonGroup: {
    flex: 0,
    width: 112,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BFD5C8',
    backgroundColor: '#F2F7F4',
  },
  toggleButton: {
    backgroundColor: '#F2F7F4',
    paddingVertical: 1,
  },
  toggleButtonSelected: {
    backgroundColor: MainTheme.colorPrimary,
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalScrollContent: {
    flexDirection: 'column',
    paddingBottom: 4,
  },
  reportCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE7E1',
    overflow: 'hidden',
    shadowColor: '#173126',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  footerSummary: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECF5EF',
    borderTopWidth: 1,
    borderTopColor: '#D7E5DC',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
