import React, { useState } from 'react';

import './style.scss';

const FileInput = (props) => {
  const {
    guideURL, component, onResetFiles, fileFormat = '.csv',
  } = props;

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadingFileError, setUploadingFileError] = useState('');
  const [successMessage, setSuccessMessage] = useState({});

  const clearSuccessMessage = () => setSuccessMessage({});

  const clearError = () => {
    setUploadingFileError('');
    onResetFiles();
    setIsUploadingFile(false);
    setSuccessMessage({});
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

  /**
   * @description uploads given file
   * @param {Function} uploadFunction function to upload file
   * @param {File} file file object
   * @param {Function} clearFile function to clear the file
   * @param {String} id file id
   */
  const uploadFile = async (uploadFunction, file, clearFile, id) => {
    setIsUploadingFile(true);

    try {
      await uploadFunction(file);
      clearFile();
      setSuccessMessage({ [id]: 'Successfully uploaded file' });
      setTimeout(clearSuccessMessage, 1000 * 7);
    } catch (err) {
      const { data, status } = err?.response || {};

      const strippedError = data?.error.toString().replace('Error: ', '');

      const badRequest = status === 400;
      const badColumnNames = strippedError.includes('missing fields in csv');
      const wrongFileFormat = strippedError.includes('Invalid file type');

      if (badColumnNames) setUploadingFileError('Incorrect column names. Please upload a different CSV.');
      else if (wrongFileFormat) setUploadingFileError('Invalid file type. Only PNG, JPG, and JPEG files are allowed! Please, choose a different file.');
      else if (badRequest) setUploadingFileError(`Bad request: ${strippedError}`);
      else setUploadingFileError(strippedError || data?.error.toString() || 'We encountered an error. Please try again.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  return (
    <div id={component.id} key={component.id}>
      <p>{component.name}</p>
      <p id="file-selected">
        {component.file ? component.file.name : ''}
      </p>
      {component.file && component.uploadFile ? (
        <button
          id="upload-button"
          className="custom-file-upload"
          type="button"
          onClick={() => uploadFile(
            component.uploadFile,
            component.file,
            component.selectFile,
            component.id,
          )}
        >
          Upload File
        </button>
      ) : (
        <>
          {successMessage[component.id] && (
          <p id="success-message">{successMessage[component.id]}</p>
          )}
          <label htmlFor={`file-upload-${component.id}`} className="custom-file-upload">
            <input
              id={`file-upload-${component.id}`}
              type="file"
              accept={fileFormat}
              onChange={(e) => component.selectFile(e.target.files[0]) && clearSuccessMessage()}
            />
            Select File
          </label>
        </>
      )}
    </div>
  );
};

export default FileInput;
