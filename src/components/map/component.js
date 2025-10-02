import React from 'react';
import ReactTooltip from 'react-tooltip';
import questionIcon from '../../assets/icons/help-circle.png';

const helpText = 'Please use Chrome, Firefox,<br />\nor Edge to download map.';

const Map = (props) => {
  const {
    hover,
    downloadCallback,
    isDownloadingMap,
  } = props;

  return (
    <>
      <div id="map" />
      <div
        id="map-overlay-download"
        onClick={downloadCallback}
      >
        <h4>{isDownloadingMap ? 'Downloading...' : 'Download Map'}</h4>
        <div>
          <img id="icon-small"
            data-tip={helpText}
            src={questionIcon}
            alt="Help"
          />
          <ReactTooltip multiline place="right" />
        </div>
      </div>
      {hover}
    </>
  );
};

export default Map;
