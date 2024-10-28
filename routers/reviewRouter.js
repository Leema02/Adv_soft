const express = require('express');
const validateRole = require('../middleware/validateRole');
const validateLogging = require("../middleware/validateLogging");
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const validateReview = require('../middleware/validateReview');
router.post('/',
    validateLogging.isLoggedIn,
    validateRole(['u']),
    validateReview.validateMakeReview,
    reviewController.makeReview
    );

router.get('/',
    validateLogging.isLoggedIn,
    validateRole(['u']),
    reviewController.ListItemsToReview
);

router.get('/list',
    validateLogging.isLoggedIn,
    validateRole(['u']),
    reviewController.ListItemsReviewed
);
module.exports = router;