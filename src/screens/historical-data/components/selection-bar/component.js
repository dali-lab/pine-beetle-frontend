/* eslint-disable react/button-has-type */
import React from 'react';

import { TextInput, ChoiceInput } from '../../../../components/input-components';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from './utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    allStates,
    clearAllSelections,
    county,
    endYear,
    selectedState,
    setCounty,
    setEndYear,
    setStartYear,
    setState,
    startYear,
    trappingData,
  } = props;

  const statesMappedToNames = allStates.map(abbrev => getStateNameFromAbbreviation(abbrev));
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  const allCounties = selectedState ? [...new Set(trappingData.map((obj => obj.county)))] : [];

  return (
    <div id="predictionbar" className="container" style={{ display: 'flex' }}>
      <TextInput instructions="Start Year" setValue={setStartYear} value={startYear} />
      <TextInput instructions="End Year" setValue={setEndYear} value={endYear} />
      <ChoiceInput instructions="Select State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
      <ChoiceInput instructions="Select County" value={county} setValue={setCounty} options={allCounties} firstOptionText="County" />

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
