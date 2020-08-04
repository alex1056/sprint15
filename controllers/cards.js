const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: `Карточка с ID=${req.params.id} не найдена` });
      }
      return Card.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
        .then((found) => {
          if (!found) {
            return res.status(403).send({ message: 'Нет доступа к удалению чужой карточки' });
          }
          return res.send(found);
        })
        .catch((err) => res.status(500).send({ message: err.message }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Передан некорректный ID карточки (${req.params.id})` });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((found) => {
      if (!found) {
        return res.status(404).send({ message: `Карточка с ID=${req.params.cardId} не найдена` });
      }
      return res.send(found);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Передан некорректный ID карточки (${req.params.cardId})` });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((found) => {
      if (!found) {
        return res.status(404).send({ message: `Карточка с ID=${req.params.cardId} не найдена` });
      }
      return res.send(found);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Передан некорректный ID карточки (${req.params.cardId})` });
      }
      return res.status(500).send({ message: err.message });
    });
};
