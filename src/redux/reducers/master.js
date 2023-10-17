import {MASTER_ACTIONS, MASTER_DATA} from '../constants/master';

const initialState = {
  selectedCode: 'IN',
  data: MASTER_DATA['IN'],
};

export const masterReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case MASTER_ACTIONS.SET_MASTER:
      return {
        ...state,
        selectedCode: payload,
        data: MASTER_DATA[payload],
      };
    default:
      return state;
  }
};
