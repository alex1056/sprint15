const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/cards', getCards);

routerCards.post('/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  createCard);

routerCards.delete('/cards/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  }),
  deleteCard);

routerCards.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  likeCard);

routerCards.delete('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  dislikeCard);
module.exports = routerCards;
