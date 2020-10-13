import { ActionTypes } from '../actions';

const initialState = {
  trappingError: {
    error: [],
    text: [],
  },
  predictionsError: {
    error: [],
    text: [],
  },
};

const ErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_TRAPPING_ERROR:
      return {
        ...state,
        trappingError: {
          error: [...state.trappingError.error, action.payload.error],
          text: [...state.trappingError.text, action.payload.text],
        },
      };

    case ActionTypes.CLEAR_TRAPPING_ERROR:
      return { ...state, trappingError: initialState.trappingError };

    case ActionTypes.SET_PREDICTIONS_ERROR:
      return {
        ...state,
        predictionsError: {
          error: [...state.predictionsError.error, action.payload.error],
          text: [...state.predictionsError.text, action.payload.text],
        },
      };

    case ActionTypes.CLEAR_PREDICTIONS_ERROR:
      return { ...state, predictionsError: initialState.predictionsError };

    default:
      return state;
  }
};

export default ErrorReducer;
