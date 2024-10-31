const jwt = require("jsonwebtoken");
require('dotenv').config();
const signToken = (id) => {
    const secretKey = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    return jwt.sign({id}, secretKey, {expiresIn});
};

const createSendToken = (user, statusCode, res) => {
    const userData = user
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
        return res.status(500).json({status: 'error', message: 'Internal server error'});
    }
};

module.exports = {createSendToken , signToken}