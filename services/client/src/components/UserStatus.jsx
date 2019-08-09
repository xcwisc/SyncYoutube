import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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

UserStatus.prototype = {
  isAuthenticated: PropTypes.bool.isRequired,
  userInfo: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    admin: PropTypes.string.isRequired,
    active: PropTypes.string.isRequired
  }).isRequired
}
export default UserStatus;