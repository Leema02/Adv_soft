const { sequelize } = require("../models/config.js");
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const validator = require('validator');    // To validate the email
const { body,validationResult } = require('express-validator');
const catchAsync = require('../utils/catchAsyn');
const AppError = require('../utils/AppError');
require('dotenv').config();

const signToken = (id) => {
    const secretKey = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    return jwt.sign({ id }, secretKey, { expiresIn });
};

const createSendToken = (user, statusCode, res) => {
const userData=user
    const responseData = {
        UID: userData.UID,
        UName: userData.UName,
        Email: userData.Email,
        Mobile: userData.Mobile,
        City: userData.City,
        Street: userData.Street,
        UPoints: userData.UPoints,
        avgRating: userData.avgRating,
        loyalty: userData.loyalty,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
    };

    try {
        const token = signToken(user.UID);
        console.log('Token:', token); // Log token for debugging

        console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);

        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure only in production
        };

        res.cookie('jwt', token, cookieOptions);
        res.status(statusCode).json({
            status: 'success',
            token,
            data: {
                user: responseData, // Return the userData object
            },
        });
    } catch (error) {
        console.error('Error signing token:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


exports.login = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return next(new AppError('Please provide either email or username and password!', 400));
  }

  let query;
  let replacements = {};
  if (email) {
    if (!validator.isEmail(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }
    query = `SELECT * FROM Users WHERE Email = :email LIMIT 1`;
    replacement = { email };
  } else if (username) {
    query = `SELECT * FROM Users WHERE UName = :username LIMIT 1`;
    replacement = { username };
  }

  const result = await sequelize.query(query, {
    replacements:replacement,
    type: sequelize.QueryTypes.SELECT
  });

  const user = result[0]; 
  const hashedPassword = await argon2.hash(password);


  const isPasswordValid = await argon2.verify(hashedPassword, password);

  if (!user || !isPasswordValid) {
    return next(new AppError('Incorrect email/username or password', 401));
  }

  createSendToken(user, 200, res);
});


exports.signupValidator = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Must be a valid email address').notEmpty().withMessage('Email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').notEmpty().withMessage('Password is required'),
    body('mobile').optional().isMobilePhone().withMessage('Must be a valid mobile number'), // Optional mobile validation
    body('city').optional().isString().withMessage('Address must be a string'), // Optional address validation
    body('street').optional().isString().withMessage('Address must be a string'), // Optional address validation
    body('role')
    .isIn(['u', 'a', 'e','o']) // Specify allowed roles
    .withMessage('Role must be either user(u), admin(a),owner(o) or expert(e)'),
  body('catId')
    .optional() // Only required if role is expert
    .isInt({ min: 1 }).withMessage('Category ID must be a positive integer')
  ];

exports.signup =
   catchAsync(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map(error => error.msg).join(', '), 400));
    }

    const { username, email, mobile,city,street,role, password,passwordConf,catId  } = req.body;

    if (password!=passwordConf) {
      return next(new AppError('Password must Match!!!', 400));
    }
  
    const queryUser = `SELECT * FROM users WHERE UName = :username `;
    const queryEmail = `SELECT * FROM users WHERE Email = :email `;


console.log(username)
const result1 = await sequelize.query(queryUser, {
    replacements: { username }, // Use 'replacements' option correctly
    type: sequelize.QueryTypes.SELECT
});

const result2 = await sequelize.query(queryEmail, {
    replacements: { email }, // Use 'replacements' option correctly
    type: sequelize.QueryTypes.SELECT
});

    if (result1.length > 0) {
        return next(new AppError('Username is already in use by another account', 400));
    }
    if (result2.length > 0) {
        return next(new AppError('Email address is already in use by another account', 400));
    }

    const hashedPassword = await argon2.hash(password);

    try {
        await sequelize.query(
          'INSERT INTO users (UName, Email, Password, Mobile, City, Street, role) VALUES (:username, :email, :password, :mobile, :city, :street, :role)',
          {
            replacements: { username, email, password: hashedPassword, mobile, city, street, role },
            type: sequelize.QueryTypes.INSERT,
          }
        );
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Mobile number already exists' });
        } else {
          console.error("SQL Error:", error);
          return res.status(500).json({ message: 'Database operation failed' });
        }
      }
      
      const newUser = await sequelize.query('SELECT * FROM users WHERE UName = :username', {
        replacements: { username },
        type: sequelize.QueryTypes.SELECT,
    });
    
    // Check if a user was found
    if (newUser.length === 0) {
        console.log('User not found');
    } else {
        const user = newUser[0]; // Access the first user object
        console.log(newUser.UID); // Now this should print the UID correctly
    }
    
    if (role === 'e' && catId) {
        await Expert.create({
          expertId: newUser.UID, // Associate with the new user's UID
          catId: catId // Set the category ID
        });
      }

    createSendToken(newUser[0], 201, res); // Adjust response status as necessary
  });
