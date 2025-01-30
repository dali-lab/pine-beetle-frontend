import { combineReducers } from 'redux';

import BlogReducer from './blog';
import ErrorReducer from './error';
import DataReducer from './data';
import SelectionsReducer from './selections';
import UserReducer from './user';
import HistogramReducer from './histogram';

const rootReducer = combineReducers({
  blog: BlogReducer,
  data: DataReducer,
  error: ErrorReducer,
  histogram: HistogramReducer,
  selections: SelectionsReducer,
  user: UserReducer,
});

export default rootReducer;
