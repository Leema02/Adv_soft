const express = require('express');
const router = express.Router();
const itemavaController = require('../controllers/itemavaController');
const  identifyAvailabilityAndValidate = require('../middleware/validateItemAvailability');

// Route to filter items by category and availability
router.get('/item/:catID/list/ava/:availability', identifyAvailabilityAndValidate.identifyAvailabilityAndValidate, itemavaController.filterItemsByAvailability);

module.exports = router;
