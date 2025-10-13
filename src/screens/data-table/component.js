import React, { useEffect, useState } from 'react';

import './style.scss';

const DataTableScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('year');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterYear, setFilterYear] = useState('');
  const [filterState, setFilterState] = useState('');

  // Mock data - in a real application, this would come from an API
  const mockData = [
    {
      id: 1, year: 2020, state: 'Alabama', county: 'Baldwin', beetles: 1250, outbreak: 'Low',
    },
    {
      id: 2, year: 2020, state: 'Alabama', county: 'Mobile', beetles: 2100, outbreak: 'Medium',
    },
    {
      id: 3, year: 2020, state: 'Florida', county: 'Escambia', beetles: 850, outbreak: 'Low',
    },
    {
      id: 4, year: 2021, state: 'Alabama', county: 'Baldwin', beetles: 3200, outbreak: 'High',
    },
    {
      id: 5, year: 2021, state: 'Alabama', county: 'Mobile', beetles: 1800, outbreak: 'Medium',
    },
    {
      id: 6, year: 2021, state: 'Florida', county: 'Escambia', beetles: 1500, outbreak: 'Medium',
    },
    {
      id: 7, year: 2022, state: 'Alabama', county: 'Baldwin', beetles: 2800, outbreak: 'High',
    },
    {
      id: 8, year: 2022, state: 'Alabama', county: 'Mobile', beetles: 1200, outbreak: 'Low',
    },
    {
      id: 9, year: 2022, state: 'Florida', county: 'Escambia', beetles: 2200, outbreak: 'Medium',
    },
    {
      id: 10, year: 2023, state: 'Alabama', county: 'Baldwin', beetles: 1900, outbreak: 'Medium',
    },
    {
      id: 11, year: 2023, state: 'Alabama', county: 'Mobile', beetles: 3100, outbreak: 'High',
    },
    {
      id: 12, year: 2023, state: 'Florida', county: 'Escambia', beetles: 1100, outbreak: 'Low',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    switch (outbreak) {
      case 'Low': return '#4CD791';
      case 'Medium': return '#FFC148';
      case 'High': return '#FF525C';
      default: return '#AEAEAE';
    }
  };

  if (loading) {
    return (
      <div className="data-table-screen">
        <div className="data-table-container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading data...</p>
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
                  County
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
