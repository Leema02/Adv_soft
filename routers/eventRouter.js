const express = require('express');
const eventController = require('../controllers/eventController');
const validateEvent = require('../middleware/validateEvent');
const validateLogging = require('../middleware/validateLogging');
const validateRole = require('../middleware/validateRole');


const router = express.Router();

router.post('/', validateLogging.isLoggedIn,validateRole('a'),
   validateEvent.validateEvents(), validateEvent.validateRequest, eventController.eventAdd);
router.put('/:id', validateLogging.isLoggedIn,validateRole('a'), eventController.eventUpdate);
router.delete('/:id', validateLogging.isLoggedIn,validateRole('a'), eventController.eventDelete);
router.get('/list', eventController.eventList);

module.exports = router;
