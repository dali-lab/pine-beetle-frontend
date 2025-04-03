import React from 'react';
import Modal from 'react-modal';

import './style.scss';

const DeleteModal = ({
  handleDelete, isOpen, setIsOpen, title,
}) => {
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const onClickDelete = async () => {
    handleDelete();
    handleClose();
  };

  return (
    <Modal isOpen={isOpen}
      onAfterOpen={handleOpen}
      onRequestClose={handleClose}
      className="delete-modal"
      ariaHideApp={false}
    >
      <div>
        Are you sure you want to delete <span className="delete-modal__item-title">{title}</span>?
        <div className="delete-modal-buttons">
          <button type="button" className="single-button animated-button" onClick={onClickDelete}>Yes</button>
          <button type="button" className="single-button animated-button" onClick={handleClose}>No</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
