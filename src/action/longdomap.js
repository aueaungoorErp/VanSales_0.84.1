import * as types from '../constant/longdomap';

export const setLongdoMapInitialState = () => dispatch => {
  dispatch({ type: types.LONGDOMAP_SET_INITIAL_STATE });
};

export const setLastPosition = position => dispatch => {
  dispatch({
    type: types.LONGDOMAP_SET_LAST_POSITION,
    payload: {
      latitude: position?.latitude ?? null,
      longitude: position?.longitude ?? null,
    },
  });
};
