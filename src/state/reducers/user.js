import { ActionTypes } from '../actions';

const initialState = {
  user: {},
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER_DATA:
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

export default UserReducer;
