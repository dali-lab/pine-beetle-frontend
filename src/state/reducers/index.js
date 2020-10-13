import { combineReducers } from 'redux';

import ErrorReducer from './error';
import PredictionsReducer from './predictions';
import SelectionsReducer from './selections';
import TrappingReducer from './trapping';
import UserReducer from './user';

const rootReducer = combineReducers({
  error: ErrorReducer,
  predictions: PredictionsReducer,
  selections: SelectionsReducer,
  trappings: TrappingReducer,
  user: UserReducer,
});

export default rootReducer;
