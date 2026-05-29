import React, { useState } from 'react';

import DeleteModal from '../delete-modal';
import trashCan from '../../../../assets/icons/trash-can.png';
import { deleteAdminUser } from '../../../../services/admin';

import './style.scss';

const Users = ({ users, setUsers, activeUser }) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async (userId) => {
    const response = await deleteAdminUser(userId);

    if (response?.status === 200) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    }

    setSelectedUser({});
  };

  const onClickDeleteButton = (user) => {
    setShowDeleteModal(true);
    setSelectedUser(user);
  };

  return (
    <>
      <h3 id="users-title">Existing users</h3>
      {users.map((user) => {
        const isActiveUser = activeUser.email === user.email;
        return (
          <div id="user-info-container" key={user.email}>
            <div>
              <p id="user-name">{user.name}</p>
              <p id="user-email">{user.email}</p>
            </div>
            {!isActiveUser && (
            <button type="button" className="animated-button delete-user-button" onClick={() => onClickDeleteButton(user)}>
              <img
                src={trashCan}
                alt="trash can icon"
              />
            </button>
            )}
          </div>
        );
      })}
      <DeleteModal
        handleDelete={() => handleDelete(selectedUser.id)}
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        title={selectedUser.name}
      />
    </>
  );
};

export default Users;
