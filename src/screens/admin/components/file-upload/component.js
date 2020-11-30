import React, { useState } from 'react';

import {
  uploadCountySpotCsv,
  uploadRangerDistrictSpotCsv,
  uploadSurvey123UnsummarizedCsv,
} from '../../../../services/admin';

import './style.scss';

const FileUpload = () => {
  const [countySpotFile, setCountySpotFile] = useState();
  const [rdSpotFile, setRdCountySpotFile] = useState();
  const [unsummarizedFile, setUnsummarizedFile] = useState();

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadingFileError, setUploadingFileError] = useState('');

  const uploadFile = async (uploadFunction, file) => {
    setIsUploadingFile(true);

    try {
      await uploadFunction(file);
    } catch (err) {
      setUploadingFileError(err?.response?.data?.error?.message || '');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const componentsToRender = [{
    name: 'Upload File for County Spot Data',
    id: 'county-spot',
    file: countySpotFile,
    selectFile: setCountySpotFile,
    uploadFile: () => uploadFile(uploadCountySpotCsv, countySpotFile),
  }, {
    name: 'Upload File for Ranger District Spot Data',
    id: 'rd-spot',
    file: rdSpotFile,
    selectFile: setRdCountySpotFile,
    uploadFile: () => uploadFile(uploadRangerDistrictSpotCsv, rdSpotFile),
  }, {
    name: 'Upload File for Survey123 Unsummarized Data',
    id: 'unsummarized',
    file: unsummarizedFile,
    selectFile: setUnsummarizedFile,
    uploadFile: () => uploadFile(uploadSurvey123UnsummarizedCsv, unsummarizedFile),
  }];

  if (isUploadingFile) {
    return <p>Uploading...</p>;
  }

  if (uploadingFileError) {
    return (
      <div id="uploading-error">
        <p>{uploadingFileError}</p>
        <button
          type="button"
          onClick={() => setUploadingFileError('')}
        >Clear Error
        </button>
      </div>
    );
  }

  return (
    <>
      {componentsToRender.map(component => (
        <div id={component.id} key={component.id}>
          <p>{component.name}</p>
          <p
            id="file-selected"
          >
            {component.file ? component.file.name : ''}
          </p>
          {component.file ? (
            <button
              className="custom-file-upload"
              type="button"
              onClick={() => component.uploadFile()}
            >
              Upload File
            </button>
          ) : (
            <label htmlFor="file-upload" className="custom-file-upload">
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={e => component.selectFile(e.target.files[0])}
              />
              Select File
            </label>
          )}
        </div>
      ))}
    </>
  );
};

export default FileUpload;
