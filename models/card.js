const mongoose = require('mongoose');
const validatorModule = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Поле должно содержать значение'],
  },
  link: {
    type: String,
    validate: {
      validator: (v) => validatorModule.isURL(v),
      message: (props) => `"${props.value}" некорректный формат ссылки!`,
    },
    required: [true, 'Ссылка на изображение обязательна'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: {},
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
