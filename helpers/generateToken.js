const jwt = require('jsonwebtoken')
exports.generateToken = (payload, secretKey, expiresIn = '8h') => {
    return jwt.sign(payload, secretKey, { expiresIn })
}

exports.verifyRestPasswordToken = (token) => {
    if (!token) return false
    let flag = true
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (error, _payload) => {
        if (error) {
            flag = false
        }
    })
    return flag
}