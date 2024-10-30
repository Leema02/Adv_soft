const { body, validationResult } = require('express-validator');

const validateDeliveryRequest = [
  body('rentalId').isInt({ min: 1 }).withMessage('rentalId must be a positive integer'),
  
  body('method').isIn(['p', 'd']).withMessage('method must be either "p" for pickup or "d" for delivery'),
  
  body('estimatedDeliveryTime').isFloat({ min: 0 }).withMessage('estimatedDeliveryTime must be a positive number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateDeliveryRequest;
