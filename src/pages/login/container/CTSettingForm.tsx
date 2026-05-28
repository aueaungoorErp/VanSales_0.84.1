import React from 'react';
import { connect } from 'react-redux';
import {
  getSaleManV3,
  getVanConfigV3,
  systemCheck2,
  unRegister,
} from '../../../action/setting';
import SettingForm from '../presenter/SettingForm.tsx';

type CTSettingProps = {
  navigation?: any;
  onConnnect?: (status: boolean) => void;
  systemCheck2: (data: any) => Promise<any>;
  unRegister: () => Promise<any>;
  getSaleManV3: (guid: string, slmnKey: string) => Promise<any>;
  getVanConfigV3: (vanCnfMachine: string) => Promise<any>;
};

const CTSetting: React.FC<CTSettingProps> = props => <SettingForm {...props} />;

const mapStateToProps = (_state: any) => ({
  // user: state.user
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    systemCheck2: (data: any) => {
      return dispatch(systemCheck2(data));
    },
    unRegister: () => {
      return dispatch(unRegister());
    },
    getSaleManV3: (GUID: string, SLMN_KEY: string) => {
      return dispatch(getSaleManV3(GUID, SLMN_KEY));
    },
    getVanConfigV3: (VANCNF_MACHINE: string) => {
      return dispatch(getVanConfigV3(VANCNF_MACHINE));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTSetting);
