import React, { useState } from 'react';

import { FileInput } from '../../../../components/input-components';
import {
  previewCountySpotCsv,
  previewRangerDistrictSpotCsv,
  previewSurvey123UnsummarizedCsv,
  uploadCountySpotCsv,
  uploadRangerDistrictSpotCsv,
  uploadSurvey123UnsummarizedCsv,
} from '../../../../services/admin';

const FileUpload = (props) => {
  const { guideURL, onUploadComplete } = props;

  const [countySpotFile, setCountySpotFile] = useState();
  const [rdSpotFile, setRdSpotFile] = useState();
  const [unsummarizedFile, setUnsummarizedFile] = useState();

  const componentsToRender = [{
    file: countySpotFile,
    id: 'county-spot',
    name: 'Upload File for County Spot Data',
    selectFile: setCountySpotFile,
    previewFile: previewCountySpotCsv,
    uploadFile: uploadCountySpotCsv,
  }, {
    file: rdSpotFile,
    id: 'rd-spot',
    name: 'Upload File for Ranger District Spot Data',
    selectFile: setRdSpotFile,
    previewFile: previewRangerDistrictSpotCsv,
    uploadFile: uploadRangerDistrictSpotCsv,
  }, {
    file: unsummarizedFile,
    id: 'unsummarized',
    name: 'Upload File for Survey123 Unsummarized Data',
    selectFile: setUnsummarizedFile,
    previewFile: previewSurvey123UnsummarizedCsv,
    uploadFile: uploadSurvey123UnsummarizedCsv,
  }];

  return (
    <div className="admin-upload-list">
      {componentsToRender.map((component) => (
        <FileInput
          component={component}
          onResetFiles={() => component.selectFile()}
          onUploadComplete={onUploadComplete}
          guideURL={guideURL}
          key={component.id}
        />
      ))}
    </div>
  );
};

export default FileUpload;
