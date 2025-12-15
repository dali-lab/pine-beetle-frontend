import React from 'react';
import { Link } from 'react-router-dom';

import { DownloadData } from '../../components';
import { ROUTES } from '../../constants';

import './style.scss';

const DownloadDataScreen = (props) => {
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
