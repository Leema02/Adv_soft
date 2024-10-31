const express = require('express');
const authController = require('../controllers/authController');
const validateLogging = require('../middleware/validateLogging');
const router = express.Router();


router.post('/signup', validateLogging.signupValidator(),validateLogging.validateSignUp,authController.signup);
router.post('/login', validateLogging.validateEmailUsername,authController.login);


module.exports = router;






