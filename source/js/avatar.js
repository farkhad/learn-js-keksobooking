const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const avatarChooser = document.querySelector('#avatar');
const avatarPreview = document.querySelector('.ad-form-header__preview img');

const photoChooser = document.querySelector('#images');
const photoContainer = document.querySelector('.ad-form__photo-container .ad-form__photo');

const checkFile = (file) => {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((ext) => fileName.endsWith(ext));
};

avatarChooser.addEventListener('change', () => {
  const file = avatarChooser.files[0];
  if (checkFile(file)) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      avatarPreview.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});

photoChooser.addEventListener('change', () => {
  const file = photoChooser.files[0];
  if (checkFile(file)) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const img = document.createElement('img');
      img.src = reader.result;
      img.width = 70;
      img.height = 70;
      img.alt = 'Фотография жилья';
      photoContainer.appendChild(img);
    });

    reader.readAsDataURL(file);
  }
});
