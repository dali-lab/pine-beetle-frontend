import React, { useEffect, useState } from 'react';

import { Loader } from '../../components';
import { stateAbbrevToStateName } from '../../constants';
import { colors } from '../../components/historical-data/trapping-data-map/constants';

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
      // Thresholds: ['no spot data', '0-9', '10-19', '20-49', '50-99', '100-249', '>249']
      let outbreakLevel = 'no spot data';
      if (item.spots > 249) outbreakLevel = '>249';
      else if (item.spots >= 100) outbreakLevel = '100-249';
      else if (item.spots >= 50) outbreakLevel = '50-99';
      else if (item.spots >= 20) outbreakLevel = '20-49';
      else if (item.spots >= 10) outbreakLevel = '10-19';
      else if (item.spots > 0) outbreakLevel = '0-9';
      else outbreakLevel = 'no spot data';

      return {
        id: index + 1,
        year: item.year,
        state: stateName,
        county: locationName,
        beetles: item.spb || 0,
        outbreak: outbreakLevel,
        clerids: item.clerids || 0,
        spots: item.spots || 0,
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
      const yearMatch = !filterYear || item.year.toString().includes(filterYear);
      const stateMatch = !filterState || item.state.toLowerCase().includes(filterState.toLowerCase());
      return yearMatch && stateMatch;
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
            Browse and analyze Southern Pine Beetle historical data in a structured table format.
            Use the filters and sorting options to explore the data.
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
                <th onClick={() => handleSort('beetles')} className="sortable">
                  Beetles Count
                  {sortField === 'beetles' && (
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
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((item) => (
                <tr key={item.id}>
                  <td>{item.year}</td>
                  <td>{item.state}</td>
                  <td>{item.county}</td>
                  <td>{item.beetles.toLocaleString()}</td>
                  <td>
                    <span
                      className="outbreak-badge"
                      style={{ backgroundColor: getOutbreakColor(item.outbreak) }}
                    >
                      {item.outbreak}
                    </span>
                  </td>
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
