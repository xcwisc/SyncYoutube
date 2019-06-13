import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class UserStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      id: '',
      admin: '',
      active: ''
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.getUserStatus();
    }
  }

  getUserStatus(event) {
    const option = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    }
    return axios(option)
      .then((res) => {
        this.setState({
          email: res.data.data.email,
          id: res.data.data.id,
          username: res.data.data.username,
          admin: res.data.data.admin.toString(),
          active: res.data.data.active.toString(),
        })
        console.log(res.data.data);
      })
      .catch((err) => { console.log(err); });
  }

  render() {
    if (!this.props.isAuthenticated) {
      return (
        <p>You must be logged in to view this. Click<Link to="/login"> here </Link>to log back in.</p>
      )
    }
    return (
      <div>
        <ul>
          <li><strong>User ID:</strong> {this.state.id}</li>
          <li><strong>Email:</strong> {this.state.email}</li>
          <li><strong>Username:</strong> {this.state.username}</li>
          <li><strong>Admin:</strong> {this.state.admin}</li>
          <li><strong>Active:</strong> {this.state.active}</li>
        </ul>
      </div>
    )
  }
}

export default UserStatus;