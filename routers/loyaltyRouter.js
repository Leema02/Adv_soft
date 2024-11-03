const express = require('express');
const router = express.Router();
const LoyaltyController = require('../controllers/LoyaltyController');
const  validateCategory  = require('../middleware/validateCategory');

router.get('/item/:catID/list', validateCategory.validateCategory, LoyaltyController.listItemsByLoyalty);

module.exports = router;
