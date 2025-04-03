import React from 'react';
import { DATA_MODES } from '../../../../constants';

const TogglesOverlay = ({
  dataMode, setDataMode,
}) => {
  return (
    <div id="toggles-overlay">
      <div className="selection-p">
        <div
          className={
                          dataMode === DATA_MODES.COUNTY
                            ? 'selected-option-p'
                            : 'unselected-option-p'
                        }
          onClick={() => setDataMode(DATA_MODES.COUNTY)}
        >
          <p
            className={
                            dataMode === DATA_MODES.COUNTY
                              ? 'selected-option-text-p'
                              : 'unselected-option-text-p'
                          }
          >
            Counties
          </p>
        </div>
        <div
          className={
                          dataMode !== DATA_MODES.COUNTY
                            ? 'selected-option-p'
                            : 'unselected-option-p'
                        }
          onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
        >
          <p
            className={
                            dataMode !== DATA_MODES.COUNTY
                              ? 'selected-option-text-p'
                              : 'unselected-option-text-p'
                          }
          >
            Federal Land
          </p>
        </div>
      </div>
    </div>

  );
};

export default TogglesOverlay;
