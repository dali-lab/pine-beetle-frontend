import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
} from '../utils';
import {
  setCountyFilter as setCountyFilterAction,
  setDataMode as setDataModeAction,
  setEndYear as setEndYearAction,
  setRangerDistrictFilter as setRangerDistrictFilterAction,
  setStartYear as setStartYearAction,
  setState as setStateAction,
} from '../state/actions';
import {
  selectCounty,
  selectDataMode,
  selectEndYear,
  selectRangerDistrict,
  selectSelectedState,
  selectStartYear,
} from '../state/selectors';

const useDataTableFilters = () => {
  const dispatch = useDispatch();

  const dataMode = useSelector(selectDataMode);
  const startYear = useSelector(selectStartYear);
  const endYear = useSelector(selectEndYear);
  const selectedState = useSelector(selectSelectedState);
  const county = useSelector(selectCounty);
  const rangerDistrict = useSelector(selectRangerDistrict);

  const setStartYear = useCallback(
    (year) => dispatch(setStartYearAction(year)),
    [dispatch]
  );

  const setEndYear = useCallback(
    (year) => dispatch(setEndYearAction(year)),
    [dispatch]
  );

  const setState = useCallback(
    (state) => dispatch(setStateAction(state)),
    [dispatch]
  );

  const setCounty = useCallback(
    (countyValue) => dispatch(setCountyFilterAction(countyValue)),
    [dispatch]
  );

  const setRangerDistrict = useCallback(
    (rangerDistrictValue) => dispatch(setRangerDistrictFilterAction(rangerDistrictValue)),
    [dispatch]
  );

  const setDataMode = useCallback(
    (mode) => dispatch(setDataModeAction(mode)),
    [dispatch]
  );

  const setStateAbbrev = useCallback(
    (stateName) => {
      const stateAbbrev = getStateAbbreviationFromStateName(stateName);
      setState(stateAbbrev);
    },
    [setState]
  );

  const selectedStateName = useMemo(
    () => getStateNameFromAbbreviation(selectedState),
    [selectedState]
  );

  const apiFilters = useMemo(
    () => ({
      startYear: startYear || undefined,
      endYear: endYear || undefined,
      state: selectedState || undefined,
    }),
    [startYear, endYear, selectedState]
  );

  return {
    dataMode,
    startYear,
    endYear,
    selectedState,
    selectedStateName,
    county,
    rangerDistrict,
    apiFilters,
    setStartYear,
    setEndYear,
    setState,
    setStateAbbrev,
    setCounty,
    setRangerDistrict,
    setDataMode,
  };
};

export default useDataTableFilters;
