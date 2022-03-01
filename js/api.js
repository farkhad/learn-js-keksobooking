const GET_DATA_URL = 'https://23.javascript.pages.academy/keksobooking/data';
const SEND_DATA_URL = 'https://23.javascript.pages.academy/keksobooking';
const ERR_DATA_NOT_LOADED = 'Произошла ошибка. Объявления не были загружены.';

const getData = (onSuccess, onError) => fetch(GET_DATA_URL).then((response) => {
  if (response.ok) {
    return response.json();
  }
  onError(ERR_DATA_NOT_LOADED);
}).then((json) => onSuccess(json)).catch(() => onError(ERR_DATA_NOT_LOADED));

const sendData = (onSuccess, onError, body) => {
  fetch(SEND_DATA_URL, {
    method: 'POST',
    body,
  },
  ).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      onError();
    }
  }).catch(onError);
};

export { getData, sendData };
