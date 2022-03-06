import { getRandomInt, getRandomFloat, getRandomArrayElement } from './util.js';

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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae accumsan magna, vel dignissim ipsum. Nunc nulla velit, auctor id dui in, congue porttitor dolor. Nulla tincidunt nisl nec purus sollicitudin, eget placerat purus accumsan.',
      'Integer volutpat ac lorem eu malesuada. Curabitur eros augue, pellentesque vel ipsum a, tristique rhoncus sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;',
      'Sed iaculis, dolor eget gravida auctor, dui massa rutrum nisi, non pellentesque ante lectus a ex. Maecenas nec lobortis enim, sit amet faucibus augue.',
      'Nullam sagittis est a felis aliquet, vel aliquet sem placerat. Mauris id nisl maximus, cursus turpis vel, vulputate ligula. Duis placerat, nibh a commodo vulputate, tellus ex tincidunt elit, sit amet molestie sem urna nec dolor. Nulla dignissim scelerisque felis, a lobortis mauris tempor nec.',
      'Cras sodales quis purus vitae facilisis. Etiam sagittis commodo mauris, et mollis purus vehicula a. Duis imperdiet in lectus sed mollis.',
      'Maecenas efficitur, enim quis eleifend facilisis, mi nisl ullamcorper odio, vitae posuere eros nisl ut orci. Fusce ut urna quis quam ultricies scelerisque. Nam id lorem sed elit vulputate dapibus et quis nisi. Praesent vitae venenatis neque.',
      'Pellentesque pulvinar sem at massa malesuada, vitae venenatis elit efficitur. Vivamus malesuada nulla tortor, sed vulputate elit sagittis non. Nunc ut pulvinar nibh, sed posuere turpis.',
      'Donec sit amet interdum mi. Quisque bibendum dui justo, eget interdum libero ullamcorper ac. Nunc quis ipsum libero. Aenean nec metus mauris.',
      'Praesent ultrices, felis id pulvinar pretium, ex elit ullamcorper risus, vel molestie metus risus ut justo. Phasellus maximus volutpat mauris.',
      'Morbi condimentum velit eget eros posuere, non faucibus dui vulputate. Fusce vel elementum metus. Donec sollicitudin porta libero non fringilla.',
      'Vestibulum laoreet enim risus. Nunc venenatis mi neque, vitae interdum sem tempor vitae.',
      'In at congue enim. Aliquam nec leo pulvinar, fermentum elit a, sollicitudin libero. Suspendisse at quam eleifend, condimentum lacus vitae, tincidunt lacus.',
      'Sed id ligula turpis. Mauris vitae ligula mauris. Praesent interdum aliquam libero, porta finibus nibh semper id. Vivamus vitae malesuada augue.',
      'Morbi id faucibus magna, non varius dui. Sed eu enim nec tellus tincidunt pharetra sed at neque. Pellentesque volutpat nibh quis sodales tristique.',
      'Fusce vel ante id dolor molestie posuere eget nec metus. Pellentesque ultrices quis felis id accumsan. Praesent tortor mi, dapibus ornare hendrerit cursus, pulvinar sed libero.',
      'Pellentesque ac lacinia elit, at dapibus arcu. In hac habitasse platea dictumst. Vivamus ac porttitor tellus. Nulla cursus libero quis aliquam bibendum.',
      'Donec ultricies euismod elit. Curabitur viverra, quam ac malesuada interdum, sapien leo hendrerit massa, eget volutpat tortor dolor et tellus.',
      'Donec interdum magna at dolor volutpat, ut scelerisque est rutrum. Cras ante ipsum, ullamcorper a nibh et, posuere venenatis odio. Nunc nibh mauris, ultrices at neque vel, gravida luctus risus.',
      'Proin ornare massa sed urna bibendum facilisis. Donec rhoncus eget nisi ut pretium.',
      'Pellentesque nec lorem ut velit consequat egestas. Donec auctor dolor vel lacus aliquet gravida. Maecenas et elit lorem.',
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
 * Возвращает объект — местоположение в виде географических координат. Состоит из двух полей:
 * x, число с плавающей точкой — широта, случайное значение от 35.65000 до 35.70000
 * y, число с плавающей точкой — долгота, случайное значение от 139.70000 до 139.80000
 *
 * @returns Object
 */
const getRandomLocation = () => {
  return {
    x: getRandomFloat(Location.X.MIN, Location.X.MAX, Location.X.PRECISION),
    y: getRandomFloat(Location.Y.MIN, Location.Y.MAX, Location.Y.PRECISION),
  }
};

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
      if (features.includes(randomFeature)) {
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
  const location = getRandomLocation();

  return {
    author: {
      avatar: 'img/avatars/user' + ((idx + 1) < 10 ? '0' : '') + (idx + 1) + '.png',
    },
    offer: {
      title: getRandomArrayElement(adSampleData.offer.titles),
      address: location.x + ' ' + location.y,
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
    location,
  };
};

/**
 * Получить массив из 10 сгенерированных объектов.
 * Каждый объект массива — описание похожего объявления неподалёку.
 *
 * @returns array
 */
const createAds = () => new Array(AD_COUNT)
  .fill(null)
  .map((el, idx) => createAd(idx));

export { createAds };
