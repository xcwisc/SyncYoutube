import React from 'react';

const Modal = (props) => {
  return (
    <span style={{ float: 'right' }}>
      <button className="button is-dark" onClick={(e) => handleModalBtnClick(e)}>People in the room</button>
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

// var rootEl = document.documentElement;
// var $modals = getAll('.modal');
// var $modalButtons = getAll('.modal-button');
// var $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

// if ($modalButtons.length > 0) {
//   $modalButtons.forEach(function ($el) {
//     $el.addEventListener('click', function () {
//       var target = $el.dataset.target;
//       openModal(target);
//     });
//   });
// }

// if ($modalCloses.length > 0) {
//   $modalCloses.forEach(function ($el) {
//     $el.addEventListener('click', function () {
//       closeModals();
//     });
//   });
// }

// function openModal(target) {
//   var $target = document.getElementById(target);
//   rootEl.classList.add('is-clipped');
//   $target.classList.add('is-active');
// }

// function closeModals() {
//   rootEl.classList.remove('is-clipped');
//   $modals.forEach(function ($el) {
//     $el.classList.remove('is-active');
//   });
// }

// document.addEventListener('keydown', function (event) {
//   var e = event || window.event;
//   if (e.keyCode === 27) {
//     closeModals();
//     closeDropdowns();
//   }
// });

export default Modal;