import { formatNumber } from './util.js';

const THOUSANDS_SEPARATOR = ' ';
const MAX_PRICE = 1000000;

const priceMap = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

const adForm = document.querySelector('.ad-form');
const housingTypeField = adForm.querySelector('#type');
const priceField = adForm.querySelector('#price');
const timeInField = adForm.querySelector('#timein');
const timeOutField = adForm.querySelector('#timeout');

let minPrice = 0;

/**
 * Updates minimal price for relevant housing type
 */
const updateMinPrice = () => {
  minPrice = priceMap[housingTypeField.value];
  priceField.placeholder = formatNumber(minPrice, THOUSANDS_SEPARATOR);
};

/**
 * Checks whether price is in range
 *
 * @returns Boolean
 */
const isPriceValid = () => {
  let price = Number(priceField.value);
  return price >= minPrice && price <= MAX_PRICE;
}

/**
 * Synchronizes Check In/Out fields
 *
 * @param HTMLSelectElement timeFieldChanged
 * @param HTMLSelectElement timeFieldToChange
 */
const syncTimeInOut = (timeFieldChanged = timeInField, timeFieldToChange = timeOutField) => {
  // HTMLOptionsCollection
  for (let i = 0; i < timeFieldToChange.options.length; i++) {
    let timeToChangeOption = timeFieldToChange.options[i];
    timeToChangeOption.selected = (timeFieldChanged.value === timeToChangeOption.value);
  }
};

/**
 * Callback function for Check In field's onChange event
 */
const timeInChangeHandler = () => syncTimeInOut();

/**
 * Callback function for Check Out field's onChange event
 */
const timeOutChangeHandler = () => syncTimeInOut(timeOutField, timeInField);

/**
 * Callback function for onChange event on housing type field
 */
const housingTypeChangeHandler = () => updateMinPrice();

/**
 * Callback function for DOMContentLoaded event
 */
const contentLoadHandler = () => updateMinPrice();

/**
 * Callback function for onSubmit event of the form
 *
 * @param Object evt
 * @returns Boolean
 */
const formSubmitHandler = (evt) => {
  evt.preventDefault();
  return isPriceValid();
};

document.addEventListener('DOMContentLoaded', contentLoadHandler);
housingTypeField.addEventListener('change', housingTypeChangeHandler);
timeInField.addEventListener('change', timeInChangeHandler);
timeOutField.addEventListener('change', timeOutChangeHandler);
adForm.addEventListener('submit', formSubmitHandler);
