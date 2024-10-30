const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validateLogging = require('../middleware/validateLogging');
const validateRole = require('../middleware/validateRole');
const validateCat = require('../middleware/validateCat');




router.post('/',
    validateLogging.isLoggedIn,
    validateCat.validateCat(),
    validateCat.validateRequest,
    validateRole(['a']),
    categoryController.categoryAdd);

router.put('/:id',
    validateLogging.isLoggedIn,
    validateCat.validateCat(),
    validateCat.validateRequest,
    validateRole(['a']),
    categoryController.categoryUpdate);

router.delete('/:id',
    validateLogging.isLoggedIn,
    validateRole(['a']),
    categoryController.categoryDelete);

router.get('/',categoryController.categoryList);




module.exports = router;