import React, { useState } from 'react';

import { FileInput } from '../../../../components/input-components';
import {
  uploadCountySpotCsv,
  uploadRangerDistrictSpotCsv,
  uploadSurvey123UnsummarizedCsv,
} from '../../../../services/admin';

const FileUpload = (props) => {
  const { guideURL } = props;

  const [countySpotFile, setCountySpotFile] = useState();
  const [rdSpotFile, setRdSpotFile] = useState();
  const [unsummarizedFile, setUnsummarizedFile] = useState();

  const componentsToRender = [{
    file: countySpotFile,
    id: 'county-spot',
    name: 'Upload File for County Spot Data',
    selectFile: setCountySpotFile,
    uploadFile: uploadCountySpotCsv,
  }, {
    file: rdSpotFile,
    id: 'rd-spot',
    name: 'Upload File for Ranger District Spot Data',
    selectFile: setRdSpotFile,
    uploadFile: uploadRangerDistrictSpotCsv,
  }, {
    file: unsummarizedFile,
    id: 'unsummarized',
    name: 'Upload File for Survey123 Unsummarized Data',
    selectFile: setUnsummarizedFile,
    uploadFile: uploadSurvey123UnsummarizedCsv,
  }];

  return (
    <>
      {componentsToRender.map((component) => (
        <FileInput
          component={component}
          onResetFiles={() => component.selectFile()}
          guideURL={guideURL}
          key={component.id}

        />
      ))}
    </>
  );
};

export default FileUpload;
