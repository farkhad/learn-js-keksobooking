import { createAds } from './data.js';

const PRICE_DESCRIPTION = '₽/ночь';

const housingType = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalow: 'Бунгало',
};

const cardTemplate = document.querySelector('#card').content.querySelector('.popup');

const priceDescription = document.createElement('span');
priceDescription.textContent = ` ${PRICE_DESCRIPTION}`;

/**
 * Renders advertisment from html template
 *
 * @param Object ad
 * @returns Element
 */
const renderAd = (ad) => {
  const card = cardTemplate.cloneNode(true);

  const priceField = card.querySelector('.popup__text--price');

  const features = card.querySelector('.popup__features').children;

  const photos = card.querySelector('.popup__photos');
  const photoTemplate = photos.querySelector('.popup__photo');
  const photosFragment = document.createDocumentFragment();

  card.querySelector('.popup__title').textContent = ad.offer.title;
  card.querySelector('.popup__text--address').textContent = ad.offer.address;

  // Б27. Для вставки пользовательских строк (имён, фамилий и так далее) использован textContent
  priceField.textContent = ad.offer.price;
  priceField.appendChild(priceDescription.cloneNode(true));

  card.querySelector('.popup__type').textContent = housingType[ad.offer.type];
  card.querySelector('.popup__text--capacity').textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  card.querySelector('.popup__text--time').textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

  for (let i = 0; i < features.length; i++) {
    features[i].classList.add('hidden');
  }
  ad.offer.features.forEach((feature) => card.querySelector(`.popup__feature--${feature}`).classList.remove('hidden'));

  card.querySelector('.popup__description').textContent = ad.offer.description;

  ad.offer.photos.forEach((photoUrl) => {
    const photo = photoTemplate.cloneNode(false);
    photo.src = photoUrl;
    photosFragment.appendChild(photo);
  });
  photoTemplate.remove();
  photos.appendChild(photosFragment);

  card.querySelector('.popup__avatar').src = ad.author.avatar;

  return card;
};

/**
 * Renders advertisements
 *
 * @returns DocumentFragment
 */
const renderAds = () => {
  const ads = createAds();
  const cardsFragment = document.createDocumentFragment();

  ads.forEach((ad) => cardsFragment.appendChild(renderAd(ad)));

  priceDescription.remove();

  return cardsFragment;
};

const ads = renderAds();
document.querySelector('#map-canvas').appendChild(ads.children[0]);
