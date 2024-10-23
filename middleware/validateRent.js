const {body, validationResult} = require('express-validator');


const validateRent = () => [
    body('itemId').notEmpty().withMessage("item Id is required").isNumeric().withMessage("item Id must be number")
    ,body('startDate')
    .notEmpty().withMessage("Start date is required")
    .isISO8601().withMessage("Start date must be a valid date (YYYY-MM-DD format)")
    .custom((value, { req }) => {
        const startDate = new Date(value);
        const endDate = new Date(req.body.endDate);
        if (endDate && startDate > endDate) {
            throw new Error('Start date must be before end date');
        }
        return true;
    })
    ,body('endDate')
    .notEmpty().withMessage("End date is required")
    .isISO8601().withMessage("End date must be a valid date (YYYY-MM-DD format)")
    .custom((value, { req }) => {
        const endDate = new Date(value);
        const startDate = new Date(req.body.startDate);
        if (startDate && endDate < startDate) {
            throw new Error('End date must be after start date');
        }
        return true;
    })
];


const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

module.exports={validateRequest,validateRent}