const {body , validationResult} = require('express-validator');
const Category = require('../models/category');  
const { param } = require('express-validator');

const validateCat = () =>  [
    body('catName').notEmpty().withMessage("Category name is required").isString().withMessage("Category name must be string")
];


const validateCategory = () => [
    param('catID').isNumeric().withMessage('Category ID must be a valid number'),

    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const catId = req.params.catID;  
        try {
            const category = await Category.findByPk(catId);

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            next();
        } catch (error) {
            console.error("Error validating category:", error);
            return res.status(500).json({ error: 'An error occurred while validating the category' });
        }
    }
];


const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


module.exports = {validateRequest , validateCat, validateCategory}