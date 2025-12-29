import React, { memo } from 'react';

import { formatCollectionDate } from '../../../utils';
import SortableHeader from './SortableHeader';
import { DATA_FORMATS, formatYearDisplay } from './constants';

const DataTableView = memo(({
  dataFormat,
  dataMode,
  paginatedData,
  sortField,
  sortDirection,
  handleSort,
}) => (
  <div className="table-container">
    <table className="data-table">
      <thead>
        <tr>
          <SortableHeader
            field="year"
            label="Year"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            field="state"
            label="State"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            className="text-left"
          />
          <SortableHeader
            field="county"
            label={dataMode === 'COUNTY' ? 'County' : 'Ranger District'}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            className="text-left"
          />
          {dataFormat === DATA_FORMATS.RAW ? (
            <>
              <SortableHeader
                field="trap"
                label="Trap"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="weekNumber"
                label="Week Number"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="spbCount"
                label="SPB Count"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="cleridCount"
                label="Clerid Count"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="collectionDate"
                label="Collection Date"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </>
          ) : (
            <>
              <SortableHeader
                field="trapCount"
                label="Trap Count"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="spbPer2Weeks"
                label="SPB per 2 Weeks"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="probSpotsGT50"
                label="Prob > 50 Spots"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="predSpotsorigUnits"
                label="Predicted Spots"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {paginatedData.length === 0 ? (
          <tr>
            <td colSpan={dataFormat === DATA_FORMATS.RAW ? 8 : 7} className="no-data">
              No data available for the selected filters
            </td>
          </tr>
        ) : (
          paginatedData
            .filter((item) => item && item.id)
            .map((item, index) => (
              <tr key={item.id || `row-${index}`}>
                <td>{formatYearDisplay(item.year, dataFormat) || 'N/A'}</td>
                <td className="text-left">{item.state || 'N/A'}</td>
                <td className="text-left">{item.county || 'N/A'}</td>
                {dataFormat === DATA_FORMATS.RAW ? (
                  <>
                    <td>{item.trap || 'N/A'}</td>
                    <td>{item.weekNumber !== null && item.weekNumber !== undefined ? item.weekNumber : 'N/A'}</td>
                    <td>{item.spbCount !== undefined && item.spbCount !== null ? item.spbCount.toLocaleString() : 'N/A'}</td>
                    <td>{item.cleridCount !== undefined && item.cleridCount !== null ? item.cleridCount.toLocaleString() : 'N/A'}</td>
                    <td>
                      {item.collectionDate ? formatCollectionDate(item.collectionDate) : 'N/A'}
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.trapCount !== undefined && item.trapCount !== null ? item.trapCount.toLocaleString() : 'N/A'}</td>
                    <td>{item.spbPer2Weeks !== undefined && item.spbPer2Weeks !== null ? item.spbPer2Weeks.toLocaleString() : 'N/A'}</td>
                    <td className="probability-cell">
                      {item.probSpotsGT50 !== undefined && item.probSpotsGT50 !== null ? `${(item.probSpotsGT50 * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="prediction-cell">
                      {item.predSpotsorigUnits !== undefined && item.predSpotsorigUnits !== null ? item.predSpotsorigUnits.toFixed(1) : 'N/A'}
                    </td>
                  </>
                )}
              </tr>
            ))
        )}
      </tbody>
    </table>
  </div>
));

DataTableView.displayName = 'DataTableView';

export default DataTableView;
