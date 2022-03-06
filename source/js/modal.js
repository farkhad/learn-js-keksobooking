import { isEscEvent } from './util.js';

const ModalType = {
  SUCCESS: 'success',
  ERROR: 'error',
};

let currentModal;

const modalKeydownHandler = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

const modalClickHandler = () => closeModal();

const openModal = (modalType = ModalType.SUCCESS) => {
  const modal = document.querySelector(`#${modalType}`).content
    .querySelector(`.${modalType}`).cloneNode(true);

  document.body.appendChild(modal);

  currentModal = modal;

  document.addEventListener('keydown', modalKeydownHandler);
  document.addEventListener('click', modalClickHandler);

  if (modalType === ModalType.ERROR) {
    modal.querySelector(`.${modalType}__button`).addEventListener('click', modalClickHandler);
  }
}

const closeModal = () => {
  if (currentModal.className === ModalType.ERROR) {
    currentModal.querySelector(`.${ModalType.ERROR}__button`).removeEventListener('click', modalClickHandler);
  }
  currentModal.remove();

  document.removeEventListener('keydown', modalKeydownHandler);
  document.removeEventListener('click', modalClickHandler);
};

const openModalSuccess = () => openModal(ModalType.SUCCESS);
const openModalError = () => openModal(ModalType.ERROR);

export { openModalSuccess, openModalError };
