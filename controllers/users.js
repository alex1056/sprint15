const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((found) => {
      if (!found) {
        return res.status(404).send({
          message: `Пользователь с ID=${req.params.id} не найден`,
        });
      }
      return res.send(found);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Передан некорректный ID=${req.params.id}` });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const opts = { runValidators: true, new: true };
  User.findByIdAndUpdate(req.user._id, { name, about }, opts)
    .then((found) => {
      if (!found) {
        return res.status(404).send({
          message: `Пользователь с ID=${req.params.id} не найден`,
        });
      }
      return res.send(found);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const opts = { runValidators: true, new: true };
  User.findByIdAndUpdate(req.user._id, { avatar }, opts)
    .then((found) => {
      if (!found) {
        return res.status(404).send({
          message: `Пользователь с ID=${req.params.id} не найден`,
        });
      }
      return res.send(found);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).send({ message: 'Поле "email" должно быть заполнено' });
  if (!password) return res.status(400).send({ message: 'Поле "пароль" должно быть заполнено' });

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password) return res.status(400).send({ message: 'Поле "пароль" должно быть заполнено' });

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) return res.status(409).send({ message: `Пользователь с email=${email} уже существует` });
      return res.status(400).send({ message: err.message });
    });
};
