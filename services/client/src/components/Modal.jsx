import React from 'react';
import PropTypes from 'prop-types';

const Modal = (props) => {
  return (
    <span>
      {props.modalId === 'history' ?
        <button className="button is-link is-outlined"
          title="Watch History"
          onClick={(e) => handleModalBtnClick(e, props.modalId)}
          style={{ width: "14%" }}>
          <span className="icon is-small">
            <i className="fas fa-history"></i>
          </span>
        </button> :
        <button className="button is-link is-outlined"
          onClick={(e) => handleModalBtnClick(e, props.modalId)}
          style={{ float: 'right' }}>{props.modalTitle}
        </button>
      }

      <div className="modal" id={props.modalId}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <strong className="modal-card-title">{props.modalTitle}</strong>
            <button className="delete" aria-label="close" onClick={(e) => handleModalCloseBtnClick(e, props.modalId)}></button>
          </header>
          <section className="modal-card-body">
            {props.children}
          </section>
        </div>
      </div>
    </span>
  )
}

const handleModalBtnClick = (e, modalId) => {
  const modal = document.querySelector(`.modal#${modalId}`);
  const rootEl = document.documentElement;
  rootEl.classList.add('is-clipped');
  modal.classList.add("is-active");
}

const handleModalCloseBtnClick = (e, modalId) => {
  const modal = document.querySelector(`.modal#${modalId}`);
  const rootEl = document.documentElement;
  rootEl.classList.remove('is-clipped');
  modal.classList.remove("is-active");
}

Modal.prototype = {
  modalId: PropTypes.string.isRequired,
  modalTitle: PropTypes.string,
}
export default Modal;