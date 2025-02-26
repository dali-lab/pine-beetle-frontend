import React, { useState, useEffect } from 'react';

import DeleteModal from '../delete-modal';
import trashCan from '../../../../assets/icons/trash-can.png';
import { deleteAdminUser, getAllAdminUsers } from '../../../../services/admin';

import './style.scss';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    (async () => {
      const allUsers = await getAllAdminUsers();

      setUsers(allUsers.map((user) => ({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        id: user._id,
      })));
    })();
  }, [selectedUser]);

  const handleDelete = async (userId) => {
    await deleteAdminUser(userId);
    setSelectedUser({});
  };

  const onClickDeleteButton = (user) => {
    setShowDeleteModal(true);
    setSelectedUser(user);
  };

  return (
    <>
      <p id="users-title">Users</p>
      {users.map((user) => (
        <div id="user-info-container" key={user.email}>
          <div>
            <p id="user-name">{user.name}</p>
            <p id="user-email">{user.email}</p>
          </div>
          <button type="button" className="animated-button delete-user-button" onClick={() => onClickDeleteButton(user)}>
            <img
              src={trashCan}
              alt="trash can icon"
            />
          </button>
        </div>
      ))}
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
