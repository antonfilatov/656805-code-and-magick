'use strict';

var wizardBuilder = {
  FIRST_NAMES: ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'],
  LAST_NAMES: ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'],
  COAT_COLORS: ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'],

  getRandomElement: function (array) {
    if (array.length === 0) {
      throw new RangeError('array is empty');
    }
    var index = Math.floor(Math.random() * array.length);
    return array[index];
  },

  build: function () {
    return {
      'name': this.getRandomElement(this.FIRST_NAMES) + ' ' + this.getRandomElement(this.LAST_NAMES),
      'coatColor': this.getRandomElement(this.COAT_COLORS),
      'eyesColor': this.getRandomElement(EYES_COLORS)
    };
  }
};

var renderSimilarWizardsList = function () {
  var wizardsListElement = document.createDocumentFragment();
  var wizardTemplateItem = document.querySelector('#similar-wizard-template').content.querySelector('.setup-similar-item');

  for (var i = 0; i < wizards.length; i++) {
    wizardsListElement.appendChild(createWizardListItem(wizardTemplateItem, wizards[i]));
  }

  var wizardsList = setupSimilarElement.querySelector('.setup-similar-list');
  wizardsList.appendChild(wizardsListElement);
  setupSimilarElement.classList.remove('hidden');
};

var createWizardListItem = function (template, wizard) {
  var wizardItem = template.cloneNode(true);

  wizardItem.querySelector('.setup-similar-label').textContent = wizard.name;
  wizardItem.querySelector('.wizard-coat').style.fill = wizard.coatColor;
  wizardItem.querySelector('.wizard-eyes').style.fill = wizard.eyesColor;

  return wizardItem;
};

var clearSimilarWizardsList = function () {
  var setupSimilarListElement = setupSimilarElement.querySelector('.setup-similar-list');
  var wizardsListItems = setupSimilarListElement.children;

  for (var i = wizardsListItems.length - 1; i >= 0; i--) {
    setupSimilarListElement.removeChild(wizardsListItems[i]);
  }

  setupSimilarElement.classList.add('hidden');
};

var loadSimilarWizardsList = function() {
  wizards = [];
  for (var i = 0; i < 4; i++) {
    wizards.push(wizardBuilder.build());
  }
};

var onSetupEscPress = function(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeSetup();
  }
};

var openSetup = function () {
  document.querySelector('.setup').classList.remove('hidden');

  loadSimilarWizardsList();
  renderSimilarWizardsList();
  document.addEventListener('keydown', onSetupEscPress);
};

var closeSetup = function () {
  document.querySelector('.setup').classList.add('hidden');

  clearSimilarWizardsList();
  document.removeEventListener('keydown', onSetupEscPress);
};

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
var FIREBALL_COLORS = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];

var wizards = [];
var setupElement = document.querySelector('.setup');
var setupSimilarElement = setupElement.querySelector('.setup-similar');
var setupOpenElement = document.querySelector('.setup-open');
var setupCloseElement = setupElement.querySelector('.setup-close');

setupOpenElement.addEventListener('click', function() {
  openSetup();
});

setupOpenElement.addEventListener('keydown', function(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openSetup();
  }
});

setupCloseElement.addEventListener('click', function() {
  closeSetup();
});

setupCloseElement.addEventListener('keydown', function(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeSetup();
  }
});

var setupEyesColorElement = setupElement.querySelector('.setup-wizard .wizard-eyes');
var setupEyesColorInputElement = setupElement.querySelector('.setup-wizard-appearance input[name="eyes-color"]');
var currentEyesColorIndex = 0;
setupEyesColorElement.addEventListener('click', function () {
  if (currentEyesColorIndex++ >= EYES_COLORS.length - 1) {
    currentEyesColorIndex = 0;
  }
  setupEyesColorElement.style.fill = EYES_COLORS[currentEyesColorIndex];
  setupEyesColorInputElement.value = EYES_COLORS[currentEyesColorIndex];
});

var setupFireballColorElement = setupElement.querySelector('.setup-fireball-wrap');
var setupFireballColorInputElement = setupFireballColorElement.querySelector('input[name="fireball-color"]');
var currentFireballColorIndex = 0;
setupFireballColorElement.addEventListener('click', function () {
  if (currentFireballColorIndex++ >= FIREBALL_COLORS.length - 1) {
    currentFireballColorIndex = 0;
  }
  setupFireballColorElement.style.background = FIREBALL_COLORS[currentFireballColorIndex];
  setupFireballColorInputElement.value = FIREBALL_COLORS[currentFireballColorIndex];
});
