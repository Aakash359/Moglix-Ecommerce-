// dependencies
import {put, call, fork, takeEvery} from 'redux-saga/effects';
// constants
import {HOMEPAGE_ACTIONS} from '../constants/homepage';
// api call
import {getPageByLayoutCode} from '../../services/homepage';
// actions
import {
  fetchedLayoutByLayoutCode,
  failedFetchLayoutByLayoutCode,
} from '../actions/homepage';

import {trackStateAdobe} from '../../services/analytics';
import {SEARCH_LAYOUT} from '../constants/search';

function* fetchLayoutByLayoutCode({payload: {layoutCode}}) {
  try {
    if (layoutCode == 'layoutCode=CM1000013') {
      yield put(fetchedLayoutByLayoutCode(layoutCode, SEARCH_LAYOUT));
    } else {
      const {data, error} = yield call(getPageByLayoutCode, layoutCode);
      if (error) {
        yield put(failedFetchLayoutByLayoutCode(layoutCode, error));
      } else {
        yield put(fetchedLayoutByLayoutCode(layoutCode, data));
        data.data.forEach((item, index) => {
          if (item.componentLabel == 'homepage_header_category') {
            item.data.forEach((item2, index) => {
              if (layoutCode == item2.redirectPageData[0].redirectPageLink) {
                let adobeData = {
                  'myapp.pageName': 'moglix:home:' + item2.title,
                  'myapp.channel': 'home',
                  'myapp.subSection': 'moglix:home' + item2.title,
                  '&&events': 'event21',
                };
                trackStateAdobe(adobeData);
              }
            });
          }
        });
      }
    }
  } catch (error) {
    yield put(failedFetchLayoutByLayoutCode(layoutCode, error));
  }
}

export default fork(function* () {
  yield takeEvery(
    HOMEPAGE_ACTIONS.FETCH_LAYOUT_BY_LAYOUT_CODE,
    fetchLayoutByLayoutCode,
  );
});
