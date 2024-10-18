const express = require('express');
const router = express.Router();
const rentController = require('../controllers/rentController');
const validateLogging = require('../middleware/validateLogging');
const validateRent = require('../middleware/validateRent');
const validateRole = require('../middleware/validateRole');



router.post('/',validateLogging.isLoggedIn,validateRole('o')
,validateRent.validateRent(),validateRent.validateRequest,rentController.rentAdd);



router.delete('/:id', validateLogging.isLoggedIn,validateRole('o'), rentController.rentDelete);
router.get('/', validateLogging.isLoggedIn, rentController.rentList);



module.exports = router;