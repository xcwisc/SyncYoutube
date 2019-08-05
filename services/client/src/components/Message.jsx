import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => {
  return (
    <div className={props.selfSend ? "message self-send" : "message"}>
      <div className="content">
        <strong>{props.displayName}</strong><span>  </span>
        <span className="icon is-small"><i className={`fas fa-${props.emoji}`}></i></span>
      </div>
      {props.message}
    </div>
  )
}

Message.propTypes = {
  displayName: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired,
  selfSend: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
}

export default Message;