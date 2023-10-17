import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getTrendingCategories = code =>
  axios.get(`${BASE_URL}category/trendingCategory`);

export const fetchSuggestions = text =>
  axios.get('https://api.moglix.com/homepage/getsuggestion', {
    params: {
      str: text,
      device: `app`,
    },
  });

export const isBrandCategory = params =>
  axios.get('https://api.moglix.com/search/isBrandCategory', {
    params: {
      ...params,
    },
  });
