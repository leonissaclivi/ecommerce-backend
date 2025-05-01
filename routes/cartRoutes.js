const express = require('express');
const { addToCart, getUserCart, updateCart } = require('../controllers/cartController');
const middleware = require('../middleware/auth')

const router = express.Router();

router.post('/add', middleware, addToCart);

router.get('/get', middleware, getUserCart);

router.post('/update', middleware, updateCart);

module.exports = router;