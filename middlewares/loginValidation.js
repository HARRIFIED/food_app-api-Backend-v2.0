const { check, validationResult, body } = require('express-validator');

exports.validateUserSignIn = [
  check('email')
    .isEmail().withMessage('email / password is required!'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('email / password is required!'),
];

exports.loginValidationMsg = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};