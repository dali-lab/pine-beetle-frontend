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
    allCounties,
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
  } = props;

  const getCSVData = () => {};

  const statesMappedToNames = allStates.map(abbrev => getStateNameFromAbbreviation(abbrev));
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  return (
    <div id="predictionbar" className="container" style={{ display: 'flex' }}>
      <TextInput instructions="Start Year" setValue={setStartYear} value={startYear} />
      <TextInput instructions="End Year" setValue={setEndYear} value={endYear} />
      <ChoiceInput instructions="Select State" value={selectedState} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
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
      <button id="reset-current-data-button" className="submit static-button export-button" onClick={getCSVData} data-tip="Make sure to allow browser popups!">Export CSV</button>
    </div>
  );
};

export default SelectionBar;
