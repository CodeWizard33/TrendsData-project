const { body, validationResult } = require('express-validator')
const { apiResponse } = require('../helpers/apiResponse')
const { hashedPassword, comparePassword } = require('../helpers/hashingPassword')
const { generateToken } = require('../helpers/generateToken')
const { sendEmail } = require('../helpers/mailer')
const { User } = require('../models/userModel')

exports.signUp = [

    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return apiResponse('fail', errors.array(), {}, 400, res)
            }

            const { name, email, password } = req.body;

            console.log(name, email, password, 'req.body');

            const existingUser = await User.find({ email: email })
            console.log(existingUser, 'existing User');

            if (existingUser.length !== 0) {
                return apiResponse('fail', 'User already exists', {}, 400, res)
            }

            const hPassword = await hashedPassword(password)

            const payload = {
                email,
                name,
                password: hPassword
            }


            User.create(payload)

            sendEmail(payload)
            apiResponse('success', 'User Created Successfully', payload, 201, res)
        } catch (error) {
            apiResponse('error', error.message, {}, 500, res)
        }

    }


]

exports.signIn = [
    body("email").isEmail().withMessage('Please enter your email'),
    body("password").notEmpty().withMessage('Please enter your password'),
    async (req, res) => {
        try {
            const errors = validationResult(req)
            const { email, password, confirmPassword } = req.body

            if (!errors.isEmpty()) {
                return apiResponse('fail', errors.array(), {}, 400, res)
            }

            const isUserExist = await User.findOne({ email })

            if (!isUserExist) {
                return apiResponse('fail', "No User Found", {}, 400, res)
            }

            if (password !== confirmPassword) {
                return apiResponse('fail', "Password mismatch", {}, 400, res)
            }

            const checkPassword = await comparePassword(password, isUserExist.password)

            if (!checkPassword) {
                return apiResponse('fail', "invalid Password", {}, 400, res)
            }

            // jwt Token
            const token = generateToken({ email }, process.env.MY_SECRET_KEY, '8h')
            res.cookie('accessToken', token, { httpOnly: true, maxAge: 86400000 })

            const payload = {
                "id": isUserExist.id,
                "name": isUserExist.name,
                "email": isUserExist.email,
                token,
                "createdAt": "2024-07-25T05:10:19.095Z",
                "updatedAt": "2024-07-25T05:10:19.095Z",
                "__v": 0
            }

            return apiResponse('success', "User Login Successfully", payload, 200, res)

        } catch (error) {
            return apiResponse('fail', "server error", {}, 500, res)
        }
    }
]

exports.logout = async (_, res) => {
    res.clearCookie("accessToken")
    return apiResponse('success', "logout successfully!", {}, 201, res)
}

exports.resetPasswordRequest = [
    body("email").isEmail().withMessage('Please enter your email'),
    async (req, res) => {
        try {
            const { email } = req.body;

            const isUserExist = await User.findOne({ email })


            if (!isUserExist) {
                return apiResponse('fail', "No User Found", {}, 400, res)
            }

            const passwordToken = generateToken({ email }, process.env.MY_SECRET_KEY, '8h')

            isUserExist.token = passwordToken;
            await isUserExist.save()

            sendEmail({ email: isUserExist.email, token: passwordToken }, false)


            console.log(isUserExist, 'is user exists');
            return apiResponse('success', "Checkout your email", { isUserExist }, 201, res)


        } catch (error) {
            return apiResponse('fail', "server error", {}, 500, res)

        }
    }]

exports.passwordReset = [
    body('newPassword').notEmpty().withMessage('type your new password'),
    body('confirmPassword').notEmpty().withMessage('password mismatch!'),

    async (req, res) => {
        const errors = validationResult(req)
        const { newPassword, confirmPassword } = req.body;
        const { token } = req.params
        if (!errors.isEmpty()) {
            return apiResponse('fail', errors.array(), {}, 400, res)
        }

        const user = await User.findOne({ token })

        console.log(token, 'token');

        if (!user) {
            return apiResponse('fail', "No User Found", {}, 400, res)
        }

        if (newPassword !== confirmPassword) {
            return apiResponse('fail', "Password mismatch", {}, 400, res)
        }

        console.log(user, 'user---------------->');

        const hpassword = await hashedPassword(newPassword)

        // Update the user object and save it
        user.password = hpassword;
        user.token = null;

        // user.updateOne({ password: newPassword, token: null });

        await user.save()
        return apiResponse('success', "password updated successfully!", {}, 201, res)

    }
]

exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        if (!allUsers) {
            apiResponse('fail', "No Users were found", {}, 400, res)
        }
        apiResponse('success', "Users loaded Successfully", allUsers, 201, res)
        return
    } catch (error) {
        apiResponse('fail', "No Users were found", allUsers, 201, res)

    }
}











