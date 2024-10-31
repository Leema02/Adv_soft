const {promisify} = require('util');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {sequelize} = require("../models/config.js");
const AppError = require('../utils/AppError');
const validator = require("validator");
const {body, validationResult} = require('express-validator');

const isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET,
            );

            const userid = decoded.id;

            const currentUser = await User.findUserById(userid);

            if (!currentUser || currentUser.length === 0) {
                return next();
            }
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            console.error('JWT verification failed:', err);
            return next();
        }
    } else {
        return next(new AppError('You are not logged in, please log in', 401));
    }
    next();
};

const validateEmailUsername = (req, res, next) => {
    const {email, username, password} = req.body;

    if ((!email && !username) || !password) {
        return next(new AppError('Please provide either email or username and password!', 400));
    }

    if (email) {
        if (!validator.isEmail(email)) {
            return next(new AppError('Please provide a valid email address', 400));
        }
    }
    next();

}
const validateSignUp = (req , res , next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(errors.array().map(error => error.msg).join(', '), 400));
    }

    const {password, passwordConf} = req.body;

    if (password != passwordConf) {
        return next(new AppError('Password must Match!!!', 400));
    }
    next();
};
const signupValidator = () => [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Must be a valid email address').notEmpty().withMessage('Email is required'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long').notEmpty().withMessage('Password is required'),
    body('mobile').optional().isMobilePhone().withMessage('Must be a valid mobile number'),
    body('city').optional().isString().withMessage('Address must be a string'),
    body('street').optional().isString().withMessage('Address must be a string'),
    body('role')
        .isIn(['u', 'a', 'e', 'o'])
        .withMessage('Role must be either user(u), admin(a),owner(o) or expert(e)'),
    body('catId')
        .optional()
        .isInt({min: 1}).withMessage('Category ID must be a positive integer')
];


module.exports = {isLoggedIn, validateEmailUsername,signupValidator,validateSignUp};