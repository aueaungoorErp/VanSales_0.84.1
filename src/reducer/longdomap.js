import * as types from '../constant/longdomap';

const initialState = {
  lastPosition: {
    latitude: null,
    longitude: null,
  },
};

export const longdomap = (state = initialState, action) => {
  switch (action.type) {
    case types.LONGDOMAP_SET_INITIAL_STATE:
      return { ...initialState };
    case types.LONGDOMAP_SET_LAST_POSITION:
      return {
        ...state,
        lastPosition: {
          latitude: action.payload?.latitude ?? null,
          longitude: action.payload?.longitude ?? null,
        },
      };
    default:
      return state;
  }
};
