import React from 'react';
import { connect } from 'react-redux';
import Form from '../presenter/Form';

import { getArPricetab } from '../../../action/customer';
import { searchCustomerTypeList } from '../../../action/customer-type';
import { searchProductCateGoryList } from '../../../action/product-category';
import { getMasterDataProvinces } from '../../../action/masterData';
import { registerV3 } from '../../../action/user';
import {
  getVanConfigV3,
  readCompanyInfoV3,
  systemCheck2,
} from '../../../action/setting';

type CTFormProps = {
  navigation?: any;
  getVanConfigV3: (machine: string) => Promise<any>;
  registerV3: (username: string, password: string) => Promise<any>;
  systemCheck2: (data: {
    baseUrl: string;
    vanCNFMachine: string;
    USER_CODE: string;
    USER_PASSWORD: string;
  }) => Promise<any>;
  readCompanyInfoV3: (guid: string, companyCode: number) => Promise<any>;
  searchCustomerTypeList: (enabledAllAr: any) => Promise<any>;
  searchProductCateGoryList: (enabledAllIc: any) => Promise<any>;
  getMasterDataProvinces: () => Promise<any>;
  getArPricetab: () => Promise<any>;
};

const CTForm: React.FC<CTFormProps> = props => <Form {...props} />;

const mapStateToProps = (_state: any) => ({});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getVanConfigV3: (VANCNF_MACHINE: string) =>
      dispatch(getVanConfigV3(VANCNF_MACHINE)),
    registerV3: (username: string, password: string) =>
      dispatch(registerV3(username, password)),
    systemCheck2: (data: any) => dispatch(systemCheck2(data)),
    readCompanyInfoV3: (GUID: string, CMPNY_CODE: number) =>
      dispatch(readCompanyInfoV3(GUID, CMPNY_CODE)),
    searchCustomerTypeList: (vanCNFEnabledAllar: any) =>
      dispatch(searchCustomerTypeList(vanCNFEnabledAllar)),
    searchProductCateGoryList: (vanCNFEnabledAllic: any) =>
      dispatch(searchProductCateGoryList(vanCNFEnabledAllic)),
    getMasterDataProvinces: () => dispatch(getMasterDataProvinces()),
    getArPricetab: () => dispatch(getArPricetab()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTForm);
