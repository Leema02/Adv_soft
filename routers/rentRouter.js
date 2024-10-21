const express = require('express');
const router = express.Router();
const rentController = require('../controllers/rentController');
const extendRentController = require('../controllers/extendRentalController');

const validateLogging = require('../middleware/validateLogging');
const validateRent = require('../middleware/validateRent');
const validateRole = require('../middleware/validateRole');



router.post('/',validateLogging.isLoggedIn,validateRole(['u'])
,validateRent.validateRent(),validateRent.validateRequest,rentController.rentAdd);
router.delete('/:id', validateLogging.isLoggedIn,validateRole(['o']), rentController.rentDelete);

router.get('/', validateLogging.isLoggedIn, rentController.rentList);
router.get('/status/:status', validateLogging.isLoggedIn,validateRole(['o','e']), rentController.statusRentList);

router.put('/:rentalId/status/:status',validateLogging.isLoggedIn,validateRole(['o']), rentController.updateRentStatus)

router.post('/:rentalId/extendReq',validateLogging.isLoggedIn,validateRole(['u']), extendRentController.extendRental)
router.post('/:rentalId/extendRes',validateLogging.isLoggedIn,validateRole(['o']), extendRentController.respondToExtensionRequest)


// accepted rejected  owner 
//returned


//req inspect new inspection  send email attch pictures
//resp inspect 

//expert list inspect 

//inspect 

//good 
//bad




module.exports = router;