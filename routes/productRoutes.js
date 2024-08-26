const express = require('express');
const { createProduct, loadAllProducts } = require('../controllers/productController');
const { isAuthenticated } = require('../middlewares/protectedRoutes');
const router = express.Router()

router.route('/product').post(isAuthenticated, createProduct).get(isAuthenticated, loadAllProducts)

module.exports = router