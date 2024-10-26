const express = require('express');
const router = express.Router();
const validateRole = require('../middleware/validateRole');
const expertController = require('../controllers/expertController');
const expertValidator = require('../middleware/validateExpert');
const validateLogging = require("../middleware/validateLogging");

router.post('/:id/:catId',
    validateLogging.isLoggedIn,
    validateRole(['a']),
    expertValidator.validateAssignExpert
    ,expertController.assignExpert);


module.exports = router;