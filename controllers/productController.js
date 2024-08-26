const { body, validationResult } = require('express-validator')
const { apiResponse } = require('../helpers/apiResponse');
const Product = require('../models/productModel');
const { default: mongoose } = require('mongoose');
const { User } = require('../models/userModel');


exports.createProduct = [

    body('productName').notEmpty().withMessage('productName is required'),
    body('productDetail').notEmpty().withMessage('productDetail is required'),
    body('productPrice').notEmpty().withMessage('product Price is required'),
    body('quantity').notEmpty().withMessage('product quantity is required'),
    body('quality').notEmpty().withMessage('product quality is required'),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            const { email } = req.user;

            if (!errors.isEmpty()) {
                return apiResponse('fail', errors.array(), {}, 400, res)
            }

            const { productName, productDetail, productPrice, quantity, quality, } = req.body;
            const payload = {
                productName, productDetail, productPrice, quantity, quality,
            }
            const product = await Product.create({ ...payload })
            const productObjId = new mongoose.Types.ObjectId(product._id)
            console.log(product, productObjId, 'product and id of product', email);

            await Product.updateOne({
                email: email,
            }, {
                $push: {
                    users: productObjId
                }
            },
                { upsert: false, new: true }
            )

            product.save()

            apiResponse('success', 'Product Created Successfully', { ...payload }, 201, res)

        } catch (error) {
            apiResponse('error', error.message, {}, 500, res)
        }

    }


]


exports.loadAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('users').exec()
        console.log(products, 'produtcs');
        apiResponse('success', 'Products loaded successfully', products, 200, res);
    } catch (error) {
        apiResponse('error', error.message, {}, 500, res);
    }
};