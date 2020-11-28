import React from 'react';

import './style.scss';

// randomly generated example users, TODO: replace with actual users from db
const exampleUsers = [{
  name: 'Johnny Appleseed',
  email: 'jappleseed@email.com',
}, {
  name: 'Edmund Brehmer',
  email: 'EdmundMBrehmer@email.com',
}, {
  name: 'Floyd Weir',
  email: 'FloydSWeir@email.com',
}, {
  name: 'Barbara Donnell',
  email: 'BarbaraMODonnell@email.com',
}, {
  name: 'Barbara Donnell',
  email: 'BarbaraMODonnell@email.com',
}, {
  name: 'Barbara Donnell',
  email: 'BarbaraMODonnell@email.com',
}];

const Users = (_props) => {
  return (
    <>
      <p id="users-title">Users</p>
      {exampleUsers.map(user => (
        <div id="user-info-container">
          <p id="user-name">{user.name}</p>
          <p id="user-email">{user.email}</p>
        </div>
      ))}
    </>
  );
};

export default Users;
