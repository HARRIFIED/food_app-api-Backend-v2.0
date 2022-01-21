const { check, validationResult } = require('express-validator');

exports.emailCheck = [
    check('email')
        .not()
        .isEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('only valid email is required')
        .normalizeEmail(),   
];

exports.emailValidator = (req, res, next) => {
    const result = validationResult(req).array();
    if (!result.length) return next();

    const error = result[0].msg;
    res.json({ success: false, message: error });
}