const router = require('express').Router();
const User = require('../models/User');
const {existingUser} = require('../middlewares/userCheck');
const { passwordCheck, passwordValidator } = require('../middlewares/passwordValidator');
const { emailCheck, emailValidator } = require('../middlewares/emailValidator');
const { loginValidationMsg, validateUserSignIn } = require('../middlewares/loginValidation');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');


//REGISTER
router.post("/register", 
    passwordCheck, 
    passwordValidator, 
    emailCheck,
    emailValidator,
    existingUser, 
    async (req, res) => {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch(err) {
        res.status(500).json({alert: `something went wrong, ${err}`})
    }
});

//LOGIN
router.post("/login", validateUserSignIn, loginValidationMsg, async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        (!user) && res.status(401).json({alert: `user does'nt exist`});
        
        const encryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const originalPassword = encryptedPassword.toString(CryptoJS.enc.Utf8);
        (originalPassword !== req.body.password) && res.status(401).json('wrong credientials');

        
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, 
        process.env.JWT_SEC,
        {expiresIn: process.env.JWT_EXP}
        );

        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken})
        
    } catch (err) {
        res.status(500).json({alert: `something went wrong ${err}`})
    } 
});

module.exports = router;