import React, { useState } from 'react';

import './style.scss';

const REASON_LABELS = {
  MISSING_COLLECTION_DATE: 'no collection date for this week',
  ZERO_DAYS_ACTIVE: 'days active = 0 (trap not deployed)',
  MARKED_DELETE: 'marked for deletion in source',
  NOT_FINAL_COLLECTION: 'not a final collection',
  MISSING_REQUIRED_FIELD: 'required field missing',
  MISSING_FORMAT_FIELD: 'expected CSV format field missing',
  ROW_PROCESSING_ERROR: 'row could not be processed',
  ACTIVE_DAYS_OUT_OF_RANGE: 'total active days outside allowed window',
  INVALID_NUMERIC: 'value is not a valid number',
  INVALID_DATE: 'value is not a valid date',
};

const renderRejectedLine = (r) => {
  const label = REASON_LABELS[r.reason] || r.reason;
  let detail = '';
  if (r.value) detail = ` (${r.field}: ${r.value})`;
  else if (r.field) detail = ` (${r.field})`;
  return `${r.identifier} — ${label}${detail}`;
};

const labelFor = (reason) => REASON_LABELS[reason] || reason;

const PreviewSummary = ({
  preview,
  onCancel,
  onConfirm,
  isUploading,
}) => {
  const skippedGroups = preview.skipped.reduce((acc, item) => {
    acc[item.reason] = (acc[item.reason] || 0) + 1;
    return acc;
  }, {});
  const rejectedGroups = preview.rejected.reduce((acc, item) => {
    acc[item.reason] = (acc[item.reason] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="upload-preview-container">
      <h3>Preview</h3>
      <div className="upload-preview-counts">
        <div className="upload-preview-count upload-preview-count-accepted">
          <span className="upload-preview-count-value">{preview.accepted}</span>
          <span className="upload-preview-count-label">Accepted</span>
        </div>
        <div className="upload-preview-count upload-preview-count-skipped">
          <span className="upload-preview-count-value">{preview.skipped.length}</span>
          <span className="upload-preview-count-label">Skipped</span>
        </div>
        <div className="upload-preview-count upload-preview-count-rejected">
          <span className="upload-preview-count-value">{preview.rejected.length}</span>
          <span className="upload-preview-count-label">Rejected</span>
        </div>
      </div>

      {preview.rejected.length > 0 && (
        <details open>
          <summary>{preview.rejected.length} rejected — action needed</summary>
          <ul className="upload-preview-list">
            {Object.entries(rejectedGroups).map(([reason, count]) => (
              <li key={reason}><strong>{count}×</strong> {labelFor(reason)}</li>
            ))}
          </ul>
          <ul className="upload-preview-detail">
            {preview.rejected.slice(0, 50).map((r) => (
              <li key={`${r.identifier}-${r.reason}-${r.field || ''}`}>{renderRejectedLine(r)}</li>
            ))}
            {preview.rejected.length > 50 && <li key="more">… and {preview.rejected.length - 50} more</li>}
          </ul>
        </details>
      )}

      {preview.skipped.length > 0 && (
        <details>
          <summary>{preview.skipped.length} skipped — informational</summary>
          <ul className="upload-preview-list">
            {Object.entries(skippedGroups).map(([reason, count]) => (
              <li key={reason}><strong>{count}×</strong> {labelFor(reason)}</li>
            ))}
          </ul>
        </details>
      )}

      <div className="upload-preview-actions">
        <button type="button" onClick={onCancel} disabled={isUploading}>Cancel</button>
        <button
          type="button"
          className="upload-preview-confirm"
          onClick={onConfirm}
          disabled={isUploading || preview.accepted === 0}
        >
          {isUploading ? 'Uploading…' : `Confirm Upload (${preview.accepted})`}
        </button>
      </div>
    </div>
  );
};

const FileInput = (props) => {
  const {
    guideURL,
    component,
    onResetFiles,
    onUploadComplete,
    fileFormat = '.csv',
  } = props;

  const [isPreviewing, setIsPreviewing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadingFileError, setUploadingFileError] = useState('');
  const [successMessage, setSuccessMessage] = useState({});

  const clearSuccessMessage = () => setSuccessMessage({});

  const clearError = () => {
    setUploadingFileError('');
    onResetFiles();
    setIsUploadingFile(false);
    setIsPreviewing(false);
    setPreview(null);
    setSuccessMessage({});
  };

  const handlePreview = async () => {
    if (!component.previewFile || !component.file) {
      // no preview available — fall back to direct upload
      // eslint-disable-next-line no-use-before-define
      return doUpload();
    }
    setIsPreviewing(true);
    try {
      const result = await component.previewFile(component.file);
      setPreview(result);
    } catch (err) {
      const { data, status } = err?.response || {};
      const strippedError = (data?.error || '').toString().replace('Error: ', '');
      const badColumnNames = strippedError.includes('missing fields in csv');
      const wrongFileFormat = strippedError.includes('Invalid file type');
      if (badColumnNames) setUploadingFileError('Incorrect column names. Please upload a different CSV.');
      else if (wrongFileFormat) setUploadingFileError('Invalid file type. Only CSV files are allowed.');
      else if (status === 400) setUploadingFileError(`Bad request: ${strippedError}`);
      else setUploadingFileError(strippedError || 'We encountered an error. Please try again.');
    } finally {
      setIsPreviewing(false);
    }
    return undefined;
  };

  const doUpload = async () => {
    setIsUploadingFile(true);
    try {
      await component.uploadFile(component.file);
      component.selectFile();
      setPreview(null);
      const acceptedLine = preview ? ` ${preview.accepted} accepted, ${preview.rejected.length} rejected.` : '';
      setSuccessMessage({ [component.id]: `Successfully uploaded file.${acceptedLine}` });
      setTimeout(clearSuccessMessage, 1000 * 7);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      const { data, status } = err?.response || {};
      const strippedError = (data?.error || '').toString().replace('Error: ', '');
      const badColumnNames = strippedError.includes('missing fields in csv');
      const wrongFileFormat = strippedError.includes('Invalid file type');
      if (badColumnNames) setUploadingFileError('Incorrect column names. Please upload a different CSV.');
      else if (wrongFileFormat) setUploadingFileError('Invalid file type. Only CSV files are allowed.');
      else if (status === 400) setUploadingFileError(`Bad request: ${strippedError}`);
      else setUploadingFileError(strippedError || 'We encountered an error. Please try again.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const cancelPreview = () => {
    setPreview(null);
    component.selectFile();
  };

  if (isUploadingFile) {
    return (
      <div className="uploading-message-container">
        <h3>Uploading File...</h3>
      </div>
    );
  }

  if (uploadingFileError) {
    return (
      <div id="uploading-error-container" className="uploading-message-container">
        {
          guideURL
            ? <h3>{uploadingFileError} Please read <a href={guideURL} target="_blank" rel="noopener noreferrer">this guide</a> for uploading data.</h3>
            : <h3>{uploadingFileError}</h3>
        }
        <button
          type="button"
          onClick={clearError}
        >Try Again
        </button>
      </div>
    );
  }

  if (preview) {
    return (
      <div id={component.id} className="upload-item" key={component.id}>
        <p className="upload-item-name">{component.name}</p>
        <p id="file-selected">{component.file?.name}</p>
        <PreviewSummary
          preview={preview}
          onCancel={cancelPreview}
          onConfirm={doUpload}
          isUploading={isUploadingFile}
        />
      </div>
    );
  }

  return (
    <div id={component.id} className="upload-item" key={component.id}>
      <div className="upload-item-row">
        <div className="upload-item-info">
          <p className="upload-item-name">{component.name}</p>
          {component.file && <p id="file-selected">{component.file.name}</p>}
          {!component.file && successMessage[component.id] && (
            <p id="success-message">{successMessage[component.id]}</p>
          )}
        </div>
        <div className="upload-item-action">
          {component.file && component.uploadFile ? (
            <button
              id="upload-button"
              className="custom-file-upload"
              type="button"
              onClick={handlePreview}
              disabled={isPreviewing}
            >
              {/* eslint-disable-next-line no-nested-ternary */}
              {isPreviewing ? 'Checking…' : (component.previewFile ? 'Preview' : 'Upload File')}
            </button>
          ) : (
            <label htmlFor={`file-upload-${component.id}`} className="custom-file-upload">
              <input
                id={`file-upload-${component.id}`}
                type="file"
                accept={fileFormat}
                onChange={(e) => component.selectFile(e.target.files[0]) && clearSuccessMessage()}
              />
              Select File
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileInput;
