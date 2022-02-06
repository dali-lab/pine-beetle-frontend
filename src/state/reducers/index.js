import { combineReducers } from 'redux';

import ErrorReducer from './error';
import DataReducer from './data';
import SelectionsReducer from './selections';
import UserReducer from './user';

const rootReducer = combineReducers({
  data: DataReducer,
  error: ErrorReducer,
  selections: SelectionsReducer,
  user: UserReducer,
});

export default rootReducer;
