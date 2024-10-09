const {body, validationResult} = require('express-validator');
const {isNumber} = require("util");


const validateItems = () => [
    body('catId').notEmpty().withMessage("Category Id is required").isNumeric().withMessage("Cat ID must be number")
    , body('priceModel.dailyRate').isFloat({min: 0}).withMessage("daily rate must be float")
    , body("priceModel.weeklyRate").isFloat({min: 0}).withMessage("weekly rate must be float")
    , body("priceModel.monthlyRate").isFloat({min: 0}).withMessage("monthly rate must be float")
    , body("priceModel.discountRate").isFloat({min: 0}).withMessage("discount rate must be float")
    , body('itemName').notEmpty().withMessage('Item name is required').isString().withMessage('Item name must be a string')
    , body('Availabilty').isBoolean().withMessage('Availability must be true or false')
    , body('Description').optional().isString().withMessage('Description must be a string')
    , body('conditionBefore').optional().isString().withMessage('Condition before must be a string')
    , body('SecuirityDeposit').isFloat({min: 0}).withMessage('Security deposit must be a positive number')
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

const identifyPriceWayAndValidate = (req, res, next) => {
    const rate = req.params.way;

    if (rate !== 'week' && rate !== 'day' && rate !== 'month') {
        res.status(400).json({error: "day or week or month is accepted !"});
        return;
    }

    const min = parseFloat(req.params.min);
    const max = parseFloat(req.params.max);

    if(!Number.isFinite(min) || !Number.isFinite(max)){
        res.status(400).json({error : "min and max must be numbers"});
        return;
    }

    next();
};

module.exports = {validateRequest, validateItems, identifyPriceWayAndValidate}