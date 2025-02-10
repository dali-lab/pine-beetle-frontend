import { ActionTypes } from '../actions';

const initialState = {
  histogramData: [],
  frequency: '',
  error: null,
};

const HistogramReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_HISTOGRAM: {
      const { frequency, frequencyArray } = action.payload;
      return { ...state, histogramData: frequencyArray, frequency };
    }
    case ActionTypes.HISTOGRAM_API_ERROR:
      return { ...state, error: { message: action.payload.error, action: action.payload.action } };
    default:
      return state;
  }
};

export default HistogramReducer;
