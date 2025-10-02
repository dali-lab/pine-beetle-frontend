import React from 'react';
import { useHistory } from 'react-router-dom';

import { ChoiceInput, MultiSelectInput } from '../../../../components/input-components';

import { DATA_MODES, ROUTES } from '../../../../constants';

import {
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
} from '../../../../utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    availableStates,
    availableYears,
    availableSublocations,
    clearAllSelections,
    selectedState,
    dataMode,
    county,
    rangerDistrict,
    setRangerDistrict,
    setCounty,
    setPredictionYear,
    setState,
    year,
  } = props;

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));
  const revYears = [...availableYears].reverse();

  const history = useHistory();

  return (
    <div className="container">
      <div id="predictionbar" className="modern-selection-bar">
        <div className="selection-section">
          <div className="section-label">Year</div>
          <div className="selection-input">
            <ChoiceInput setValue={setPredictionYear} options={revYears} value={year} />
          </div>
        </div>

        <div className="selection-divider" />

        <div className="selection-section">
          <div className="section-label">Locations</div>
          <div className="selection-input">
            <MultiSelectInput
              valueParent={selectedStateName}
              valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
              setValueParent={setStateAbbrev}
              setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
              optionsParent={statesMappedToNames}
              optionsChildren={availableSublocations}
            />
          </div>
        </div>

        <div className="selection-divider" />

        <div className="selection-actions">
          <button
            className="action-button clear-button"
            onClick={clearAllSelections}
            type="button"
          >
            Clear
          </button>
          <button
            onClick={() => history.push(ROUTES.RESULTS_COMPARISON)}
            type="button"
            className="action-button primary-button"
            data-tip="Map of predicted vs. observed outbreaks"
          >
            How did we do?
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionBar;
