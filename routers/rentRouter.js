const express = require('express');
const router = express.Router();
const rentController = require('../controllers/rentController');
const validateLogging = require('../middleware/validateLogging');
const validateRent = require('../middleware/validateRent');
const validateRole = require('../middleware/validateRole');



router.post('/',
    validateLogging.isLoggedIn,
    validateRent.validateRent(),
    validateRent.validateRequest,
    rentController.rentAdd);

// router.put('/:id',
//     validateLogging.isLoggedIn,
//     validateRole('o'),
//     itemController.itemUpdate);


// router.delete('/delete/:id', validateLogging.isLoggedIn, itemController.itemDelete);


module.exports = router;