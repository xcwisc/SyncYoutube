import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import axios from 'axios';

import './App.css';
import Home from './components/Home';
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
      title: 'SyncYoutube',
      users: [],
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
    // this.addUser = this.addUser.bind(this);
    // this.handleAddUserFormInput = this.handleAddUserFormInput.bind(this);
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.handleJoinFormChange = this.handleJoinFormChange.bind(this);
    this.handleJoinFormSubmit = this.handleJoinFormSubmit.bind(this);
  }

  componentDidMount() {
    // this.getUsers();
  }
  // get all the users and update the user list
  // getUsers() {
  //   axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
  //     .then((res) => { this.setState({ users: res.data.data.users }); })
  //     .catch((err) => { console.log(err); });
  // }

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
          }
        })
        console.log(res.data.data);
      })
      .catch((err) => { console.log(err); });
  }

  // clear all the state related to the form
  clearFormState() {
    this.setState({
      formData: { username: '', email: '', password: '' },
      username: '',
      email: ''
    });
  };

  // add a user at the home route
  // addUser(event) {
  //   event.preventDefault();
  //   const data = {
  //     username: this.state.username,
  //     email: this.state.email
  //   };
  //   axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
  //     .then((res) => {
  //       // update the userList
  //       this.getUsers();
  //       // clear out the form
  //       this.setState({ username: '', email: '' });
  //     })
  //     .catch((err) => console.log(err));
  // }

  // bind the form with state on the main route that add a user
  // handleAddUserFormInput(event) {
  //   const newState = {};
  //   newState[event.target.name] = event.target.value;
  //   this.setState(newState);
  // }

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
      console.log(err);
    });
  }

  handleJoinFormSubmit(event) {
    event.preventDefault();
    const newState = this.state.roomInfo;
    newState.redirectToRoom = true;
    this.setState(newState);
    // const url = `http://localhost:8080/api/v1/rooms/${this.state.roomName}`;
    // let confirmed;
    // axios.get(url).then((res) => {
    //   if (res.status === 404) {
    //     confirmed = window.confirm(`Do you want to create a room named ${this.state.roomName}?`);
    //   }
    //   else {
    //     confirmed = window.confirm(`Do you want to join room ${this.state.roomName} with ${res.data.data.len} other people?`);
    //   }

    //   if (confirmed) {
    //     const newState = this.state.roomInfo;
    //     newState.redirectToRoom = true;
    //     this.setState(newState);
    //   }
    // })
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
        <Navbar title={this.state.title}
          isAuthenticated={this.state.isAuthenticated} />
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-half">
                <br />
                <Switch>
                  <Route exact path='/' render={() => (
                    <Home isAuthenticated={this.state.isAuthenticated} />
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
                      isAuthenticated={this.state.isAuthenticated}
                    />
                  )} />
                  <Route exact path='/status' render={() => (
                    <UserStatus
                      isAuthenticated={this.state.isAuthenticated}
                      userInfo={this.state.userInfo}
                    />
                  )} />
                  <Route exact path='/join' render={() => (
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
                </Switch>
              </div>
            </div>
            <Switch>
              <Route exact path='/room' render={() =>
                (<Room
                  isAuthenticated={this.state.isAuthenticated}
                  roomName={this.state.roomInfo.roomName}
                  displayName={this.state.roomInfo.displayName}
                />)} />
            </Switch>
          </div>
        </section>
      </div >
    )
  }
};

export default App;