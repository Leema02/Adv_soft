const express = require('express');
const router = express.Router();
const { requestDeliveryOrPickup } = require('../controllers/deliveriesController');
const { trackDeliveryStatus } = require('../controllers/deliveriesController');
const validateDeliveryRequest = require('../middleware/validateDeliveryRequest');
const validateRentalId = require('../middleware/validateDelivrtiesRentalId');
const { updateDeliveryStatus } = require('../controllers/deliveriesController');
const validateUpdateDeliveryStatus = require('../middleware/validateUpdateDeliveryStatus');

router.post('/request-delivery', validateDeliveryRequest, requestDeliveryOrPickup);
router.get('/track-delivery/:rentalId',validateRentalId, trackDeliveryStatus);
router.patch('/update-delivery-status/:deliveryId', validateUpdateDeliveryStatus, updateDeliveryStatus);

module.exports = router;
