const jwt = require('jsonwebtoken');
const AuthRequiredError = require('../errors/auth-required-err');

module.exports.auth = (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt;
  } catch (e) {
    const err = new AuthRequiredError('Необходима авторизация');
    err.statusCode = 401;
    next(err);
  }

  let payload;

  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (e) {
    const err = new AuthRequiredError('Необходима авторизация');
    err.statusCode = 401;
    next(err);
  }
  req.user = payload;
  return next();
};
