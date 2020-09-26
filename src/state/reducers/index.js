import { combineReducers } from 'redux';

import UserReducer from './user';
import SelectionsReducer from './selections';

const rootReducer = combineReducers({
  user: UserReducer,
  selections: SelectionsReducer,
});

export default rootReducer;
