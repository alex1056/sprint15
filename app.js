const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { auth } = require('./middlewares/auth');

const routerUsers = require(path.join(__dirname, 'routes/router-users.js'));
const routerCards = require(path.join(__dirname, 'routes/router-cards.js'));
const routerSignInUp = require(path.join(__dirname, 'routes/router-signin-signup.js'));

const routerErr = require(path.join(__dirname, 'middlewares/router-err.js'));
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '5f0327ddbd97500a80f7b19b',
//   };
//   next();
// });

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', routerSignInUp);
app.use(auth);
app.use('/', routerUsers);
app.use('/', routerCards);
app.use(routerErr);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
