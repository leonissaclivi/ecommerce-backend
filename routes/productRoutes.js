const express = require('express');
const { addProduct, removeProducts, singleProduct, listProducts } = require('../controllers/productController');
const upload = require('../middleware/multer');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();


router.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]), addProduct);

router.post('/remove',adminAuth, removeProducts);

router.post('/single', singleProduct);

router.post('/list', listProducts);
module.exports = router;