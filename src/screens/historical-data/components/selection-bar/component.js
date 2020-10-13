/* eslint-disable react/button-has-type */
import React from 'react';

import { TextInput, ChoiceInput } from '../../../../components/input-components';

import { DATA_MODES } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from './utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    clearAllSelections,
    county,
    dataMode,
    endYear,
    rangerDistrict,
    selectedState,
    setCounty,
    setEndYear,
    setRangerDistrict,
    setStartYear,
    setState,
    startYear,
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
    <div id="predictionbar" className="container" style={{ display: 'flex' }}>
      <TextInput instructions="Start Year" setValue={setStartYear} value={startYear} />
      <TextInput instructions="End Year" setValue={setEndYear} value={endYear} />
      <ChoiceInput instructions="Select State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
      <ChoiceInput
        instructions={countyMode ? 'Select County' : 'Select Ranger District'}
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
      <button id="reset-current-data-button" className="submit static-button clear-button" onClick={clearAllSelections}>Clear Filters</button>
    </div>
  );
};

export default SelectionBar;
