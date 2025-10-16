import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
  PlayWithModelInputs,
  PlayWithModelOutputs,
  SelectionBar,
} from '../home/components/play-with-model/components';

import { DATA_MODES } from '../../constants';
import { clearCustomPredictionError, clearSelections, runCustomPrediction } from '../../state/actions';

import './style.scss';

export const DEFAULT_MODEL_VERSION = 2025;

const PlayWithModelScreen = (props) => {
  const {
    clearAllSelections,
    clearError, // function to clear the error
    fetchErrorText,
    county,
    dataMode,
    isError, // whether or not an error occurred
    predictions,
    rangerDistrict,
    runCustomPredictionAction, // function to call for running the prediction
    selectedState,
    year,
  } = props;

  useEffect(() => {
    clearAllSelections(); // clears selections initially when switching to this tab
  }, [clearAllSelections]);

  const [modelInputs, setModelInputs] = useState({
    cleridst1: null,
    endobrev: 1,
    spb: 0,
    spotst1: 0,
    spotst2: 0,
    modelVersion: DEFAULT_MODEL_VERSION,
  });

  const updateModelInputs = (updates) => {
    setModelInputs((currentInputs) => ({
      ...currentInputs,
      ...updates,
    }));
  };

  const runModel = () => {
    if (isError) {
      clearError();
    }
    runCustomPredictionAction(
      modelInputs.cleridst1,
      modelInputs.spotst1,
      modelInputs.spotst2,
      modelInputs.spb,
      modelInputs.endobrev,
      modelInputs.modelVersion,
    );
  };

  useEffect(() => {
    // don't run if no predictions
    if (predictions.length === 0) return;

    const selectedSubLocation = dataMode === DATA_MODES.COUNTY ? county : rangerDistrict;

    // sets input fields to 0 if selections not fully specified
    if (!selectedState || selectedSubLocation.length !== 1) {
      setModelInputs({
        cleridst1: null,
        endobrev: 1,
        spb: 0,
        spotst1: 0,
        spotst2: 0,
        modelVersion: DEFAULT_MODEL_VERSION,
      });
    } else {
      const {
        spotst1,
        spotst2,
        spbPer2Weeks,
        endobrev,
        cleridst1,
        modelVersion,
      } = predictions[0];

      // update the state
      updateModelInputs({
        spotst1,
        spotst2,
        spb: spbPer2Weeks,
        endobrev,
        cleridst1,
        modelVersion: modelVersion || DEFAULT_MODEL_VERSION,
      });
    }
  }, [county, dataMode, predictions, rangerDistrict, selectedState]);

  return (
    <div className="play-with-model-page">
      <div className="page-header">
        <h1>Model Explorer</h1>
        <p className="page-description">
          Interactive tool for exploring Southern Pine Beetle outbreak predictions through parameter manipulation and real-time analysis.
        </p>
      </div>

      <div className="container">
        {fetchErrorText.length > 0 && (
          <div className="error-alert">
            {fetchErrorText.map((error) => (
              <p key={error} className="error-text">{error}</p>
            ))}
          </div>
        )}

        <div className="model-explorer-layout">
          {/* Location Selection Section */}
          <section className="location-section">
            <div className="play-model-header">
              <h2>Location Selection</h2>
              <p className="section-subtitle">Choose your analysis area</p>
            </div>
            <div className="selection-container">
              <SelectionBar />
            </div>
          </section>

          {/* Model Parameters Section */}
          <section className="parameters-section">
            <div className="play-model-header">
              <h2>Model Parameters</h2>
              <p className="section-subtitle">Adjust input variables to explore predictions</p>
            </div>
            <div className="parameters-container">
              <PlayWithModelInputs
                modelInputs={modelInputs}
                runModel={runModel}
                updateModelInputs={updateModelInputs}
                defaultModelVersion={DEFAULT_MODEL_VERSION}
              />
            </div>
          </section>

          {/* Prediction Results Section */}
          <section className="results-section">
            <div className="play-model-header">
              <h2>Prediction Results</h2>
              <p className="section-subtitle">View model outputs and analysis</p>
            </div>
            <div className="results-container">
              <PlayWithModelOutputs
                county={county}
                dataMode={dataMode}
                rangerDistrict={rangerDistrict}
                selectedState={selectedState}
                year={year}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      dataMode,
      rangerDistrict,
      selectedState,
      year,
    },
    data: {
      predictions,
    },
    error: {
      customPredictionError,
    },
  } = state;

  return {
    county,
    dataMode,
    rangerDistrict,
    selectedState,
    year,
    predictions,
    fetchErrorText: customPredictionError.text,
    isError: customPredictionError.error.length > 0,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
    clearError: () => {
      dispatch(clearCustomPredictionError());
    },
    runCustomPredictionAction: (cleridst1, spotst1, spotst2, spb, endobrev, modelVersion) => {
      dispatch(runCustomPrediction(cleridst1, spotst1, spotst2, spb, endobrev, modelVersion));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayWithModelScreen);
