import {
  ActionTypes as userActionTypes,
  login,
  signUp,
} from './user';

const ActionTypes = {
  ...userActionTypes,
};

export {
  ActionTypes,
  login,
  signUp,
};
