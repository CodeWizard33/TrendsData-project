const jwt = require("jsonwebtoken")

exports.isAuthenticated = (req, res, next) => {
    let accessToken = req.cookies?.accessToken
    const { MY_SECRET_KEY } = process.env

    if (!accessToken) return res.sendStatus(401)

    jwt.verify(accessToken, MY_SECRET_KEY, (error, payload) => {
        if (error) {
            return res.sendStatus(401)
        }
        req.user = payload;
        console.log(payload, 'global');
        next()
    })

}
