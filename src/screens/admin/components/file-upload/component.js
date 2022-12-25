import React, { useState } from 'react';

import {
  uploadCountySpotCsv,
  uploadRangerDistrictSpotCsv,
  uploadSurvey123UnsummarizedCsv,
} from '../../../../services/admin';

import './style.scss';

const FileUpload = (props) => {
  const { guideURL } = props;

  const [countySpotFile, setCountySpotFile] = useState();
  const [rdSpotFile, setRdSpotFile] = useState();
  const [unsummarizedFile, setUnsummarizedFile] = useState();

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadingFileError, setUploadingFileError] = useState('');
  const [successMessage, setSuccessMessage] = useState({});

  const clearSuccessMessage = () => setSuccessMessage({});

  const clearError = () => {
    setUploadingFileError('');
    setCountySpotFile();
    setRdSpotFile();
    setUnsummarizedFile();
    setIsUploadingFile(false);
    setSuccessMessage({});
  };

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

      if (badColumnNames) setUploadingFileError('Incorrect column names. Please upload a different CSV.');
      else if (badRequest) setUploadingFileError(`Bad request: ${strippedError}`);
      else setUploadingFileError(strippedError || data?.error.toString() || 'We encountered an error. Please try again.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const componentsToRender = [{
    file: countySpotFile,
    id: 'county-spot',
    name: 'Upload File for County Spot Data',
    selectFile: setCountySpotFile,
    uploadFile: () => uploadFile(uploadCountySpotCsv, countySpotFile, setCountySpotFile, 'county-spot'),
  }, {
    file: rdSpotFile,
    id: 'rd-spot',
    name: 'Upload File for Ranger District Spot Data',
    selectFile: setRdSpotFile,
    uploadFile: () => uploadFile(uploadRangerDistrictSpotCsv, rdSpotFile, setRdSpotFile, 'rd-spot'),
  }, {
    file: unsummarizedFile,
    id: 'unsummarized',
    name: 'Upload File for Survey123 Unsummarized Data',
    selectFile: setUnsummarizedFile,
    uploadFile: () => uploadFile(uploadSurvey123UnsummarizedCsv, unsummarizedFile, setUnsummarizedFile, 'unsummarized'),
  }];

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
        <h3>{uploadingFileError} Please read <a href={guideURL} target="_blank" rel="noopener noreferrer">this guide</a> for uploading data.</h3>
        <button
          type="button"
          onClick={clearError}
        >Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {componentsToRender.map((component) => (
        <div id={component.id} key={component.id}>
          <p>{component.name}</p>
          <p id="file-selected">
            {component.file ? component.file.name : ''}
          </p>
          {component.file ? (
            <button
              id="upload-button"
              className="custom-file-upload"
              type="button"
              onClick={component.uploadFile}
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
                  accept=".csv"
                  onChange={(e) => component.selectFile(e.target.files[0]) && clearSuccessMessage()}
                />
                Select File
              </label>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default FileUpload;
