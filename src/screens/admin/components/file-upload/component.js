/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './style.scss';

const FileUpload = () => {
  const [countySpotFile, setCountySpotFile] = useState([]);
  const [rdSpotFile, setRdCountySpotFile] = useState([]);
  const [unsummarizedFile, setUnsummarizedFile] = useState([]);

  const componentsToRender = [{
    name: 'Upload File for County Spot Data',
    id: 'county-spot',
    file: countySpotFile,
    uploadFile: (file) => { setCountySpotFile(file); },
  }, {
    name: 'Upload File for Ranger District Spot Data',
    id: 'rd-spot',
    file: rdSpotFile,
    uploadFile: (file) => { setRdCountySpotFile(file); },
  }, {
    name: 'Upload File for Survey123 Unsummarized Data',
    id: 'unsummarized',
    file: unsummarizedFile,
    uploadFile: (file) => { setUnsummarizedFile(file); },
  }];

  useEffect(() => {
    console.log(countySpotFile, rdSpotFile, unsummarizedFile);
  }, [countySpotFile, rdSpotFile, unsummarizedFile]);

  return (
    <>
      {componentsToRender.map(component => (
        <div id={component.id}>
          <p>{component.name}</p>
          <p
            id="file-selected"
          >
            {component.file[0] ? component.file[0].name : ''}
          </p>
          <label htmlFor="file-upload" className="custom-file-upload">
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              // eslint-disable-next-line arrow-parens
              onChange={(e) => component.uploadFile(e.target.files)}
            />
            File Upload
          </label>
        </div>
      ))}
    </>
  );
};

export default FileUpload;
