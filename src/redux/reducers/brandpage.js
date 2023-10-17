import {STATE_STATUS} from '../constants';
import {BRANDPAGE_ACTIONS, BRAND_FILTERS} from '../constants/brandpage';

const initialState = {
  all: {
    status: STATE_STATUS.UNFETCHED,
    data: [],
  },
};

export const brandpageReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case BRANDPAGE_ACTIONS.FETCH_BRAND_LAYOUT_BY_LAYOUT_CODE:
      return {
        ...state,
        [`${payload.layoutCode}`]: {
          status: STATE_STATUS.FETCHING,
        },
      };
    case BRANDPAGE_ACTIONS.FETCHED_BRAND_LAYOUT_BY_LAYOUT_CODE:
      return {
        ...state,
        [`${payload.layoutCode}`]: {
          status: STATE_STATUS.FETCHED,
          data: payload.data.data.data,
        },
      };
    case BRANDPAGE_ACTIONS.FAILED_FETCH_BRAND_LAYOUT_BY_LAYOUT_CODE:
      return {
        ...state,
        [`${payload.layoutCode}`]: {
          status: STATE_STATUS.FAILED_FETCH,
          error: error,
        },
      };

    case BRANDPAGE_ACTIONS.FETCH_BRAND_BY_ID:
      return {
        ...state,
        [`${payload.code}`]: {
          status: STATE_STATUS.FETCHING,
        },
      };
    case BRANDPAGE_ACTIONS.FETCHED_BRAND_BY_ID:
      let data = payload.data.brands;
      let sortedData = {};
      BRAND_FILTERS.map(filter => {
        sortedData[`${filter.key}`] = data
          .filter(brandObj => {
            if (filter.key == '09') {
              return [
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
              ].includes(brandObj.name[0]);
            }
            return brandObj.name[0] == filter.key;
          })
          .sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
      });
      return {
        ...state,
        [`${payload.code}`]: {
          status: STATE_STATUS.FETCHED,
          data: sortedData,
        },
      };
    case BRANDPAGE_ACTIONS.FAILED_FETCH_BRAND_BY_ID:
      return {
        ...state,
        [`${payload.code}`]: {
          status: STATE_STATUS.FAILED_FETCH,
          error: error,
        },
      };

    default:
      return state;
  }
};
