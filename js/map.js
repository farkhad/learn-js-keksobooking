import './form.js';
import { createAds } from './data.js';
import { renderAd } from './card.js';

const MapConfig = {
  TOKYO: [35.658581, 139.745438],
  MAX_ZOOM_LEVEL: 10,
  CANVAS_ID: 'map-canvas',

  MAIN_PIN_URL: 'img/main-pin.svg',
  MAIN_ICON_SIZE: [52, 52],
  MAIN_ICON_ANCHOR: [26, 52],

  PIN_URL: 'img/pin.svg',
  ICON_SIZE: [40, 40],
  ICON_ANCHOR: [20, 40],

  PRECISION: 5,
}

const adForm = document.querySelector('.ad-form');
const mapFilterForm = document.querySelector('.map__filters');
const addrField = adForm.querySelector('#address');

let map;

/**
 * Set Ad Form's interactive elements to disabled/enabled
 *
 * @param Boolean isDisabled
 */
const setAdFormDisabledTo = (isDisabled = true) => {
  if (isDisabled) {
    adForm.classList.add('ad-form--disabled');
  } else {
    adForm.classList.remove('ad-form--disabled');
  }
  adForm.querySelector('.ad-form-header').disabled = isDisabled;
  adForm.querySelectorAll('.ad-form__element').forEach((element) => element.disabled = isDisabled);
};

/**
 * Set Map Filter Form's elements to disabled/enabled
 *
 * @param Boolean isDisabled
 */
const setFilterFormDisabledTo = (isDisabled = true) => {
  if (isDisabled) {
    mapFilterForm.classList.add('map__filters--disabled');
  } else {
    mapFilterForm.classList.remove('map__filters--disabled');
  }
  mapFilterForm.querySelectorAll('.map__filter').forEach((element) => element.disabled = isDisabled);
  mapFilterForm.querySelector('.map__features').disabled = isDisabled;
};

const setAddress = (addr = MapConfig.TOKYO) => addrField.value = addr.join(', ');

/**
 * Callback for event fired on map load by LeafLet lib
 */
const mapLoadHandler = () => {
  /*
  5.10. Форма, с помощью которой производится фильтрация похожих объявлений на момент открытия страницы, заблокирована и становится доступной только после окончания загрузки всех похожих объявлений, которые в свою очередь начинают загружаться только после загрузки и успешной инициализации карты.
  */
  addMainPinMarker();
  setAddress(MapConfig.TOKYO);

  setAdFormDisabledTo(false);

  addMarkers();

  setFilterFormDisabledTo(false);
};

/**
 * Callback for 'moveend' event fired on main pin marker by Leaflet
 *
 * @param Object evt
 */
const mainPinMarkerMoveEndHandler = (evt) => {
  const targetCoords = evt.target.getLatLng();
  setAddress([targetCoords.lat.toFixed(MapConfig.PRECISION), targetCoords.lng.toFixed(MapConfig.PRECISION)]);
};

/**
 * Initialize LeafLet map
 */
const initMap = () => {
  setAdFormDisabledTo(true);
  setFilterFormDisabledTo(true);

  map = L.map(MapConfig.CANVAS_ID);
  map.on('load', mapLoadHandler);
  map.setView(MapConfig.TOKYO, MapConfig.MAX_ZOOM_LEVEL);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
};

/**
 * Устанавливает главную метку на карту
 */
const addMainPinMarker = () => {
  const mainPinIcon = L.icon({
    iconUrl: MapConfig.MAIN_PIN_URL,
    iconSize: MapConfig.MAIN_ICON_SIZE,
    iconAnchor: MapConfig.MAIN_ICON_ANCHOR,
  });

  const mainPinMarker = L.marker(MapConfig.TOKYO, {
    icon: mainPinIcon,
    draggable: true,
  });
  mainPinMarker.addTo(map);

  mainPinMarker.on('moveend', mainPinMarkerMoveEndHandler);
};

const addMarkers = () => {
  const icon = L.icon({
    iconUrl: MapConfig.PIN_URL,
    iconSize: MapConfig.ICON_SIZE,
    iconAnchor: MapConfig.ICON_ANCHOR,
  });

  const ads = createAds();
  ads.forEach((ad) => {
    const marker = L.marker([ad.location.x, ad.location.y], { icon });
    marker.bindPopup(renderAd(ad));
    marker.addTo(map);
  });
}

const contentLoadHandler = () => {
  initMap();
}

document.addEventListener('DOMContentLoaded', contentLoadHandler);
