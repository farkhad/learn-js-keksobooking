'use strict';
const AD_COUNT = 10;

const Location = {
  X: {
    MIN: 35.65000,
    MAX: 35.70000,
    PRECISION: 5,
  },
  Y: {
    MIN: 139.70000,
    MAX: 139.80000,
    PRECISION: 5,
  },
};

const Price = {
  MIN: 1000,
  MAX: 10000,
};

const Rooms = {
  MIN: 1,
  MAX: 5,
};

const Guests = {
  MIN: 1,
  MAX: 5,
};

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

const adSampleData = {
  types: ['palace', 'flat', 'house', 'bungalow'],
  checkinout: ['12:00', '13:00', '14:00'],
  offer: {
    titles: [
      'Lorem ipsum dolor sit amet',
      'Nullam sagittis est a felis aliquet',
      'Pellentesque pulvinar sem at massa malesuada',
      'Aliquam nec leo pulvinar',
      'Pellentesque ac lacinia elit',
    ],
    descriptions: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae accumsan magna, vel dignissim ipsum. Nunc nulla velit, auctor id dui in, congue porttitor dolor. Nulla tincidunt nisl nec purus sollicitudin, eget placerat purus accumsan. Integer volutpat ac lorem eu malesuada. Curabitur eros augue, pellentesque vel ipsum a, tristique rhoncus sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed iaculis, dolor eget gravida auctor, dui massa rutrum nisi, non pellentesque ante lectus a ex. Maecenas nec lobortis enim, sit amet faucibus augue.',
      'Nullam sagittis est a felis aliquet, vel aliquet sem placerat. Mauris id nisl maximus, cursus turpis vel, vulputate ligula. Duis placerat, nibh a commodo vulputate, tellus ex tincidunt elit, sit amet molestie sem urna nec dolor. Nulla dignissim scelerisque felis, a lobortis mauris tempor nec. Cras sodales quis purus vitae facilisis. Etiam sagittis commodo mauris, et mollis purus vehicula a. Duis imperdiet in lectus sed mollis. Maecenas efficitur, enim quis eleifend facilisis, mi nisl ullamcorper odio, vitae posuere eros nisl ut orci. Fusce ut urna quis quam ultricies scelerisque. Nam id lorem sed elit vulputate dapibus et quis nisi. Praesent vitae venenatis neque.',
      'Pellentesque pulvinar sem at massa malesuada, vitae venenatis elit efficitur. Vivamus malesuada nulla tortor, sed vulputate elit sagittis non. Nunc ut pulvinar nibh, sed posuere turpis. Donec sit amet interdum mi. Quisque bibendum dui justo, eget interdum libero ullamcorper ac. Nunc quis ipsum libero. Aenean nec metus mauris. Praesent ultrices, felis id pulvinar pretium, ex elit ullamcorper risus, vel molestie metus risus ut justo. Phasellus maximus volutpat mauris. Morbi condimentum velit eget eros posuere, non faucibus dui vulputate. Fusce vel elementum metus. Donec sollicitudin porta libero non fringilla. Vestibulum laoreet enim risus. Nunc venenatis mi neque, vitae interdum sem tempor vitae.',
      'In at congue enim. Aliquam nec leo pulvinar, fermentum elit a, sollicitudin libero. Suspendisse at quam eleifend, condimentum lacus vitae, tincidunt lacus. Sed id ligula turpis. Mauris vitae ligula mauris. Praesent interdum aliquam libero, porta finibus nibh semper id. Vivamus vitae malesuada augue. Morbi id faucibus magna, non varius dui. Sed eu enim nec tellus tincidunt pharetra sed at neque. Pellentesque volutpat nibh quis sodales tristique. Fusce vel ante id dolor molestie posuere eget nec metus. Pellentesque ultrices quis felis id accumsan. Praesent tortor mi, dapibus ornare hendrerit cursus, pulvinar sed libero.',
      'Pellentesque ac lacinia elit, at dapibus arcu. In hac habitasse platea dictumst. Vivamus ac porttitor tellus. Nulla cursus libero quis aliquam bibendum. Donec ultricies euismod elit. Curabitur viverra, quam ac malesuada interdum, sapien leo hendrerit massa, eget volutpat tortor dolor et tellus. Donec interdum magna at dolor volutpat, ut scelerisque est rutrum. Cras ante ipsum, ullamcorper a nibh et, posuere venenatis odio. Nunc nibh mauris, ultrices at neque vel, gravida luctus risus. Proin ornare massa sed urna bibendum facilisis. Donec rhoncus eget nisi ut pretium. Pellentesque nec lorem ut velit consequat egestas. Donec auctor dolor vel lacus aliquet gravida. Maecenas et elit lorem.',
    ],
  },
  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  ],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
};

