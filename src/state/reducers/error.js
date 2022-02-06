import { ActionTypes } from '../actions';

const initialState = {
  fetchError: {
    error: [],
    text: [],
  },
  customPredictionError: {
    error: [],
    text: [],
    input: [],
  },
};

const ErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_DATA_FETCH_ERROR:
      return {
        ...state,
        fetchError: {
          error: [...state.fetchError.error, action.payload.error],
          text: [...state.fetchError.text, action.payload.text],
        },
      };

    case ActionTypes.CLEAR_DATA_FETCH_ERROR:
      return { ...state, fetchError: initialState.trappingError };

    case ActionTypes.SET_CUSTOM_PREDICTION_ERROR:
      return {
        ...state,
        customPredictionError: {
          error: [...state.customPredictionError.error, action.payload.error],
          text: [...state.customPredictionError.text, action.payload.text],
          input: [...state.customPredictionError.input, action.payload.input],
        },
      };

    case ActionTypes.CLEAR_CUSTOM_PREDICTION_ERROR:
      return { ...state, customPredictionError: initialState.customPredictionError };

    default:
      return state;
  }
};

export default ErrorReducer;
