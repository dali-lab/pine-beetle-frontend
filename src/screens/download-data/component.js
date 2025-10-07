import React from 'react';

import { DownloadData } from '../../components';

import './style.scss';

const DownloadDataScreen = (props) => {
  return (
    <div className="download-data-screen">
      <div className="download-data-container">
        <div className="page-header">
          <h1>Download Data</h1>
          <p className="page-description">
            Access historical pine beetle trapping data and download it in various formats.
            Select your preferred time range, location, and data type to customize your download.
          </p>
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
      </div>
    </div>
  );
};

export default DownloadDataScreen;
