import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import UsersList from './components/UsersList';
import AddUser from './components/AddUser';

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      username: '',
      email: ''
    };
    this.addUser = this.addUser.bind(this);
    this.handleAddUserFormInput = this.handleAddUserFormInput.bind(this);
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => { this.setState({ users: res.data.data.users }); })
      .catch((err) => { console.log(err); });
  }

  addUser(event) {
    event.preventDefault();
    const data = {
      username: this.state.username,
      email: this.state.email
    };
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then((res) => {
        // update the userList
        this.getUsers();
        // clear out the form
        this.setState({ username: '', email: '' });
      })
      .catch((err) => console.log(err));
  }

  handleAddUserFormInput(event) {
    const newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-half">
              <br />
              <h1 className="title is-1">All Users</h1>
              <hr /><br />
              <AddUser
                addUser={this.addUser}
                handleAddUserFormInput={this.handleAddUserFormInput}
                username={this.username}
                email={this.email}
              />
              <br /><br />
              <UsersList users={this.state.users} />
            </div>
          </div>
        </div>
      </section>
    )
  }
};

ReactDOM.render(<App />, document.getElementById('root'));

