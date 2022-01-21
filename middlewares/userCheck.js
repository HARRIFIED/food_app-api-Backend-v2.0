const User = require('../models/User');

const existingUser = async (req, res, next) => {
    const { email } = req.body
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(401).json({alert: 'User already exists'})
    }

    next();
}

module.exports = {existingUser}