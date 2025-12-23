import { useEffect, useState } from 'react';
import { DATA_MODES } from '../constants';
import { api } from '../services';

/**
 * Custom hook to fetch and manage ranger districts when in RANGER_DISTRICT mode
 * @param {string} dataMode - Current data mode (COUNTY or RANGER_DISTRICT)
 * @returns {Array} Array of available ranger districts
 */
const useRangerDistricts = (dataMode) => {
  const [allRangerDistricts, setAllRangerDistricts] = useState([]);

  useEffect(() => {
    if (dataMode === DATA_MODES.RANGER_DISTRICT) {
      api.getAvailableSublocations(dataMode)
        .then(setAllRangerDistricts)
        .catch((error) => {
          console.error('Failed to fetch ranger districts:', error);
        });
    } else {
      setAllRangerDistricts([]);
    }
  }, [dataMode]);

  return allRangerDistricts;
};

export default useRangerDistricts;
