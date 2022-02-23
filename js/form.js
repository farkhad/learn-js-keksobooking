import { formatNumber } from './util.js';

const THOUSANDS_SEPARATOR = ' ';

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
  priceField.placeholder = formatNumber(minPrice, THOUSANDS_SEPARATOR);
  priceField.min = minPrice;
  priceField.checkValidity();
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
 * Callback for Check In field's onChange event
 */
const timeInChangeHandler = () => syncTimeInOut();

/**
 * Callback for Check Out field's onChange event
 */
const timeOutChangeHandler = () => syncTimeInOut(timeOutField, timeInField);

/**
 * Callback for onChange event on housing type field
 */
const housingTypeChangeHandler = () => {
  updateMinPrice();
  triggerValidation(priceField);
}

/**
 * Triggers 'invalid' event on element
 *
 * @param HTMLElement element
 */
const triggerValidation = (element) => {
  element.setCustomValidity('');
  element.reportValidity();
}

/**
 * Triggers 'invalid' event on Guests field.
 * Sets error message at domcontentloaded w/o reporting to user.
 *
 * @param Boolean reportValidity
 */
const triggerCapacityValidation = (reportValidity = true) => {
  guestsField.setCustomValidity(Capacity.ERR_CAPACITY);

  if (reportValidity) {
    guestsField.reportValidity();
  }
};

const validateCapacity = () => {
  const roomsNumber = Number(roomsField.options[roomsField.selectedIndex].value);
  const allowedCapacity = Capacity[roomsNumber] || Capacity.NO_GUESTS;
  const capacity = Number(guestsField.options[guestsField.selectedIndex].value);

  if (!allowedCapacity.includes(capacity)) {
    guestsField.setCustomValidity(Capacity.ERR_CAPACITY);
  } else {
    guestsField.setCustomValidity('');
  }
};

/**
 * Callback for onChange event of Rooms number field
 */
const roomsChangeHandler = () => triggerCapacityValidation();
const roomsInvalidHandler = () => validateCapacity();

const guestsChangeHandler = () => triggerCapacityValidation();
const guestsInvalidHandler = () => validateCapacity();

/**
 * Validates advertisement's title
 */
const validateTitle = () => {
  const titleLen = titleField.value.length;

  if (titleField.validity.valueMissing) {
    titleField.setCustomValidity(ERR_REQUIRED_FIELD);
  } else if (titleLen < Title.MIN_LEN) {
    titleField.setCustomValidity(ERR_LENGTHEN
      .replace(Title.MIN_LEN_PLACEHOLDER, Title.MIN_LEN)
      .replace(Title.MAX_LEN_PLACEHOLDER, Title.MAX_LEN)
      .replace(Title.CUR_LEN_PLACEHOLDER, titleLen));
  }
};

const titleInputHandler = () => triggerValidation(titleField);
const titleInvalidHandler = () => validateTitle();

/**
 * Validates advertisement's price
 */
const validatePrice = () => {
  let price = Number(priceField.value);

  if (priceField.validity.valueMissing) {
    priceField.setCustomValidity(ERR_REQUIRED_FIELD);
  } else if (price < minPrice) {
    priceField.setCustomValidity(ERR_PRICE_LOW.replace(Price.MIN_PLACEHOLDER, minPrice));
  } else if (price > maxPrice) {
    priceField.setCustomValidity(ERR_PRICE_HIGH.replace(Price.MAX_PLACEHOLDER, formatNumber(maxPrice, THOUSANDS_SEPARATOR)));
  }
};

const priceInputHandler = () => triggerValidation(priceField);
const priceInvalidHandler = () => validatePrice();

/**
 * Callback function for DOMContentLoaded event
 */
const contentLoadHandler = () => {
  updateMinPrice();

  housingTypeField.addEventListener('change', housingTypeChangeHandler);
  timeInField.addEventListener('change', timeInChangeHandler);
  timeOutField.addEventListener('change', timeOutChangeHandler);

  roomsField.addEventListener('change', roomsChangeHandler);
  roomsField.addEventListener('invalid', roomsInvalidHandler);

  guestsField.addEventListener('change', guestsChangeHandler);
  guestsField.addEventListener('invalid', guestsInvalidHandler);

  titleField.addEventListener('input', titleInputHandler);
  titleField.addEventListener('invalid', titleInvalidHandler);

  priceField.addEventListener('input', priceInputHandler);
  priceField.addEventListener('invalid', priceInvalidHandler);

  triggerCapacityValidation(false);
};

document.addEventListener('DOMContentLoaded', contentLoadHandler);
