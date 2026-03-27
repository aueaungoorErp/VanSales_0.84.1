import {loginApi, registerV3Api} from '../api/user';
import * as types from '../constant/user';

export const login = (userLogin) => async (dispatch) => {
  return await loginApi(userLogin);
};

export const registerV3 = (username, password) => async (dispatch) => {
  // console.log("username, password ",username, password);
  return await registerV3Api(username, password);
};

export const toggleRememberPassword = (item) => async (dispatch) => {
  return (dispatch) => {
    dispatch({type: types.USER_REMEMBER_PASSWORD, payload: item});
  };
};
