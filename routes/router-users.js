const routerUsers = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

routerUsers.get('/users/:id', getUserById);
routerUsers.get('/users', getUsers);
routerUsers.patch('/users/me', updateUserProfile);
routerUsers.patch('/users/me/avatar', updateUserAvatar);

module.exports = routerUsers;
