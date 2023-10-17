import {STATE_STATUS} from '../constants';
import {LISTINGPAGE_ACTIONS} from '../constants/listing';

const initialState = {};

export const listingReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case LISTINGPAGE_ACTIONS.FETCH_LISTING:
      if (payload.params.pageIndex === 0) {
        return {
          ...state,
          [`${payload.params.listingType}`]: {
            ...state[payload.params.listingType],
            [`${payload.params.str}`]: {
              status: STATE_STATUS.FETCHING,
              products: [],
              params: payload.params,
              filter: payload.params.filter,
              appliedFilter: payload.params.appliedFilter,
            },
          },
        };
      }
      return {
        ...state,
        [`${payload.params.listingType}`]: {
          ...state[payload.params.listingType],
          [`${payload.params.str}`]: {
            ...state[payload.params.listingType][payload.params.str],
            status: STATE_STATUS.FETCHING,
            params: payload.params,
            filter: payload.params.filter,
            appliedFilter: payload.params.appliedFilter,
          },
        },
      };
    case LISTINGPAGE_ACTIONS.FETCHED_LISTING:
      return {
        ...state,
        [`${payload.params.listingType}`]: {
          ...state[payload.params.listingType],
          [`${payload.params.str}`]: {
            ...state[payload.params.listingType][payload.params.str],
            maxPage: payload.products.totalCount / payload.params.pageSize,
            totalCount: payload.products.totalCount,
            status: STATE_STATUS.FETCHED,
            categoryRes:
              payload.products.categoryRes ||
              state[payload.params.listingType][payload.params.str].categoryRes,
            products: [
              ...state[payload.params.listingType][payload.params.str].products,
              ...payload.products.products,
            ].map((_, i) => {
              return {
                ..._,
                selfCounter: i,
              };
            }),
            filter: payload.params.filter,
            categoriesRecommended: payload.params.categoriesRecommended,
          },
        },
      };
    case LISTINGPAGE_ACTIONS.FAILED_FETCH_LISTING:
      return {
        ...state,
        [`${payload.params.listingType}`]: {
          ...state[payload.params.listingType],
          [`${payload.params.str}`]: {
            ...state[payload.params.listingType][payload.params.str],
            status: STATE_STATUS.FETCHED,
            error,
          },
        },
      };
    default:
      return state;
  }
};
