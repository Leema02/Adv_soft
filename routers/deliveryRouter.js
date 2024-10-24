const express = require('express');
const router = express.Router();
const { requestDeliveryOrPickup } = require('../controllers/deliveriesController');
const validateDeliveryRequest = require('../middleware/validateDeliveryRequest');

router.post('/request-delivery', validateDeliveryRequest, requestDeliveryOrPickup);

module.exports = router;
