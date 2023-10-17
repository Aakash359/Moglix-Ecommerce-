import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getListing = params =>
  axios.get(
    `${BASE_URL}${
      params.listingType === 'Search'
        ? 'search'
        : params.listingType === 'Category'
        ? 'category/getcategory'
        : 'brand/getbrand'
    }`,
    {
      params: {
        ...params,
        filter: encodeURIComponent(JSON.stringify(params.appliedFilter)),
      },
    },
  );

export const getCategoryById = catId =>
  axios.get(`${BASE_URL}category/getcategorybyid`, {
    params: {catId},
  });
