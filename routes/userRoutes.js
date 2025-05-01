const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth')

const Users = require('../models/UserModel');
const { userCreate, userLogin, getAllUsers, getUserbyId, deleteUser, updateUser, adminLogin } = require('../controllers/userController');

router.post('/signup',userCreate);

router.post('/login',userLogin);

router.post('/admin', adminLogin)

router.get('/',middleware, getAllUsers);

router.get('/:id', middleware, getUserbyId);

router.delete('/:id',middleware, deleteUser);

router.put('/:id',middleware, updateUser);

module.exports = router;