import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import io from 'socket.io-client';

class Logout extends Component {
  componentDidMount() {
    this.makeSocketConnection();
  };

  makeSocketConnection() {
    const socket = io();
    socket.on('connect_failed', () => {
      console.log('Connection Failed');
    });
    socket.on('connect', () => {
      console.log('Connected');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });
    // socket.emit('join room', this.props.roomName);
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