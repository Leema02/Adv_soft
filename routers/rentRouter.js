// const express = require('express');
// const router = express.Router();
// const rentController = require('../controllers/rentController');
// const validateLogging = require('../middleware/validateLogging');
// const validateRent = require('../middleware/validateRent');
// const validateRole = require('../middleware/validateRole');



// router.post('/',validateLogging.isLoggedIn,validateRole(['u'])
// ,validateRent.validateRent(),validateRent.validateRequest,rentController.rentAdd);
// router.delete('/:id', validateLogging.isLoggedIn,validateRole(['o']), rentController.rentDelete);

// router.get('/', validateLogging.isLoggedIn, rentController.rentList);
// router.get('/status/:status', validateLogging.isLoggedIn,validateRole(['o','e']), rentController.statusRentList);

// router.put('/:rentalId/status/:status',validateLogging.isLoggedIn,validateRole(['o']), rentController.updateRentStatus)



// module.exports = router;