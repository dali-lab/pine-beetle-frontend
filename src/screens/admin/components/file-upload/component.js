import React from 'react';
import './style.scss';

const componentsToRender = [{
  name: 'Upload File for County Spot Data',
  id: 'county-spot',
  file: 'hi.exe',
  uploadfile: () => {},
}, {
  name: 'Upload File for Ranger District Spot Data',
  id: 'rd-spot',
  file: '',
  uploadfile: () => {},
}, {
  name: 'Upload File for Survey123 Unsummarized Data',
  id: 'unsummarized',
  file: '',
  uploadfile: () => {},
}];

const FileUpload = () => {
  return (
    <>
      {componentsToRender.map(component => (
        <div id={component.id}>
          <p>{component.name}</p>
          <p
            id="file-selected"
          >
            {component.file}
          </p>
          <button
            type="button"
            id="upload-button"
            className="animated-button"
            onClick={() => component.uploadfile()}
          >
            Upload File
          </button>
        </div>
      ))}
    </>
  );
};

export default FileUpload;
