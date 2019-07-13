import React from 'react';

const Message = (props) => {
  return (
    <article className="media" style={{ WebkitTransform: "rotate(180deg)" }}>
      <div className="media-content">
        <div className="content">
          <p>
            <strong>{props.displayName}</strong>
            <span className="icon is-small"><i className="fas fa-heart"></i></span>
            <br />
            {props.message}
          </p>
        </div>
      </div>
      <div className="media-right">
        <button className="delete"></button>
      </div>
    </article>
  )
}

export default Message;