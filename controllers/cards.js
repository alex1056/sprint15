const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Произошла ошибка' });
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
    .catch((err) => res.status(400).send(err.message));
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
    .then((found) => {
      if (!found) {
        return res.status(403).send({ message: 'Карточка не найдена, либо нет доступа к удалению карточки' });
      }
      return res.send(found);
    })
    .catch((err) => res.status(500).send(err));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((found) => {
      if (!found) {
        return res.status(404).send({ message: `Карточка с id=${req.params.cardId} не найдена` });
      }
      return res.send(found);
    })
    .catch((err) => res.status(500).send(err));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((found) => {
      if (!found) {
        return res.status(404).send({ message: `Карточка с id=${req.params.cardId} не найдена` });
      }
      return res.send(found);
    })
    .catch((err) => res.status(500).send(err));
};
