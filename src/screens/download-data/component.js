import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { DownloadData } from '../../components';
import { ROUTES } from '../../constants';
import {
  getAvailableStates,
  getAvailableSublocations,
  getAvailableYears,
  setEndYear,
  setStartYear,
} from '../../state/actions';

import './style.scss';

const DownloadDataScreen = (props) => {
  const dispatch = useDispatch();
  const {
    availableYears,
    dataMode,
    endYear,
    selectedState,
    startYear,
  } = props;

  // Load available data when component mounts or dataMode changes
  useEffect(() => {
    dispatch(getAvailableYears({ isHistorical: true }));
    dispatch(getAvailableStates({ isHistorical: true }, { historical: true, prediction: false }));
  }, [dataMode, dispatch]);

  // Set default years (oldest and newest) when years are loaded
  useEffect(() => {
    if (availableYears && availableYears.length > 0) {
      const sortedYears = [...availableYears].sort((a, b) => a - b);
      const oldestYear = sortedYears[0];
      const newestYear = sortedYears[sortedYears.length - 1];

      // Set defaults only if current values are empty/falsy
      if (!startYear) {
        dispatch(setStartYear(oldestYear));
      }
      if (!endYear) {
        dispatch(setEndYear(newestYear));
      }
    }
  }, [availableYears, startYear, endYear, dispatch]);

  // Load sublocations when state changes
  useEffect(() => {
    if (selectedState) {
      dispatch(getAvailableSublocations(
        selectedState,
        { isHistorical: true },
        { historical: true, prediction: false }
      ));
    }
  }, [selectedState, dataMode, dispatch]);

  return (
    <div className="download-data-screen">
      <div className="download-data-container">
        <div className="page-header">
          <h1>Download Data</h1>
        </div>

        <div className="download-data-content">
          <DownloadData
            availableYears={props.availableYears}
            availableStates={props.availableStates}
            availableSublocations={props.availableSublocations}
            clearAllSelections={props.clearAllSelections}
            county={props.county}
            dataMode={props.dataMode}
            endYear={props.endYear}
            rangerDistrict={props.rangerDistrict}
            selectedState={props.selectedState}
            setEndYear={props.setEndYear}
            setStartYear={props.setStartYear}
            startYear={props.startYear}
            setCounty={props.setCounty}
            setDataMode={props.setDataMode}
            setRangerDistrict={props.setRangerDistrict}
            setState={props.setState}
          />
        </div>

        <div className="page-footer-actions">
          <Link to={ROUTES.RESOURCES} className="resources-link-button">
            View Resources
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DownloadDataScreen;
