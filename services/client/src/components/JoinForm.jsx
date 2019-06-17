import React from 'react';
import { Redirect } from 'react-router-dom';

const JoinForm = (props) => {
  if (!props.isAuthenticated) {
    return <Redirect to='/login' />
  }
  return (
    <div>
      <h1 className='title is-1'>Join a room</h1>
      <hr /><br />
      <form onSubmit={(event) => props.handleJoinFormSubmit(event)}>
        <div className='field'>
          <input
            name="roomName"
            className="input is-medium"
            type="text"
            placeholder="Enter a room to join"
            required
            value={props.roomName}
            onChange={props.handleJoinFormChange}
          />
        </div>
        <div className='field'>
          <input
            name="displayName"
            className="input is-medium"
            type="text"
            placeholder="Your name in the room"
            required
            value={props.displayName}
            onChange={props.handleJoinFormChange}
          />
        </div>
        <input
          type="submit"
          className="button is-primary is-medium is-fullwidth"
          value="Submit"
        />
      </form>
    </div>
  )
};

export default JoinForm;