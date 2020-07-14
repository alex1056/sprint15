const routerSignInUp = require('express').Router();
const {
  createUser, login,
} = require('../controllers/users');

routerSignInUp.post('/signin', login);
routerSignInUp.post('/signup', createUser);

module.exports = routerSignInUp;
