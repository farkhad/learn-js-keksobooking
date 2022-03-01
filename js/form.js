import { sendData } from './api.js';
import { formatNumber } from './util.js';

const ERR_REQUIRED_FIELD = 'Пожалуйста, заполните это поле';
const ERR_LENGTHEN = 'Пожалуйста, удлините этот текст до {MIN_LEN} или {MAX_LEN} символов (в настоящее время вы используете {CUR_LEN} симв.).';
const ERR_PRICE_LOW = 'Значение должно быть больше или равно {MIN_PRICE}';
const ERR_PRICE_HIGH = 'Значение должно быть меньше или равно {MAX_PRICE}';

const Title = {
  MIN_LEN: 30,
  MAX_LEN: 100,
  MIN_LEN_PLACEHOLDER: '{MIN_LEN}',
  MAX_LEN_PLACEHOLDER: '{MAX_LEN}',
  CUR_LEN_PLACEHOLDER: '{CUR_LEN}',
};

const Price = {
  MIN: 0,
  MAX: 1000000,
  MIN_PLACEHOLDER: '{MIN_PRICE}',
  MAX_PLACEHOLDER: '{MAX_PRICE}',
};

const priceMap = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

const Capacity = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  NO_GUESTS: [0],
  ERR_CAPACITY: `1 комната — «для 1 гостя»;
  2 комнаты — «для 2 гостей» или «для 1 гостя»;
  3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»;
  100 комнат — «не для гостей»`,
};

const adForm = document.querySelector('.ad-form');
const titleField = adForm.querySelector('#title');
const housingTypeField = adForm.querySelector('#type');
const priceField = adForm.querySelector('#price');
const timeInField = adForm.querySelector('#timein');
const timeOutField = adForm.querySelector('#timeout');
const roomsField = adForm.querySelector('#room_number');
const guestsField = adForm.querySelector('#capacity');

let maxPrice = Price.MAX;
if (maxPrice > priceField.max) {
  maxPrice = priceField.max;
}

let minPrice = Price.MIN;
if (priceField.min < minPrice) {
  minPrice = priceField.min;
}

/**
 * Updates minimal price for relevant housing type
 */
const updateMinPrice = () => {
  minPrice = priceMap[housingTypeField.value];
  priceField.placeholder = formatNumber(minPrice);
  priceField.min = minPrice;
};

/**
 * Synchronizes Check In/Out fields
 *
 * @param HTMLSelectElement timeFieldChanged
 * @param HTMLSelectElement timeFieldToChange
 */
const syncTimeInOut = (timeFieldChanged = timeInField, timeFieldToChange = timeOutField) => {
  // HTMLOptionsCollection
  for (let timeToChangeOption of timeFieldToChange.options) {
    timeToChangeOption.selected = (timeFieldChanged.value === timeToChangeOption.value);
  }
};

/**
 * Checks whether Guests number is within limits for Rooms number
 *
 * @returns Boolean
 */
const checkCapacity = () => {
  const roomsNumber = Number(roomsField.options[roomsField.selectedIndex].value);
  const allowedCapacity = Capacity[roomsNumber] || Capacity.NO_GUESTS;
  const capacity = Number(guestsField.options[guestsField.selectedIndex].value);

  return allowedCapacity.includes(capacity);
};

/**
 * Returns error message for Number Of Guests field if exists
 *
 * @returns String
 */
const getCapacityErrorMessage = () => {
  return checkCapacity() ? '' : Capacity.ERR_CAPACITY;
};

/**
 * Returns error message for Title field if exists
 *
 * @returns String
 */
const getTitleErrorMessage = () => {
  const validity = titleField.validity;

  let errorMessage = '';

  if (validity.valueMissing) {
    errorMessage = ERR_REQUIRED_FIELD;
  } else if (validity.tooShort) {
    errorMessage = ERR_LENGTHEN
      .replace(Title.MIN_LEN_PLACEHOLDER, Title.MIN_LEN)
      .replace(Title.MAX_LEN_PLACEHOLDER, Title.MAX_LEN)
      .replace(Title.CUR_LEN_PLACEHOLDER, titleField.value.length);
  }

  return errorMessage;
};

/**
 * Returns error message for Price field if exists
 *
 * @returns String
 */
const getPriceErrorMessage = () => {
  const validity = priceField.validity;
  let errorMessage = '';

  if (validity.valueMissing) {
    errorMessage = ERR_REQUIRED_FIELD;
  } else if (validity.rangeUnderflow) {
    errorMessage = ERR_PRICE_LOW.replace(Price.MIN_PLACEHOLDER, formatNumber(minPrice));
  } else if (validity.rangeOverflow) {
    errorMessage = ERR_PRICE_HIGH.replace(Price.MAX_PLACEHOLDER, formatNumber(maxPrice));
  }

  return errorMessage;
};

const getCustomErrorMessage = (field) => {
  let errorMessage = '';

  switch (field) {
    case titleField:
      errorMessage = getTitleErrorMessage();
      break;

    case priceField:
      errorMessage = getPriceErrorMessage();
      break;

    case guestsField:
      errorMessage = getCapacityErrorMessage();
      break;

    default:
      errorMessage = 'unknown error';
  }

  return errorMessage;
};

const inputHandler = (evt) => evt.target.reportValidity();
const invalidHandler = (evt) => evt.target.setCustomValidity(getCustomErrorMessage(evt.target));

const titleInputHandler = inputHandler;
const titleInvalidHandler = invalidHandler;

/**
 * Callback for onChange event on housing type field
 */
const housingTypeChangeHandler = () => {
  updateMinPrice();
  priceField.reportValidity();
}

const priceInputHandler = inputHandler;
const priceInvalidHandler = invalidHandler;

/**
 * Callback for 'change' event of Rooms number field
 * Explicitly setting custom error message at 'change' event,
 * since guestField doesn't have validation rules present in HTML-tag
 */
const roomsChangeHandler = () => {
  guestsField.setCustomValidity(getCustomErrorMessage(guestsField));
  guestsField.reportValidity();
};
const guestsChangeHandler = () => {
  guestsField.setCustomValidity(getCustomErrorMessage(guestsField));
  guestsField.reportValidity();
};
const guestsInvalidHandler = invalidHandler;

/**
 * Callback for Check In field's onChange event
 */
const timeInChangeHandler = () => syncTimeInOut();

/**
 * Callback for Check Out field's onChange event
 */
const timeOutChangeHandler = () => syncTimeInOut(timeOutField, timeInField);

/**
 * Set Advertisement Form's event listeners
 */
const setAdFormListeners = () => {
  updateMinPrice();

  titleField.addEventListener('input', titleInputHandler);
  titleField.addEventListener('invalid', titleInvalidHandler);

  housingTypeField.addEventListener('change', housingTypeChangeHandler);
  priceField.addEventListener('input', priceInputHandler);
  priceField.addEventListener('invalid', priceInvalidHandler);

  roomsField.addEventListener('change', roomsChangeHandler);
  guestsField.addEventListener('change', guestsChangeHandler);
  guestsField.addEventListener('invalid', guestsInvalidHandler);

  timeInField.addEventListener('change', timeInChangeHandler);
  timeOutField.addEventListener('change', timeOutChangeHandler);
};

const setAdFormSubmit = (onSuccess, onError) => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendData(onSuccess, onError, new FormData(adForm));
  });
};

export { setAdFormSubmit, setAdFormListeners };
