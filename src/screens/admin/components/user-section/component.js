import React, { useEffect, useState } from 'react';
import Users from '../users';
import AddUser from '../add-user';
import { getAllAdminUsers } from '../../../../services/admin';

const UserSection = ({ activeUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllAdminUsers();
      setUsers(allUsers.map((user) => ({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        id: user._id,
      })));
    };

    fetchUsers();
  }, []);

  return (
    <div id="user-container">
      <div id="users-container">
        <Users users={users} setUsers={setUsers} activeUser={activeUser} />
      </div>
      <div id="add-users">
        <AddUser setUsers={setUsers} />
      </div>
    </div>
  );
};

export default UserSection;
