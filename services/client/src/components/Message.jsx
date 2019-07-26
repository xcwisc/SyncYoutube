import React from 'react';

const Message = (props) => {
  return (
    <div className="message">
      <div className="content">
        <strong>{props.displayName}</strong><span>  </span>
        <span className="icon is-small"><i className={`fas fa-${props.emoji}`}></i></span>
      </div>
      {props.message}
    </div>
  )
}

export default Message;