'use strict';

var getRandomElement = function (array) {
  if (array.length === 0) {
    throw new RangeError('array is empty');
  }
  var index = Math.floor(Math.random() * array.length);
  return array[index];
};

var wizardBuilder = {
  FIRST_NAMES: ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'],
  LAST_NAMES: ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'],
  COAT_COLORS: ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'],
  EYES_COLORS: ['black', 'red', 'blue', 'yellow', 'green'],

  build: function () {
    return {
      'name': getRandomElement(this.FIRST_NAMES) + ' ' + getRandomElement(this.LAST_NAMES),
      'coatColor': getRandomElement(this.COAT_COLORS),
      'eyesColor': getRandomElement(this.EYES_COLORS)
    };
  }
};

var customizeWizardItem = function (wizardItem, wizard) {
  wizardItem.querySelector('.setup-similar-label').textContent = wizard.name;
  wizardItem.querySelector('.wizard-coat').style.fill = wizard.coatColor;
  wizardItem.querySelector('.wizard-eyes').style.fill = wizard.eyesColor;
};

var createWizardItems = function (templateItem) {
  var wizardsFragment = document.createDocumentFragment();

  for (var i = 0; i < 4; i++) {
    var wizardItem = templateItem.cloneNode(true);
    customizeWizardItem(wizardItem, wizards[i]);
    wizardsFragment.appendChild(wizardItem);
  }

  return wizardsFragment;
};

document.querySelector('.setup').classList.remove('hidden');

var wizards = [wizardBuilder.build(), wizardBuilder.build(), wizardBuilder.build(), wizardBuilder.build()];
var templateItem = document.querySelector('#similar-wizard-template').content.querySelector('.setup-similar-item');

var wizardsList = document.querySelector('.setup-similar-list');
wizardsList.appendChild(createWizardItems(templateItem));

document.querySelector('.setup-similar').classList.remove('hidden');
