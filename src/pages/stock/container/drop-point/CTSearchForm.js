import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchForm from '../../presenter/drop-point/SearchForm';
import { setInitialState, clearDropPointList, searchDropPointList } from '../../../../action/drop-point';
class CTSearchForm extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      textSearch: null
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.props.setInitialState();
    this._onSearch();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  _onRefresh = async () => {
    await this._onSearch();
  };
  _onSearch = async () => {
    await this.props.clearDropPointList();
    await this.props.searchDropPointList(this.state.textSearch);
  };
  _setState = (key, value) => {
    this._isMounted && this.setState(oldState => {
      return {
        [key]: value
      };
    });
  };
  render() {
    return <SearchForm value={this.state.textSearch} setState={this._setState} onSearch={this._onSearch} onRefresh={this._onRefresh} />;
  }
}
const mapStateToProps = state => ({
  product: state.product,
  productCateGory: state.productCategory
});
const mapDispatchToProps = dispatch => {
  return {
    setInitialState: () => {
      dispatch(setInitialState());
    },
    clearDropPointList: () => dispatch(clearDropPointList()),
    searchDropPointList: textInput => dispatch(searchDropPointList(textInput))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CTSearchForm);