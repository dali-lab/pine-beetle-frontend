import React, { useState } from 'react';
import Modal from 'react-modal';
import './style.scss';

const downloadIcon = require('../../../../assets/icons/download.png');

// const customStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)',
//     // margin: '44px 11px 111px 255px',
//     padding: '33px 32px 10.4px 34px',
//     borderRadius: '20px',
//     backgroundColor: '#ffffff',
//   },
// };

const DownloadTrapping = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div id="download-button-container">
        <button
          onClick={handleShow}
          type="button"
          id="download-button"
        >
          <img
            src={downloadIcon}
            alt="download icon"
          />
          <p>Download Data</p>
        </button>
      </div>

      <Modal
        isOpen={show}
        onAfterOpen={handleShow}
        onRequestClose={handleClose}
        // style={customStyles}
        contentLabel="Download Data Modal"
        className="modal"
      >
        <h2>Hello</h2>
        <div>I am a modal</div>
      </Modal>
    </>
  );
};

export default DownloadTrapping;
