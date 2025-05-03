const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const { updateStatus, allOrders, placeOrder, placeOrderStripe, userOrders } = require('../controllers/orderController');
const middleware = require('../middleware/auth');
const router = express.Router();


//Admin features
router.post('/list', adminAuth, allOrders);
router.get('/status', adminAuth, updateStatus);

//Payment features
router.post('/place', middleware, placeOrder);
router.post('/stripe', middleware, placeOrderStripe);

//User functions
router.get('/userorders', middleware, userOrders);


module.exports = router;
