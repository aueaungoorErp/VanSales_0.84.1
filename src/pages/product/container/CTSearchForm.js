import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchForm from '../presenter/SearchForm';
import {
  searchProductList,
  setKeyword,
  clearProductList,
  searchProductSkuAltList,
} from '../../../action/product';
import {
  setProductCategory,
  setInitialState,
} from '../../../action/product-category';
import { searchProductCateGoryList } from '../../../action/product-category';
import Navigator from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';

class CTSearchForm extends Component {
  _isMounted = false;
  _firstTime = true;
  _scanBarcodeEnabled = true;

  constructor(props) {
    super(props);

    this.state = {
      textSearch: null,
      ICDEPT_KEY: null,
    };

    const { routes, index } = Navigator.getCurrentRoute();
    this._hasBarcodeScan =
      routes[index].name === 'StockDropPoint' ? true : false;
  }

  async componentDidMount() {
    this._isMounted = true;
    console.log('CTSearchForm componentDidMount screen=', this.props.screen, 'actionType=', this.props.actionType);
    // await this._searchProductCateGoryList()
    this.props.screen === 'ProductAddTo' && this.props.actionType === 'add_scr'
      ? null
      : this.props.clearProductList();
    this._onSearch();
  }

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  _searchProductCateGoryList = async () => {
    try {
      const userToken = await getUserToken();
      await this.props.searchProductCateGoryList(
        userToken.VANCONFIG.VANCNF_ENABLE_ALLIC,
        this.props.screen === 'Stock' ? true : false,
      );
    } catch (error) {
      console.log(error);
    }
  };

  _setTextSearch = async (value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          textSearch: value,
        };
      }));
  };

  _setProductCategory = async (value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          ICDEPT_KEY: value,
        };
      }));

    this._onSearch();
  };

  _onSearch = async () => {
    console.log('_onSearch: product.isLoading=', this.props.product.isLoading, 'productCategory.listItems isArray=', Array.isArray(this.props.productCategory.listItems), 'length=', this.props.productCategory.listItems ? this.props.productCategory.listItems.length : 'null');
    if (!this.props.product.isLoading) {
      if (Array.isArray(this.props.productCategory.listItems)) {
        let category = this.props.productCategory.listItems.find((v) => {
          return this.state.ICDEPT_KEY === v.ICDEPT_KEY;
        });
        // console.log('category1', category);
        category
          ? null
          : (category = { ICDEPT_KEY: null, ICDEPT_THAIDESC: null });
        // console.log('category2', category);
        await this.props.setProductCategory(category);
        // console.log('textSearch', this.state.textSearch)
        await this.props.setKeyword(this.state.textSearch ? this.state.textSearch.trim() : null);
        await this._search();
      }
    }
  };

  _onRefresh = async () => {
    //this.props.productCategory.item ={};
    await this._search();
  };

  _search = async () => {
    if (!this.props.product.isLoading) {
      if (
        this.props.screen === 'ProductAddTo' &&
        this.props.actionType === 'add_scr'
      ) {
        await this.props.searchProductSkuAltList();
        console.log('_search 1');
      } else {
        console.log('_search 2');
        await this.props.clearProductList();
        console.log('ตรวจสอบตรงนี้ >> 3');
        await this.props.searchProductList(this.props.screen, false);
      }
    }
  };

  _onScanBarcodePress = () => {
    this._scanBarcodeEnabled = true;
    Navigator.navigate('Camera', {
      barcodeFinderVisible: true,
      onBarCodeRead: async (scanResult) => {
        if (this._scanBarcodeEnabled) {
          await this._setTextSearch(scanResult.data);
          this._scanBarcodeEnabled = false;

          setTimeout(async () => {
            await this._onSearch();
          }, 500);

          Navigator.back();
        }
      },
    });
  };

  render() {
    return (
      <SearchForm
        value={this.state.textSearch}
        setTextSearch={this._setTextSearch}
        category={this.state.ICDEPT_KEY}
        categoryItems={
          Array.isArray(this.props.productCategory.listItems)
            ? this.props.productCategory.listItems
            : []
        }
        onSearch={this._onSearch}
        setProductCategory={this._setProductCategory}
        onRefresh={this._onRefresh}
        hasBarcodeScan={this._hasBarcodeScan}
        onScanBarcodePress={this._onScanBarcodePress}
        actionType={this.props.actionType}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  product: state.product,
  productCategory: state.productCategory,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setInitialState: () => {
      dispatch(setInitialState());
    },
    setKeyword: (criteria) => {
      dispatch(setKeyword(criteria));
    },
    searchProductList: (screen, nextPage) => {
      dispatch(searchProductList(screen, nextPage));
    },
    clearProductList: () => {
      dispatch(clearProductList());
    },
    setProductCategory: (value) => {
      dispatch(setProductCategory(value));
    },
    searchProductSkuAltList: () => {
      dispatch(searchProductSkuAltList());
    },
    searchProductCateGoryList: (vanCNFEnabledAllic, forceIsTransfer) =>
      dispatch(searchProductCateGoryList(vanCNFEnabledAllic, forceIsTransfer)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTSearchForm);
