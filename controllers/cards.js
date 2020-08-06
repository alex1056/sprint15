const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ValidationError = require('../errors/validation-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((newCard) => res.send({ data: newCard }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new ValidationError(e.message);
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с ID=${req.params.id} не найдена`);
      }
      return Card.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
        .then((found) => {
          if (!found) {
            throw new ForbiddenError('Нет доступа к удалению чужой карточки');
          }
          return res.send(found);
        })
        .catch((e) => {
          next(e);
        });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new Error(`Передан некорректный ID карточки ${req.params.id}`);
        err.statusCode = 400;
        next(err);
      } else next(e);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((found) => {
      if (!found) {
        throw new NotFoundError(`Карточка с ID=${req.params.cardId} не найдена`);
      }
      return res.send(found);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new Error(`Передан некорректный ID карточки ${req.params.cardId}`);
        err.statusCode = 400;
        next(err);
      } else next(e);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((found) => {
      if (!found) {
        throw new NotFoundError(`Карточка с ID=${req.params.cardId} не найдена`);
      }
      return res.send(found);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new Error(`Передан некорректный ID карточки ${req.params.cardId}`);
        err.statusCode = 400;
        next(err);
      } else next(e);
    });
};
