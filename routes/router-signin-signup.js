const { celebrate, Joi } = require('celebrate');
const routerSignInUp = require('express').Router();
const joiCustomUrlValidator = require('../helpers/joi-custom-url-validator.js');
const {
  createUser, login,
} = require('../controllers/users');

// routerSignInUp.post('/signin', login);
routerSignInUp.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
      password: Joi.string().required().min(2).max(30),
    }),
  }),
  login);

routerSignInUp.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
      password: Joi.string().required().min(2).max(30),
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().custom(joiCustomUrlValidator, 'custom validation'),
    }),
  }),
  createUser);

module.exports = routerSignInUp;
