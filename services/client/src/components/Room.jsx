import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import io from 'socket.io-client';

class Logout extends Component {
  componentDidMount() {
    this.makeSocketConnection();
  };

  makeSocketConnection() {
    const nsp = io('/sync');
    nsp.on('connect_failed', () => {
      console.log('Connection Failed');
    });
    nsp.on('connect', () => {
      console.log('Connected');
    });
    nsp.on('disconnect', () => {
      console.log('Disconnected');
    });
    // nsp.emit('join room', this.props.roomName);
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/login' />
    }
    return (
      <div>
        <p>You are now logged out. Click <Link to="/login">here</Link> to log back in.</p>
      </div>
    )
  };
}

export default Logout;