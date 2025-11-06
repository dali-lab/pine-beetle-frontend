import { connect } from 'react-redux';

import {
  getSparseData,
  getAggregateLocationData,
  getAvailableStates,
  getAvailableYears,
  setStartYear,
  setEndYear,
  setState,
  setCounty,
  setRangerDistrict,
  setDataMode,
} from '../../state/actions';
import DataTableScreen from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      sparseData,
      fetchingSparseData,
      sublocationData,
      fetchingAggregateLocationData,
    },
    error: {
      fetchError: {
        text: errorText,
      },
    },
    selections: {
      dataMode,
      startYear,
      endYear,
      state: selectedState,
      county,
      rangerDistrict,
      availableHistoricalYears,
      availableHistoricalStates,
      availableHistoricalSublocations,
    },
  } = state;

  return {
    sparseData,
    sublocationData,
    isLoading: fetchingSparseData || fetchingAggregateLocationData,
    errorText: errorText && errorText.length > 0 ? errorText[errorText.length - 1] : null,
    dataMode,
    startYear,
    endYear,
    selectedState,
    county,
    rangerDistrict,
    availableHistoricalYears,
    availableHistoricalStates,
    availableHistoricalSublocations,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getSparseData: (filters) => dispatch(getSparseData(filters)),
  getAggregateLocationData: (filters) => dispatch(getAggregateLocationData(filters)),
  getAvailableStates: (filters) => dispatch(getAvailableStates(filters)),
  getAvailableYears: (filters) => dispatch(getAvailableYears(filters)),
  setStartYear: (year) => dispatch(setStartYear(year)),
  setEndYear: (year) => dispatch(setEndYear(year)),
  setState: (state) => dispatch(setState(state)),
  setCounty: (county) => dispatch(setCounty(county)),
  setRangerDistrict: (rangerDistrict) => dispatch(setRangerDistrict(rangerDistrict)),
  setDataMode: (mode) => dispatch(setDataMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTableScreen);
