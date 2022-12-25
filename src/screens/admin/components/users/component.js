import React, { useState, useEffect } from 'react';

import { getAllAdminUsers } from '../../../../services/admin';

import './style.scss';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const allUsers = await getAllAdminUsers();

      setUsers(allUsers.map((user) => ({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
      })));
    })();
  }, []);

  return (
    <>
      <p id="users-title">Users</p>
      {users.map((user) => (
        <div id="user-info-container" key={user.email}>
          <p id="user-name">{user.name}</p>
          <p id="user-email">{user.email}</p>
        </div>
      ))}
    </>
  );
};

export default Users;
