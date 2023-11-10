import { combineReducers } from 'redux';

import BlogReducer from './blog';
import ErrorReducer from './error';
import DataReducer from './data';
import SelectionsReducer from './selections';
import UserReducer from './user';

const rootReducer = combineReducers({
  blog: BlogReducer,
  data: DataReducer,
  error: ErrorReducer,
  selections: SelectionsReducer,
  user: UserReducer,
});

export default rootReducer;
