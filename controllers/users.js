const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err.message);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((found) => {
      if (!found) {
        return res.status(404).send({
          message: `Пользователь с id=${req.params.id} не найден`,
        });
      }
      return res.send(found);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const opts = { runValidators: true, new: true };
  User.findByIdAndUpdate(req.user._id, { name, about }, opts)
    .then((found) => {
      if (!found) {
        return res.status(404).send({
          message: `Пользователь с id=${req.params.id} не найден`,
        });
      }
      return res.send(found);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const opts = { runValidators: true, new: true };
  User.findByIdAndUpdate(req.user._id, { avatar }, opts)
    .then((found) => {
      if (!found) {
        return res.status(404).send({
          message: `Пользователь с id=${req.params.id} не найден`,
        });
      }
      return res.send(found);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
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

  bcrypt.hash(password, 10)
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
      res.status(400).send(err);
    });
};
