import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';
import {CMS_BASE_URL} from '../redux/constants/index';

export const getBrandPageByLayoutCode = layoutCode =>
  axios.get(
    `${CMS_BASE_URL}cmsapi/apiLayout/getLayoutJsonByCode?${layoutCode}`,
  );

export const getBrandById = code => axios.get(`${BASE_URL}search/getAllBrands`);
