import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import axios from 'axios';

import './App.css';
import Navbar from './components/Navbar';
import Form from './components/Form';
import Logout from './components/Logout';
import UserStatus from './components/UserStatus';
import JoinForm from './components/JoinForm';
import Room from './components/Room';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {
        username: '',
        email: '',
        id: '',
        admin: '',
        active: '',
      },
      formData: {
        username: '',
        email: '',
        password: '',
      },
      roomInfo: {
        roomName: '',
        displayName: '',
        redirectToRoom: false,
      },
      isAuthenticated: false,
    };

    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.handleJoinFormChange = this.handleJoinFormChange.bind(this);
    this.handleJoinFormSubmit = this.handleJoinFormSubmit.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
  }

  // get a logedin user's info
  getUserStatus() {
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
          userInfo: {
            email: res.data.data.email,
            id: res.data.data.id,
            username: res.data.data.username,
            admin: res.data.data.admin.toString(),
            active: res.data.data.active.toString(),
          },
          roomInfo: { ...this.state.roomInfo, displayName: res.data.data.username }
        })
        console.log(res.data.data);
      })
      .catch((err) => { console.error(err); });
  }

  // clear all the state related to the form
  clearFormState() {
    this.setState({
      formData: { username: '', email: '', password: '' },
      username: '',
      email: ''
    });
  };

  // bind the form with state on '/register' and '/login'
  handleFormChange(event) {
    const newState = this.state.formData;
    newState[event.target.name] = event.target.value;
    this.setState(newState);
    // console.log(this.state.formData);
  }

  // bind the form with state on '/join'
  handleJoinFormChange(event) {
    const newState = this.state.roomInfo;
    newState[event.target.name] = event.target.value;
    this.setState(newState);
    // console.log(this.state.formData);
  }

  // handle submit on the form in '/register' and '/login'
  handleUserFormSubmit(event) {
    event.preventDefault();
    const formType = window.location.href.split('/').reverse()[0];
    let data = {
      email: this.state.formData.email,
      password: this.state.formData.password,
    };
    if (formType === 'register') {
      data.username = this.state.formData.username;
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`;
    axios.post(url, data).then((res) => {
      this.clearFormState();
      window.localStorage.setItem('authToken', res.data.auth_token);
      this.setState({ isAuthenticated: true });
      this.getUserStatus();
      console.log(res.data);
    }).catch((err) => {
      console.error(err);
    });
  }

  // handle the form on '/join'
  // set redirectToRoom to redirect to a room
  handleJoinFormSubmit(event) {
    event.preventDefault();

    const varifyUrl = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/v1/rooms/password/${this.state.roomName}`;
    axios.get(varifyUrl).then((res) => {
      if (res.status === 200) {
        if (res.data.data.hasPassword === false) {
          // no password is set
          const newState = this.state.roomInfo;
          newState.redirectToRoom = true;
          this.setState(newState);
        } else {
          // there is a password
          let password = window.prompt(`Enter the password for ${this.state.roomName}`);
          if (password === null) {
            return;
          }
          const loginUrl = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/v1/rooms/login/${this.state.roomName}`;
          axios.post(loginUrl, { password: password })
            .then((res) => {
              if (res.data.data.logedIn === true) {
                const newState = this.state.roomInfo;
                newState.redirectToRoom = true;
                this.setState(newState);
              } else {
                window.alert(`Wrong password for ${this.state.roomName}`);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
      else {
        window.alert(`Cannot join ${this.state.roomName}`);
      }
    })
  }

  // handle a user change current room's password
  handleChangePassword(password) {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/v1/rooms/password/${this.state.roomName}`;
    axios.post(url, { password: password })
      .catch((err) => {
        console.error(err);
      });
  }

  // when a user leaves a room, clear out the state used for '/join' route
  leaveRoom() {
    this.setState({
      roomInfo: {
        roomName: '',
        displayName: '',
        redirectToRoom: false,
      }
    });
  }

  // handle '/logout'
  logoutUser() {
    window.localStorage.clear();
    this.setState({
      isAuthenticated: false,
      userInfo: {
        username: '',
        email: '',
        id: '',
        admin: '',
        active: '',
      },
    });
  }

  render() {
    return (
      <div>
        <Navbar isAuthenticated={this.state.isAuthenticated} />
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-half">
                <br />
                <Switch>
                  <Route exact path='/' render={() => (
                    <JoinForm
                      isAuthenticated={this.state.isAuthenticated}
                      username={this.state.userInfo.username}
                      roomName={this.state.roomInfo.roomName}
                      displayName={this.state.roomInfo.displayName}
                      redirectToRoom={this.state.roomInfo.redirectToRoom}
                      handleJoinFormChange={this.handleJoinFormChange}
                      handleJoinFormSubmit={this.handleJoinFormSubmit}
                    />
                  )} />
                  <Route exact path='/register' render={() => (
                    <Form
                      formType={'Register'}
                      formData={this.state.formData}
                      handleUserFormSubmit={this.handleUserFormSubmit}
                      handleFormChange={this.handleFormChange}
                      isAuthenticated={this.state.isAuthenticated}
                    />
                  )} />
                  <Route exact path='/login' render={() => (
                    <Form
                      formType={'Login'}
                      formData={this.state.formData}
                      handleUserFormSubmit={this.handleUserFormSubmit}
                      handleFormChange={this.handleFormChange}
                      isAuthenticated={this.state.isAuthenticated}
                    />
                  )} />
                  <Route exact path='/logout' render={() => (
                    <Logout
                      logoutUser={this.logoutUser}
                    />
                  )} />
                  <Route exact path='/status' render={() => (
                    <UserStatus
                      isAuthenticated={this.state.isAuthenticated}
                      userInfo={this.state.userInfo}
                    />
                  )} />
                </Switch>
              </div>
            </div>
            <Switch>
              <Route exact path='/room' render={() =>
                (<Room
                  isAuthenticated={this.state.isAuthenticated}
                  roomName={this.state.roomInfo.roomName}
                  displayName={this.state.roomInfo.displayName}
                  handleChangePassword={this.handleChangePassword}
                  leaveRoom={this.leaveRoom}
                />)} />
            </Switch>
          </div>
        </section>
      </div >
    )
  }
};

export default App;