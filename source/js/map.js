import { openModalSuccess, openModalError } from './modal.js';
import { setAdFormSubmit, setAdFormListeners, Price } from './form.js';
import { renderAd } from './card.js';
import { getData } from './api.js';
import { debounce } from './util.js';

const ALERT_SHOW_TIME = 5000;
const DEBOUNCE_DELAY = 500;
const AD_COUNT = 10;

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

const FILTER_FIELD_ANY_VALUE = 'any';
const DEFAULT_FILTER_CB = () => true;

const FilterId = {
  TYPE: 'housing-type',
  PRICE: 'housing-price',
  ROOMS: 'housing-rooms',
  GUESTS: 'housing-guests',
  FEATURES: 'housing-features',
};

const filterAdBy = {
  [FilterId.TYPE]: DEFAULT_FILTER_CB,
  [FilterId.PRICE]: DEFAULT_FILTER_CB,
  [FilterId.ROOMS]: DEFAULT_FILTER_CB,
  [FilterId.GUESTS]: DEFAULT_FILTER_CB,
  [FilterId.FEATURES]: DEFAULT_FILTER_CB,
};

const filterIds = Object.values(FilterId);

const priceTypeToRange = {
  'low': [Price.MIN, 10000],
  'middle': [10000, 50000],
  'high': [50000, Price.MAX],
};

const adForm = document.querySelector('.ad-form');
const filterForm = document.querySelector('.map__filters');
const addrField = adForm.querySelector('#address');
const resetButton = adForm.querySelector('.ad-form__reset');
const featureFields = filterForm.querySelectorAll('.map__features .map__checkbox');

const mainPinIcon = L.icon({
  iconUrl: MapConfig.MAIN_PIN_URL,
  iconSize: MapConfig.MAIN_ICON_SIZE,
  iconAnchor: MapConfig.MAIN_ICON_ANCHOR,
});

const mainPinMarker = L.marker(MapConfig.TOKYO, {
  icon: mainPinIcon,
  draggable: true,
});

const pinIcon = L.icon({
  iconUrl: MapConfig.PIN_URL,
  iconSize: MapConfig.ICON_SIZE,
  iconAnchor: MapConfig.ICON_ANCHOR,
});

let map;
let pinLayerGroup;

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

  setTimeout(() => alertContainer.remove(), ALERT_SHOW_TIME);
}

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
  initMainPinMarker();

  setAdFormDisabledTo(false);

  initPinMarkers();
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
const initMainPinMarker = () => {
  mainPinMarker.addTo(map);
  mainPinMarker.on('moveend', mainPinMarkerMoveEndHandler);

  setAddress(MapConfig.TOKYO);
};

const filterAd = (ad) => filterIds.every((filterId) => filterAdBy[filterId](ad));

const showPinMarkers = (ads) => {
  if (pinLayerGroup) {
    pinLayerGroup.clearLayers();
  } else {
    pinLayerGroup = L.layerGroup();
  }

  ads
    .filter(filterAd)
    .slice(0, AD_COUNT)
    .forEach((ad) => {
      const pinMarker = L.marker([ad.location.lat, ad.location.lng], { icon: pinIcon });
      pinMarker.bindPopup(renderAd(ad));

      pinLayerGroup.addLayer(pinMarker);
    });

  pinLayerGroup.addTo(map);
};

const createFilterCb = (filterId, filterValue) => {
  let cb = DEFAULT_FILTER_CB;

  if (filterValue === FILTER_FIELD_ANY_VALUE) {
    return cb;
  }

  switch (filterId) {
    case FilterId.TYPE:
      cb = ({offer}) => offer.type === filterValue;
      break;

    case FilterId.PRICE:
      if (filterValue in priceTypeToRange) {
        cb = ({offer}) => {
          return offer.price >= priceTypeToRange[filterValue][0]
            && offer.price < priceTypeToRange[filterValue][1];
        }
      }
      break;

    case FilterId.ROOMS:
      cb = ({offer}) => offer.rooms === Number(filterValue);
      break;

    case FilterId.GUESTS:
      cb = ({offer}) => offer.guests === Number(filterValue);
      break;

    case FilterId.FEATURES:
      // filterValue = [feature1, feature2, ..., featureN];
      cb = ({offer}) => {
        try {
          return filterValue.every((feature) => offer.features.includes(feature));
        } catch (err) {
          // ! ('features' in offer)
        }
        return false;
      }
      break;
  }

  return cb;
};

const getFeaturesChecked = () => {
  const filterValues = [];
  for (const featureField of featureFields) {
    if (featureField.checked) {
      filterValues.push(featureField.value);
    }
  }
  return filterValues;
}

const resetFilters = () => filterIds.forEach((filterId) => filterAdBy[filterId] = DEFAULT_FILTER_CB);

const updateFilter = (evt) => {
  let filterId;
  let filterValue;

  if (evt.target.type === 'checkbox') {
    // checkbox
    filterId = FilterId.FEATURES;
    filterValue = getFeaturesChecked();
  } else {
    // select
    filterId = evt.target.id;
    filterValue = evt.target.options[evt.target.selectedIndex].value;
  }

  filterAdBy[filterId] = createFilterCb(filterId, filterValue);
}

const initPinMarkers = () => {
  getData((ads) => {
    showPinMarkers(ads);

    setFilterFormDisabledTo(false);

    filterForm.addEventListener('reset', () => {
      resetFilters();
      showPinMarkers(ads);
    });

    filterForm.addEventListener('change', debounce(
      (evt) => {
        map.closePopup();
        updateFilter(evt);
        showPinMarkers(ads);
      }, DEBOUNCE_DELAY));
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
