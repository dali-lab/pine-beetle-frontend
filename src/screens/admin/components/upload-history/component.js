import React, { useEffect, useState } from 'react';

import { getUploadHistory, getUploadAudit } from '../../../../services/admin';

const SOURCE_LABELS = {
  survey123: 'Survey123',
  'summarized-county': 'County',
  'summarized-county-spots': 'County Spots',
  'summarized-rangerdistrict': 'Ranger District',
  'summarized-rangerdistrict-spots': 'Ranger District Spots',
};

const STATUS_COLORS = {
  success: '#198754',
  partial: '#fd7e14',
  failed: '#dc3545',
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString();
};

const UploadHistory = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [expandedDetail, setExpandedDetail] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getUploadHistory({ limit: 50, status: statusFilter || undefined });
      setEntries(result?.data || []);
    } catch (err) {
      setError(err?.response?.data?.error?.toString() || 'Failed to load upload history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

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
      <div className="upload-history-header">
        <h3>Upload History</h3>
        <div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="partial">Partial</option>
            <option value="failed">Failed</option>
          </select>
          <button type="button" onClick={load} disabled={loading} style={{ marginLeft: 8 }}>
            {loading ? '...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <p className="upload-history-error">{error}</p>}

      <table className="upload-history-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Source</th>
            <th>File</th>
            <th>Status</th>
            <th>Accepted / Skipped / Rejected</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 && !loading && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 16 }}>No upload history yet.</td></tr>
          )}
          {entries.map((e) => (
            <React.Fragment key={e.uploadId}>
              <tr>
                <td>{formatDate(e.uploadedAt)}</td>
                <td>{SOURCE_LABELS[e.source] || e.source}</td>
                <td>{e.filename || '—'}</td>
                <td>
                  <span style={{ color: STATUS_COLORS[e.status] || '#000', fontWeight: 600 }}>
                    {e.status}
                  </span>
                </td>
                <td>{e.acceptedRows} / {e.skippedRows} / {e.rejectedRows}</td>
                <td>
                  <button type="button" onClick={() => toggleDetail(e.uploadId)}>
                    {expandedId === e.uploadId ? 'Hide' : 'Details'}
                  </button>
                </td>
              </tr>
              {expandedId === e.uploadId && (
                <tr>
                  <td colSpan={6} className="upload-history-detail">
                    {!expandedDetail && <p>Loading…</p>}
                    {expandedDetail?.error && <p className="upload-history-error">{expandedDetail.error}</p>}
                    {expandedDetail && !expandedDetail.error && (
                      <div>
                        {expandedDetail.errorMessage && (
                          <p><strong>Error:</strong> {expandedDetail.errorMessage}</p>
                        )}
                        {expandedDetail.rejected?.length > 0 && (
                          <details open>
                            <summary><strong>{expandedDetail.rejected.length} rejected</strong></summary>
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
                            <summary>{expandedDetail.skipped.length} skipped</summary>
                            <ul>
                              {expandedDetail.skipped.slice(0, 200).map((r) => (
                                <li key={`${r.identifier}-${r.reason}-${r.rowNumber}`}>{r.identifier} — {r.reason}</li>
                              ))}
                              {expandedDetail.skipped.length > 200 && <li key="more-skipped">… and {expandedDetail.skipped.length - 200} more</li>}
                            </ul>
                          </details>
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
    </div>
  );
};

export default UploadHistory;
