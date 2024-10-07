const { promisify } = require('util');
const jwt = require('jsonwebtoken'); 
const sequelize = require('sequelize'); 
const { sequelize } = require("../models/config.js");
const AppError = require('../utils/AppError'); 

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET,
            );

            const userid = decoded.id; 
   
            const currentUser = await sequelize.query('SELECT * FROM users WHERE UID = :userid', {
                replacements: { userid },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!currentUser || currentUser.length === 0) {
                return next(); 
            }
            res.locals.user = currentUser[0]; 
            return next();
        } catch (err) {
            console.error('JWT verification failed:', err); 
            return next(); 
        }
    } else {
        return next(new AppError('You are not logged in, please log in', 401));
    }
};
