import React from 'react';
import PropTypes from 'prop-types';

import Hoverable from './Hoverable';

const HistoryItem = (props) => {
  return (
    <Hoverable>
      {(isMouseInside, mouseEnter, mouseLeave) => (
        <div className="columns history-item"
          title="replay this video"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}>
          <div className="column is-3" onClick={(e) => props.handleClickHistory(props.videoId)}>
            <img
              src={`https://img.youtube.com/vi/${props.videoId}/mqdefault.jpg`}
              alt={props.videoTitle}></img>
          </div>
          <div className="column is-8" onClick={(e) => props.handleClickHistory(props.videoId)}>
            <h5 className="title is-5" style={{ marginBottom: "0px" }}>{props.videoTitle}</h5>
            <span className="history-video-author">{props.videoAuthor}</span>
          </div>
          <div className="colunm is-1">
            {isMouseInside &&
              <button
                className="delete"
                aria-label="close"
                onClick={(e) => props.handleDeleteHistory(e, props.historyIndex)}
                title="Delete this history">
              </button>
            }
          </div>
        </div>
      )}
    </Hoverable>
  )
}

HistoryItem.propTypes = {
  videoId: PropTypes.string.isRequired,
  videoTitle: PropTypes.string.isRequired,
  historyIndex: PropTypes.number.isRequired,
  handleDeleteHistory: PropTypes.func.isRequired,
  handleClickHistory: PropTypes.func.isRequired,
}

export default HistoryItem;