/**
 * Получить случайный элемент массива
 *
 * @param array randomArray
 * @returns mixed
 */
const getRandomArrayElement = (arr) => arr[getRandomInt(0, arr.length - 1)];

/**
 * Получить массив строк — массив случайной длины из значений:
 * http://o0.github.io/assets/images/tokyo/hotel1.jpg,
 * http://o0.github.io/assets/images/tokyo/hotel2.jpg,
 * http://o0.github.io/assets/images/tokyo/hotel3.jpg
 *
 * @returns array
 */
const getRandomPhotos = () => new Array(getRandomInt(1, adSampleData.photos.length))
  .fill(null)
  .map(() => getRandomArrayElement(adSampleData.photos));

/**
 * Получить массив строк — массив случайной длины из значений:
 * wifi, dishwasher, parking, washer, elevator, conditioner.
 * Значения не должны повторяться.
 *
 * @returns array
 */
const getRandomFeatures = () => {
  let features = [];
  let randomFeaturesNumber = getRandomInt(1, adSampleData.features.length);

  if (randomFeaturesNumber === adSampleData.features.length) {
    features = adSampleData.features.slice();
  } else {
    while (randomFeaturesNumber--) {
      let randomFeature = getRandomArrayElement(adSampleData.features);
      if (features.some((feature) => feature === randomFeature)) {
        randomFeaturesNumber++;
      } else {
        features.push(randomFeature);
      }
    }
  }

  return features;
};

/**
 * Создает объявление со случайными данными
 *
 * @param {int} idx
 * @returns Object
 */
const createAd = (idx = 0) => {
  const locationX = getRandomFloat(Location.X.MIN, Location.X.MAX, Location.X.PRECISION);
  const locationY = getRandomFloat(Location.Y.MIN, Location.Y.MAX, Location.Y.PRECISION);

  return {
    author: {
      avatar: 'img/avatars/user' + ((idx + 1) < AD_COUNT ? '0' : '') + (idx + 1) + '.png',
    },
    offer: {
      title: getRandomArrayElement(adSampleData.offer.titles),
      address: locationX + ' ' + locationY,
      price: getRandomInt(Price.MIN, Price.MAX),
      type: getRandomArrayElement(adSampleData.types),
      rooms: getRandomInt(Rooms.MIN, Rooms.MAX),
      guests: getRandomInt(Guests.MIN, Guests.MAX),
      checkin: getRandomArrayElement(adSampleData.checkinout),
      checkout: getRandomArrayElement(adSampleData.checkinout),
      features: getRandomFeatures(),
      description: getRandomArrayElement(adSampleData.offer.descriptions),
      photos: getRandomPhotos(),
    },
    location: {
      x: locationX,
      y: locationY,
    },
  };
};

/**
 * Получить массив из 10 сгенерированных объектов.
 * Каждый объект массива — описание похожего объявления неподалёку.
 *
 * @returns array
 */
const getAdSampleData = () => new Array(AD_COUNT)
  .fill(null)
  .map((el, idx) => createAd(idx));
