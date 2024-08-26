const express = require('express');
const { signUp, signIn, resetPasswordRequest, passwordReset, getAllUsers, logout, getnetflixData } = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/protectedRoutes');
const router = express.Router();

router.route('/sign-up').post(signUp)
router.route('/sign-in').post(signIn)
router.route('/forget-password-request').post(isAuthenticated, resetPasswordRequest)
router.route('/forget-password/:token').post(isAuthenticated, passwordReset)

router.route('/user').get(isAuthenticated, getAllUsers)
router.route('/logout').get(isAuthenticated, logout)

module.exports = router;

