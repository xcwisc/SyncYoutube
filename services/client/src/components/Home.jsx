import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const Home = (props) => {
  if (!props.isAuthenticated) {
    return <Redirect to='/login' />
  }
  return (
    <div>
      <h1 className="title is-1">About</h1>
      <hr /><br />
      <p>Add something relevant here.</p>
    </div>
  )
};

Home.prototype = {
  isAuthenticated: PropTypes.bool.isRequired
}
export default Home;