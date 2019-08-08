import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => {
  let sendOrigin = "message";
  if (props.sendOrigin === 0) {
    sendOrigin += " system-send";
  } else if (props.sendOrigin === 1) {
    sendOrigin += " self-send";
  }
  return (
    <div className={sendOrigin}>
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
  sendOrigin: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired
}

export default Message;