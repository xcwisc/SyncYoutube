import React from 'react';
import PropTypes from 'prop-types';

const Modal = (props) => {
  return (
    <span style={{ float: 'right' }}>
      <button className="button is-link is-outlined" onClick={(e) => handleModalBtnClick(e)}>People in the room</button>
      <div className="modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">People in the room</p>
            <button className="delete" aria-label="close" onClick={(e) => handleModalCloseBtnClick(e)}></button>
          </header>
          <section className="modal-card-body">
            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th><abbr title="Position">Pos</abbr></th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {
                  props.userList.map((user, index) => {
                    return (
                      <tr key={index}>
                        <th>{index + 1}</th>
                        <td>{user.displayName}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </span>
  )
}

const handleModalBtnClick = (e) => {
  const modal = document.querySelector('.modal');
  const rootEl = document.documentElement;
  rootEl.classList.add('is-clipped');
  modal.classList.add("is-active");
}

const handleModalCloseBtnClick = (e) => {
  const modal = document.querySelector('.modal');
  const rootEl = document.documentElement;
  rootEl.classList.remove('is-clipped');
  modal.classList.remove("is-active");
}

Modal.prototype = {
  userList: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string
  })).isRequired
}
export default Modal;