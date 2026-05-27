import React, { useEffect, useState } from 'react';

import { ChoiceInput } from '../../../../components/input-components';
import { getUploadHistory, getUploadAudit } from '../../../../services/admin';

const SOURCE_LABELS = {
  survey123: 'Survey123',
  'summarized-county': 'County',
  'summarized-county-spots': 'County Spots',
  'summarized-rangerdistrict': 'Ranger District',
  'summarized-rangerdistrict-spots': 'Ranger District Spots',
};

const STATUS_LABELS = {
  success: 'Success',
  partial: 'Partial',
  failed: 'Failed',
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString();
};

const PAGE_SIZE = 20;

const UploadHistory = ({ refreshKey }) => {
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [expandedDetail, setExpandedDetail] = useState(null);

  const load = async (targetPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const result = await getUploadHistory({
        page: targetPage,
        limit: PAGE_SIZE,
        status: statusFilter || undefined,
      });
      setEntries(result?.data || []);
      setPagination(result?.pagination || null);
      setPage(targetPage);
      setExpandedId(null);
      setExpandedDetail(null);
    } catch (err) {
      setError(err?.response?.data?.error?.toString() || 'Failed to load upload history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, refreshKey]);

  const toggleDetail = async (uploadId) => {
    if (expandedId === uploadId) {
      setExpandedId(null);
      setExpandedDetail(null);
      return;
    }
    setExpandedId(uploadId);
    setExpandedDetail(null);
    try {
      const detail = await getUploadAudit(uploadId);
      setExpandedDetail(detail);
    } catch (err) {
      setExpandedDetail({ error: err?.response?.data?.error?.toString() || 'Failed to load detail' });
    }
  };

  return (
    <div id="upload-history-container">
      <div className="upload-history-toolbar">
        <p className="upload-history-intro">
          Recent CSV uploads with accepted, skipped, and rejected row counts.
        </p>
        <div className="upload-history-controls">
          <div className="upload-history-filter">
            <span className="upload-history-filter-label">Status</span>
            <ChoiceInput
              id="upload-history-status"
              options={['Success', 'Partial', 'Failed']}
              value={STATUS_LABELS[statusFilter] || ''}
              setValue={(label) => setStatusFilter(label ? label.toLowerCase() : '')}
              firstOptionText="All"
            />
          </div>
          <button type="button" className="admin-link-button" onClick={() => load(page)} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <p className="upload-history-error" role="alert">{error}</p>}

      {entries.length === 0 && !loading ? (
        <p className="upload-history-empty">No uploads recorded yet.</p>
      ) : (
        <table className="upload-history-table">
          <caption className="visually-hidden">Recent CSV uploads with accepted, skipped, and rejected row counts.</caption>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Source</th>
              <th scope="col">File</th>
              <th scope="col">Status</th>
              <th scope="col" className="count-col">Accepted</th>
              <th scope="col" className="count-col">Skipped</th>
              <th scope="col" className="count-col">Rejected</th>
              <th scope="col"><span className="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <React.Fragment key={e.uploadId}>
                <tr>
                  <td data-label="Time">{formatDate(e.uploadedAt)}</td>
                  <td data-label="Source">{SOURCE_LABELS[e.source] || e.source}</td>
                  <td data-label="File">{e.filename || '—'}</td>
                  <td data-label="Status">
                    <span className={`status-badge status-badge--${e.status}`}>
                      {STATUS_LABELS[e.status] || e.status}
                    </span>
                  </td>
                  <td data-label="Accepted" className="count-col">
                    <span className="count count--accepted">{e.acceptedRows}</span>
                  </td>
                  <td data-label="Skipped" className="count-col">
                    <span className={`count ${e.skippedRows > 0 ? 'count--skipped' : 'count--zero'}`}>{e.skippedRows}</span>
                  </td>
                  <td data-label="Rejected" className="count-col">
                    <span className={`count ${e.rejectedRows > 0 ? 'count--rejected' : 'count--zero'}`}>{e.rejectedRows}</span>
                  </td>
                  <td data-label="Details" className="upload-history-actions">
                    <button
                      type="button"
                      className="upload-history-details"
                      onClick={() => toggleDetail(e.uploadId)}
                      aria-expanded={expandedId === e.uploadId}
                    >
                      <span>{expandedId === e.uploadId ? 'Hide' : 'Details'}</span>
                      <span className="chevron" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
                {expandedId === e.uploadId && (
                  <tr>
                    <td colSpan={8} className="upload-history-detail">
                      {!expandedDetail && <p>Loading…</p>}
                      {expandedDetail?.error && <p className="upload-history-error" role="alert">{expandedDetail.error}</p>}
                      {expandedDetail && !expandedDetail.error && (
                        <div>
                          {expandedDetail.errorMessage && (
                            <p><strong>Error:</strong> {expandedDetail.errorMessage}</p>
                          )}
                          {expandedDetail.rejected?.length > 0 && (
                            <details open>
                              <summary>{expandedDetail.rejected.length} rejected — action needed</summary>
                              <ul>
                                {expandedDetail.rejected.slice(0, 200).map((r) => (
                                  <li key={`${r.identifier}-${r.reason}-${r.field || ''}-${r.rowNumber}`}>{r.identifier} — {r.reason}{r.field ? ` (${r.field})` : ''}</li>
                                ))}
                                {expandedDetail.rejected.length > 200 && <li key="more-rejected">… and {expandedDetail.rejected.length - 200} more</li>}
                              </ul>
                            </details>
                          )}
                          {expandedDetail.skipped?.length > 0 && (
                            <details>
                              <summary>{expandedDetail.skipped.length} skipped — informational</summary>
                              <ul>
                                {expandedDetail.skipped.slice(0, 200).map((r) => (
                                  <li key={`${r.identifier}-${r.reason}-${r.rowNumber}`}>{r.identifier} — {r.reason}</li>
                                ))}
                                {expandedDetail.skipped.length > 200 && <li key="more-skipped">… and {expandedDetail.skipped.length - 200} more</li>}
                              </ul>
                            </details>
                          )}
                          {!expandedDetail.errorMessage
                            && !expandedDetail.rejected?.length
                            && !expandedDetail.skipped?.length && (
                            <p>All rows accepted — nothing skipped or rejected.</p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="upload-history-pagination">
          <button
            type="button"
            className="admin-link-button"
            onClick={() => load(page - 1)}
            disabled={loading || page <= 1}
          >
            Previous
          </button>
          <span className="upload-history-page-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            className="admin-link-button"
            onClick={() => load(page + 1)}
            disabled={loading || page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadHistory;
