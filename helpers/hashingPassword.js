const bcrypt = require('bcryptjs');
exports.hashedPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

exports.comparePassword = async (actualPassword, hashedPassword) => {
    return await bcrypt.compare(actualPassword, hashedPassword)
}