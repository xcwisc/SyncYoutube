import React from 'react';
import PropTypes from 'prop-types';

const HistoryItem = (props) => {
  return (
    <div className="container">
      <div className="columns">
        <div className="column is-2">
          <img
            src={`https://img.youtube.com/vi/${props.videoId}/mqdefault.jpg`}
            alt={props.videoTitle}></img>
        </div>
        <div className="column is-4">
          <h4 className="title is-4 video-title">{props.videoTitle}</h4>
        </div>
      </div>
    </div>
  )
}

HistoryItem.propTypes = {
  videoId: PropTypes.string.isRequired,
  videoTitle: PropTypes.string.isRequired,
}

export default HistoryItem;