import React from 'react';
import { Link } from 'react-router-dom';

const UserStatus = (props) => {
  if (!props.isAuthenticated) {
    return (
      <p>You must be logged in to view this. Click<Link to="/login"> here </Link>to log back in.</p>
    )
  }
  return (
    <div>
      <ul>
        <li><strong>User ID:</strong> {props.userInfo.id}</li>
        <li><strong>Email:</strong> {props.userInfo.email}</li>
        <li><strong>Username:</strong> {props.userInfo.username}</li>
        <li><strong>Admin:</strong> {props.userInfo.admin}</li>
        <li><strong>Active:</strong> {props.userInfo.active}</li>
      </ul>
    </div>
  )
}

export default UserStatus;