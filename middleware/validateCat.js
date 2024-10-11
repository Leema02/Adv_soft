const {body , validationResult} = require('express-validator');



const validateCat = () =>  [
    body('catName').notEmpty().withMessage("Category name is required").isString().withMessage("Category name must be string")
];


const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


module.exports = {validateRequest , validateCat}