import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navigator from '../../../../services/Navigator';
import SummaryDetail from '../presenter/SummaryDetail';
import {getUserToken} from '../../../../utils/Token';

class CTSummaryDetail extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorMessage: null,
      dialogMessage: null,
      userToken: null,
    };

    this._getUserToken();
  }

  componentDidMount = (props) => {
    this._isMounted = true;
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
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

  render() {
    const {routes, index} = Navigator.getCurrentRoute();
    const {actionType, printType, processResult} = routes[index].params;

    // console.log("routes[index] 111>> ",routes[index])
    // console.log("processResult 111>> ",processResult)
    // console.log("printType 222>> ",printType)
    // console.log("routes 333>> ",routes)
    // console.log("index 333>> ",index)
    // console.log("this.props.order 444>> ",this.props.order)




    return (
      <SummaryDetail
        orderProductSummary={this.props.order.orderProductSummary}
        orderType={this.props.order.header.AR_ORDER_TYPE}
        userToken={this.state.userToken}
        printType={printType}
        processResult={processResult}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  order: state.order,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CTSummaryDetail);
