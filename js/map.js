import { openModalSuccess, openModalError } from './modal.js';
import { setAdFormSubmit, setAdFormListeners } from './form.js';
import { renderAd } from './card.js';
import { getData } from './api.js';
import { showAlert } from './util.js';

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
const filterForm = document.querySelector('.map__filters');
const addrField = adForm.querySelector('#address');
const resetButton = adForm.querySelector('.ad-form__reset');

const mainPinIcon = L.icon({
  iconUrl: MapConfig.MAIN_PIN_URL,
  iconSize: MapConfig.MAIN_ICON_SIZE,
  iconAnchor: MapConfig.MAIN_ICON_ANCHOR,
});

const mainPinMarker = L.marker(MapConfig.TOKYO, {
  icon: mainPinIcon,
  draggable: true,
});

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
    filterForm.classList.add('map__filters--disabled');
  } else {
    filterForm.classList.remove('map__filters--disabled');
  }
  filterForm.querySelector('.map__features').disabled = isDisabled;
  filterForm.querySelectorAll('.map__filter').forEach((element) => element.disabled = isDisabled);
};

const setAddress = (addr = MapConfig.TOKYO) => addrField.value = addr.join(', ');

/**
 * Callback for event fired on map load by LeafLet lib
 */
const mapLoadHandler = () => {
  addMainPinMarker();

  setAdFormDisabledTo(false);

  addMarkers();
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
  mainPinMarker.addTo(map);
  mainPinMarker.on('moveend', mainPinMarkerMoveEndHandler);

  setAddress(MapConfig.TOKYO);
};

const addMarkers = () => {
  const icon = L.icon({
    iconUrl: MapConfig.PIN_URL,
    iconSize: MapConfig.ICON_SIZE,
    iconAnchor: MapConfig.ICON_ANCHOR,
  });

  getData((ads) => {
    const markers = [];

    ads.forEach((ad) => {
      const marker = L.marker([ad.location.lat, ad.location.lng], { icon });
      marker.bindPopup(renderAd(ad));
      markers.push(marker);
    });

    L.layerGroup(markers).addTo(map);

    setFilterFormDisabledTo(false);
  }, showAlert);
}

/**
 * Reset Filter and Place Advertisement forms
 */
const resetForms = () => {
  adForm.reset();
  filterForm.reset();

  map.closePopup();
  mainPinMarker.setLatLng(MapConfig.TOKYO);

  // instead of mainPinMarker.fire('moveend');
  setAddress(MapConfig.TOKYO);

  // instead of map.setView(...);
  map.flyTo(MapConfig.TOKYO, MapConfig.MAX_ZOOM_LEVEL);
};

/**
 * Callback when user clicks "Reset" button
 *
 * @param Event evt
 */
const resetButtonClickHandler = (evt) => {
  evt.preventDefault();

  resetForms();
}

const contentLoadHandler = () => {
  initMap();

  resetButton.addEventListener('click', resetButtonClickHandler);

  setAdFormSubmit(() => {
    resetForms();
    openModalSuccess();
  }, openModalError);

  setAdFormListeners();
}

document.addEventListener('DOMContentLoaded', contentLoadHandler);
