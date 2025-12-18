// Data selectors
export const selectSparseData = (state) => state.data.sparseData;
export const selectSublocationData = (state) => state.data.sublocationData;
export const selectFetchingSparseData = (state) => state.data.fetchingSparseData;
export const selectFetchingAggregateLocationData = (state) => state.data.fetchingAggregateLocationData;

export const selectIsDataTableLoading = (state) => (
  state.data.fetchingSparseData || state.data.fetchingAggregateLocationData
);

// Error selectors
export const selectDataTableErrorText = (state) => {
  const { text } = state.error.fetchError;
  return text && text.length > 0 ? text[text.length - 1] : null;
};

// Selection selectors
export const selectDataMode = (state) => state.selections.dataMode;
export const selectStartYear = (state) => state.selections.startYear;
export const selectEndYear = (state) => state.selections.endYear;
export const selectSelectedState = (state) => state.selections.state;
export const selectCounty = (state) => state.selections.county;
export const selectRangerDistrict = (state) => state.selections.rangerDistrict;
export const selectAvailableHistoricalYears = (state) => state.selections.availableHistoricalYears;
export const selectAvailableHistoricalStates = (state) => state.selections.availableHistoricalStates;
export const selectAvailableHistoricalSublocations = (state) => state.selections.availableHistoricalSublocations;
