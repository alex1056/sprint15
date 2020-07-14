const mongoose = require('mongoose');
const validatorModule = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Поле должно содержать значение'],
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Поле должно содержать значение'],
  },
  avatar: {
    type: 'String',
    validate: {
      validator: (v) => validatorModule.isURL(v),
      message: (props) => `${props.value} некорректный формат ссылки!`,
    },
    required: [true, 'Ссылка на аватар пользователя обязательна'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле email обязательно для заполнения'],
    validate: {
      validator: (v) => validatorModule.isEmail(v),
      message: (props) => `${props.value} некорректный email!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
