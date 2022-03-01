const THOUSANDS_SEPARATOR = ' ';

const ALERT_SHOW_TIME = 5000;

/**
 * Возвращает случайное целое число из переданного диапазона включительно
 * Решение https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 *
 * @param int min
 * @param int max
 * @returns int
 */
const getRandomInt = (min, max) => {
  if (min < 0 || max < 0) {
    return -1;
  }

  min = Math.ceil(min);
  max = Math.floor(max);

  if (max < min) {
    [min, max] = [max, min];
  }

  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/**
 * Возвращает случайное число с плавающей точкой с указанным кол-вом знаков
 * после запятой из переданного диапазона включительно.
 * Решение
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
 * https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 * https://discord.com/channels/874632952691191838/874638732140101662/939926374863474729
 *
 * @param int min
 * @param int max
 * @param int precision
 * @returns float
 */
const getRandomFloat = (min, max, precision = 0) => {
  if (min < 0 || max < 0) {
    return -1;
  }

  if (precision === 0) {
    const coef = 10 ** precision;
    max = Math.floor(max * coef) / coef;
    min = Math.ceil(min * coef) / coef;
  }

  if (max < min) {
    [min, max] = [max, min];
  }

  return Number((Math.random() * (max - min) + min).toFixed(precision));
};

/**
 * Получить случайный элемент массива
 *
 * @param array randomArray
 * @returns mixed
 */
const getRandomArrayElement = (arr) => arr[getRandomInt(0, arr.length - 1)];

/**
 * Formats number with enclosed thousands separator
 * https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 *
 * @param Number x
 * @param String sep
 * @returns String
 */
const formatNumber = (x, sep = THOUSANDS_SEPARATOR) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/**
 * https://up.htmlacademy.ru/profession/frontender-lite/1/lite-javascript/1/demos/5825#18
 *
 * @param String message
 */
const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 100;
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
}

/**
 * Checks if key pressed was Escape button
 *
 * @param Event evt
 * @returns Boolean
 */
const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};

export { getRandomInt, getRandomFloat, getRandomArrayElement, formatNumber, showAlert, isEscEvent };
