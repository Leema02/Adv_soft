const {sequelize} = require("../models/config.js");
const User = require('../models/user');
const Expert = require('../models/expert');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const validator = require('validator');    // To validate the email
const catchAsync = require('../utils/catchAsyn');
const AppError = require('../utils/AppError');
const {createSendToken, signToken} = require('../utils/token');
require('dotenv').config();


exports.login = catchAsync(async (req, res) => {
    const {email, username, password} = req.body;


    const user = await User.loginFunc(username, email, password);
    const hashedPassword = await argon2.hash(password);


    const isPasswordValid = await argon2.verify(hashedPassword, password);

    if (!user || !isPasswordValid) {
        return next(new AppError('Incorrect email/username or password', 401));
    }

    createSendToken(user, 200, res);
});


exports.signup = catchAsync(async (req, res) => {

    const {username, email, mobile, city, street, role, password, passwordConf, catId} = req.body;

    const result1 = await User.findUserByUsername(username);

    const result2 = await User.findUserByEmail(email);

    if (result1) {
        return next(new AppError('Username is already in use by another account', 400));
    }
    if (result2) {
        return next(new AppError('Email address is already in use by another account', 400));
    }

    const hashedPassword = await argon2.hash(password);

    await User.addUser(username, email, hashedPassword, mobile, city, street, role);

    const newUser = await User.findUserByUsername(username);

    if (role === 'e' && catId) {
        await Expert.addExpert(newUser.UID, catId);
    }

    createSendToken(newUser[0], 201, res); // Adjust response status as necessary
});