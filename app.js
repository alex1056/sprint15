const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const path = require('path');
const mongoose = require('mongoose');

const { errors } = require('celebrate');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { auth } = require('./middlewares/auth');

const routerUsers = require(path.join(__dirname, 'routes/router-users.js'));
const routerCards = require(path.join(__dirname, 'routes/router-cards.js'));
const routerSignInUp = require(path.join(__dirname, 'routes/router-signin-signup.js'));

const routerErr = require(path.join(__dirname, 'middlewares/router-err.js'));

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/', routerSignInUp);
app.use(auth);
app.use('/', routerUsers);
app.use('/', routerCards);
app.use(routerErr);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
