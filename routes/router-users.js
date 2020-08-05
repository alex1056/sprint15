const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

routerUsers.get('/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  }),
  getUserById);
routerUsers.get('/users', getUsers);
routerUsers.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserProfile);
routerUsers.patch('/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  updateUserAvatar);

module.exports = routerUsers;
