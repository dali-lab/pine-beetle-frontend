/* eslint-disable react/button-has-type */
import React from 'react';

import { TextInput, ChoiceInput } from '../../../../components/input-components';

import { DATA_MODES } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from './utils';

import './style.scss';

// const predictionBeetle = require('../../../../assets/icons/predict-beetle.png');

const SelectionBar = (props) => {
  const {
    clearAllSelections,
    county,
    dataMode,
    predictionsData,
    rangerDistrict,
    selectedState,
    setCounty,
    setRangerDistrict,
    setState,
    setYear,
    year,
  } = props;

  const countyMode = dataMode === DATA_MODES.COUNTY;

  const allStates = [...new Set(predictionsData.map(obj => obj.state))];
  const allCounties = selectedState ? [...new Set(predictionsData.map((obj => obj.county)))] : [];
  const allRangerDistricts = selectedState ? [...new Set(predictionsData.map((obj => obj.rangerDistrict)))] : [];

  const statesMappedToNames = allStates.map(abbrev => getStateNameFromAbbreviation(abbrev));
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  return (
    <div id="predictionbar" className="container">
      <TextInput instructions="Year" setValue={setYear} value={year} />
      <ChoiceInput instructions="State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
      {/* TODO: fix county/rd selection */}
      <ChoiceInput
        instructions={countyMode ? 'County' : 'Ranger District'}
        value={countyMode ? county : rangerDistrict}
        setValue={countyMode ? setCounty : setRangerDistrict}
        options={countyMode ? allCounties : allRangerDistricts}
        firstOptionText={countyMode ? 'County' : 'Ranger District'}
      />

      {/* <ChoiceInput instructions="Select State" submitFunction={updateState} availableOptions={availableStates} idName="state" value={this.state.stateName} firstOptionText="State" /> */}
      {/* <OptgroupChoiceInput
        instructions="Select County / Parish"
        submitFunction={this.props.dataController.updateForestSelection}
        availableOptions={sortedAvailableForests}
        idName="forest"
        value={this.state.forest}
        ref={this.forestInput}
        showAboveText
        firstOptionText="County / Parish"
      /> */}

      {/* TODO: make predict button predit things */}
      {/* <button className="predict-button">
        <p>Predict</p>
        <img
          src={predictionBeetle}
          alt="Predict Button"
        />
      </button> */}
      <button id="reset-current-data-button" className="submit static-button clear-button" onClick={clearAllSelections}>Clear Filters</button>
    </div>
  );
};

export default SelectionBar;
