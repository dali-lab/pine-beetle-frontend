import { combineReducers } from 'redux';

import PredictionsReducer from './predictions';
import SelectionsReducer from './selections';
import TrappingReducer from './trapping';
import UserReducer from './user';

const rootReducer = combineReducers({
  predictions: PredictionsReducer,
  selections: SelectionsReducer,
  trappings: TrappingReducer,
  user: UserReducer,
});

export default rootReducer;
