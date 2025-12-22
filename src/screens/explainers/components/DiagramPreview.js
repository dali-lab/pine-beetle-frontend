import React from 'react';

const DiagramPreview = () => (
  <div className="preview-visual diagram-preview-visual">
    <div className="flowchart">
      <div className="flow-box input-box">INPUT</div>
      <div className="flow-connector" />
      <div className="flow-row">
        <div className="flow-box process-box">PROCESS</div>
        <div className="flow-box process-box">ANALYZE</div>
      </div>
      <div className="flow-connector" />
      <div className="flow-box output-box">OUTPUT</div>
    </div>
  </div>
);

export default DiagramPreview;
