import React from 'react';
import { Redirect, Link } from 'react-router-dom';

const Form = (props) => {
  if (props.isAuthenticated) {
    return <Redirect to='/' />
  }
  return (
    <div>
      <h1 className='title is-1'>{props.formType}</h1>
      <hr /><br />
      <form onSubmit={(event) => props.handleUserFormSubmit(event)}>
        {props.formType === 'Register' &&
          <div className="field">
            <input
              name="username"
              className="input is-medium"
              type="text"
              placeholder="Enter a username"
              required
              value={props.formData.username}
              onChange={props.handleFormChange}
            />
          </div>
        }
        <div className="field">
          <input
            name="email"
            className="input is-medium"
            type="text"
            placeholder="Enter your email"
            required
            value={props.formData.email}
            onChange={props.handleFormChange}
          />
        </div>
        <div className="field">
          <input
            name="password"
            className="input is-medium"
            type="text"
            placeholder="Enter your password"
            required
            value={props.formData.password}
            onChange={props.handleFormChange}
          />
        </div>
        <input
          type="submit"
          className="button is-dark is-medium is-fullwidth"
          value="Submit"
        />
        <div className="field">
          <br />
          {props.formType === 'Register' &&
            <p>Already have an account? Click <Link to="/login">here</Link> to log in.</p>
          }
          {props.formType === 'Login' &&
            <p>Don't have an account? Click <Link to="/register">here</Link> to register.</p>
          }
        </div>
      </form>
    </div>
  )
}

export default Form;