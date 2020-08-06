const validatorModule = require('validator');

const joiCustomUrlValidator = (value, helpers) => {
  if (!validatorModule.isURL(value)) {
    return helpers.message('Некорректный формат URL');
  }
  // Return the value unchanged
  return value;
};

module.exports = joiCustomUrlValidator;
