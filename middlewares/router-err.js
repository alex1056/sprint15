const routerErr = require('express').Router();

routerErr.use((req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  next();
});

module.exports = routerErr;
