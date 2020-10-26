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
    // clearAllSelections,
    county,
    dataMode,
    rangerDistrict,
    selectedState,
    setCounty,
    setRangerDistrict,
    setYear,
    setState,
    year,
    trappingData,
  } = props;

  const countyMode = dataMode === DATA_MODES.COUNTY;

  const allStates = [...new Set(trappingData.map(obj => obj.state))];
  const allCounties = selectedState ? [...new Set(trappingData.map((obj => obj.county)))] : [];
  const allRangerDistricts = selectedState ? [...new Set(trappingData.map((obj => obj.rangerDistrict)))] : [];

  const statesMappedToNames = allStates.map(abbrev => getStateNameFromAbbreviation(abbrev));
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  return (
    <div id="predictionbar" className="container">
      <TextInput instructions="Year" setValue={setYear} value={year} />
      <ChoiceInput instructions="State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
      {/* TODO: fix county/rd selection */}
      <ChoiceInput
        instructions={countyMode ? 'County' : 'RD'}
        value={countyMode ? county : rangerDistrict}
        setValue={countyMode ? setCounty : setRangerDistrict}
        options={countyMode ? allCounties : allRangerDistricts}
        firstOptionText={countyMode ? 'County' : 'RD'}
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
    </div>
  );
};

export default SelectionBar;
