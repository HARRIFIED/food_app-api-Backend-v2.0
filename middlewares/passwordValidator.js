const { check, validationResult, body } = require('express-validator');

exports.passwordCheck = [
    check('password')
        .not()
        .isEmpty()
        .withMessage('password is required')
        .isLength({ min: 8, max: 20})
        .withMessage('Password must be at least 8 characters long'),
];

exports.passwordValidator = (req, res, next) => {
    const result = validationResult(req).array();
    if (!result.length) return next();
    const error = result[0].msg;
    res.json({ success: false, message: error });
}