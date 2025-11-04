import React, { useEffect, useState } from 'react';

import { Loader } from '../../components';
import { colors } from '../../components/historical-data/trapping-data-map/constants';
import { stateAbbrevToStateName } from '../../constants';

import './style.scss';

const DataTableScreen = ({
  sparseData,
  isLoading,
  errorText,
  dataMode,
  getSparseData,
}) => {
  const [sortField, setSortField] = useState('year');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterYear, setFilterYear] = useState('');
  const [filterState, setFilterState] = useState('');

  // Transform API data to table format
  const transformData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData.map((item, index) => {
      const stateName = stateAbbrevToStateName[item.state] || item.state;
      const locationName = dataMode === 'COUNTY' ? item.county : item.rangerDistrict;

      // Determine outbreak level based on spots using exact thresholds from trapping-data-map
      // Use spotst0 if available, otherwise fall back to spots
      // Only use spotst0 if it's actually defined and not null
      let spotsValue = 0;
      if (item.spotst0 !== undefined && item.spotst0 !== null) {
        spotsValue = item.spotst0;
      } else if (item.spots !== undefined && item.spots !== null) {
        spotsValue = item.spots;
      }

      // Thresholds: ['no spot data', '0-9', '10-19', '20-49', '50-99', '100-249', '>249']
      let outbreakLevel = 'no spot data';
      if (spotsValue > 249) outbreakLevel = '>249';
      else if (spotsValue >= 100) outbreakLevel = '100-249';
      else if (spotsValue >= 50) outbreakLevel = '50-99';
      else if (spotsValue >= 20) outbreakLevel = '20-49';
      else if (spotsValue >= 10) outbreakLevel = '10-19';
      else if (spotsValue > 0) outbreakLevel = '0-9';
      else outbreakLevel = 'no spot data';

      return {
        id: index + 1,
        year: item.year,
        state: stateName,
        county: locationName,
        // Trapping details
        trapCount: item.trapCount || 0,
        totalTrappingDays: item.totalTrappingDays || 0,
        daysPerTrap: item.daysPerTrap || 0,
        // Beetle metrics
        beetles: item.spb || item.spbCount || 0,
        spbPer2Weeks: item.spbPer2Weeks || 0,
        outbreak: outbreakLevel,
        clerids: item.clerids || 0,
        spots: spotsValue,
        spotst1: item.spotst1 || 0,
        // Probabilities (store as decimals, will format as percentages in display)
        probSpotsGT0: item.probSpotsGT0 || 0,
        probSpotsGT50: item.probSpotsGT50 || 0,
        probSpotsGT150: item.probSpotsGT150 || 0,
        probSpotsGT400: item.probSpotsGT400 || 0,
        probSpotsGT1000: item.probSpotsGT1000 || 0,
        // Predictions
        predSpotsorigUnits: item.predSpotsorigUnits || 0,
        residualSpotslogUnits: item.residualSpotslogUnits || 0,
      };
    });
  };

  const data = transformData(sparseData);

  // Debug logging
  console.log('DataTableScreen: sparseData =', sparseData);
  console.log('DataTableScreen: isLoading =', isLoading);
  console.log('DataTableScreen: errorText =', errorText);
  console.log('DataTableScreen: transformed data =', data);

  // Debug: Log first item structure if data exists
  if (sparseData && sparseData.length > 0) {
    console.log('DataTableScreen: First item structure =', sparseData[0]);
    console.log('DataTableScreen: Available fields =', Object.keys(sparseData[0]));
    console.log('DataTableScreen: spots field value =', sparseData[0].spots);
    console.log('DataTableScreen: spotst0 field value =', sparseData[0].spotst0);
  }

  // Debug: Log first transformed item to check outbreak calculation
  if (data && data.length > 0) {
    console.log('DataTableScreen: First transformed item =', data[0]);
    console.log('DataTableScreen: Outbreak level =', data[0].outbreak);
    console.log('DataTableScreen: Spots value used =', data[0].spots);
  }

  useEffect(() => {
    // Fetch real data when component mounts
    console.log('DataTableScreen: Fetching sparse data...');
    getSparseData();
  }, [getSparseData]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = data
    .filter((item) => {
      // Filter by year and state
      const yearMatch = !filterYear || item.year.toString().includes(filterYear);
      const stateMatch = !filterState || item.state.toLowerCase().includes(filterState.toLowerCase());

      // Exclude rows where trap count and SPB per 2 weeks are both 0
      const hasData = item.trapCount > 0 || item.spbPer2Weeks > 0;

      return yearMatch && stateMatch && hasData;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getOutbreakColor = (outbreak) => {
    // Use exact colors from trapping-data-map constants
    // Colors: ['#D3D3D3', '#86CCFF', '#FFC148', '#FFA370', '#FF525C', '#CB4767', '#6B1B38']
    const thresholdIndex = ['no spot data', '0-9', '10-19', '20-49', '50-99', '100-249', '>249'].indexOf(outbreak);
    return thresholdIndex !== -1 ? colors[thresholdIndex] : '#AEAEAE';
  };

  if (isLoading) {
    return (
      <div className="data-table-screen">
        <div className="data-table-container">
          <Loader visible={isLoading} message="Loading data..." />
        </div>
      </div>
    );
  }

  if (errorText) {
    return (
      <div className="data-table-screen">
        <div className="data-table-container">
          <div className="error-container">
            <h2>Error Loading Data</h2>
            <p>{errorText}</p>
            <button type="button" onClick={() => getSparseData()} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-screen">
      <div className="data-table-container">
        <div className="page-header">
          <h1>Historical Data Table</h1>
          <p className="page-description">
            Browse and analyze Southern Pine Beetle data including trap counts, beetle activity,
            outbreak levels, outbreak probability, and predictions. Use filters and sorting options to
            explore trends across ranger districts and counties.
          </p>
        </div>

        <div className="table-controls">
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="year-filter">
                Filter by Year:
                <input
                  id="year-filter"
                  type="text"
                  placeholder="Enter year..."
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                />
              </label>
            </div>
            <div className="filter-group">
              <label htmlFor="state-filter">
                Filter by State:
                <input
                  id="state-filter"
                  type="text"
                  placeholder="Enter state..."
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('year')} className="sortable">
                  Year
                  {sortField === 'year' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('state')} className="sortable">
                  State
                  {sortField === 'state' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('county')} className="sortable">
                  {dataMode === 'COUNTY' ? 'County' : 'Ranger District'}
                  {sortField === 'county' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('trapCount')} className="sortable">
                  Trap Count
                  {sortField === 'trapCount' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('spbPer2Weeks')} className="sortable">
                  SPB per 2 Weeks
                  {sortField === 'spbPer2Weeks' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('outbreak')} className="sortable">
                  Outbreak Level
                  {sortField === 'outbreak' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('probSpotsGT50')} className="sortable">
                  Prob &gt; 50 Spots
                  {sortField === 'probSpotsGT50' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('predSpotsorigUnits')} className="sortable">
                  Predicted Spots
                  {sortField === 'predSpotsorigUnits' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((item) => (
                <tr key={item.id}>
                  <td>{item.year}</td>
                  <td>{item.state}</td>
                  <td>{item.county}</td>
                  <td>{item.trapCount.toLocaleString()}</td>
                  <td>{item.spbPer2Weeks.toLocaleString()}</td>
                  <td>
                    <span
                      className="outbreak-badge"
                      style={{ backgroundColor: getOutbreakColor(item.outbreak) }}
                    >
                      {item.outbreak}
                    </span>
                  </td>
                  <td className="probability-cell">{(item.probSpotsGT50 * 100).toFixed(1)}%</td>
                  <td className="prediction-cell">{item.predSpotsorigUnits.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>Showing {filteredAndSortedData.length} of {data.length} records</p>
        </div>
      </div>
    </div>
  );
};

export default DataTableScreen;
