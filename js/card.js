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

const hideElement = (element) => element.classList.add('hidden');

/**
 * Renders advertisment from html template
 *
 * @param Object ad
 * @returns Element
 */
const renderAd = (ad) => {
  const card = cardTemplate.cloneNode(true);

  const price = card.querySelector('.popup__text--price');

  const featuresList = card.querySelector('.popup__features');
  const features = featuresList.querySelectorAll('.popup__feature');

  const photos = card.querySelector('.popup__photos');
  const photoTemplate = photos.querySelector('.popup__photo');
  const photosFragment = document.createDocumentFragment();

  const title = card.querySelector('.popup__title');
  const address = card.querySelector('.popup__text--address');
  const type = card.querySelector('.popup__type');
  const capacity = card.querySelector('.popup__text--capacity');
  const time = card.querySelector('.popup__text--time');
  const description = card.querySelector('.popup__description');
  const avatar = card.querySelector('.popup__avatar');

  if (ad.offer.title) {
    title.textContent = ad.offer.title;
  } else {
    hideElement(title);
  }

  if (ad.offer.address) {
    address.textContent = ad.offer.address;
  } else {
    hideElement(address);
  }

  if (ad.offer.price) {
    // Б27. Для вставки пользовательских строк (имён, фамилий и так далее) использован textContent
    price.textContent = ad.offer.price;
    price.appendChild(priceDescription.cloneNode(true));
  } else {
    hideElement(price);
  }

  if (ad.offer.type) {
    type.textContent = housingType[ad.offer.type];
  } else {
    hideElement(type);
  }

  if (ad.offer.rooms || ad.offer.guests) {
    capacity.textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  } else {
    hideElement(capacity);
  }

  if (ad.offer.checkin || ad.offer.checkout) {
    time.textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;
  } else {
    hideElement(time);
  }

  if (ad.offer.features.length) {
    features.forEach((feature) => hideElement(feature));
    ad.offer.features.forEach((feature) => card.querySelector(`.popup__feature--${feature}`).classList.remove('hidden'));
  } else {
    hideElement(featuresList);
  }

  if (ad.offer.description) {
    description.textContent = ad.offer.description;
  } else {
    hideElement(description);
  }

  if (ad.offer.photos.length) {
    ad.offer.photos.forEach((photoUrl) => {
      const photo = photoTemplate.cloneNode(false);
      photo.src = photoUrl;
      photosFragment.appendChild(photo);
    });
    photoTemplate.remove();
    photos.appendChild(photosFragment);
  } else {
    hideElement(photos);
  }

  if (ad.author.avatar) {
    avatar.src = ad.author.avatar;
  } else {
    hideElement(avatar);
  }

  return card;
};

/**
 * Renders advertisements
 *
 * @param Array ads
 * @returns DocumentFragment
 */
const renderAds = (ads = []) => {
  const cardsFragment = document.createDocumentFragment();

  ads.forEach((ad) => cardsFragment.appendChild(renderAd(ad)));

  priceDescription.remove();

  return cardsFragment;
};

export { renderAd, renderAds };
