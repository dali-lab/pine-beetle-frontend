import React from 'react';

import {
  BarChart,
  OverviewText,
  PredictionDetails,
  PredictionMap,
  SelectionBar,
} from './components';

import './style.scss';

const Prediction = (props) => {
  const {
    isLoading,
    predictionData,
    predictionsErrorText,
    selectedState,
  } = props;

  // eslint-disable-next-line no-unused-vars
  // const [mapData, setMapData] = useState(null);
  // console.log(selectedState);
  // console.log(predictionData);

  const predDetails = (bool) => {
    if (bool) {
      return (
        <div>
          <div className="container" id="pred-header">Prediction Details</div>
          <div className="container" id="predictions">
            <div className="bar-chart">
              <BarChart data={predictionData} />
            </div>
            <div className="prediction-details">
              <PredictionDetails data={predictionData} />
            </div>
          </div>
        </div>
      );
    } else { return null; }
  };

  // useEffect(() => {
  //   setMapData(selectedState);
  //   console.log('selected state updated');
  // }, [selectedState]);

  return (
    <div>
      {/* TODO: make this a spinner */}
      {isLoading && <p>Loading...</p>}
      {predictionsErrorText.length > 0 && predictionsErrorText.map(t => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <PredictionMap data={selectedState} />
      {/* TODO: Dynamically Change header */}
      { predDetails(predictionData.length === 1) }
    </div>
  );
};

export default Prediction;
