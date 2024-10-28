const express = require('express');
const inspectionController = require('../controllers/inspectionController');
const validateRole = require('../middleware/validateRole');
const validateLogging = require("../middleware/validateLogging");
const validateInspection = require('../middleware/validateInspection');
const router = express.Router();


router.get('/',validateLogging.isLoggedIn,validateRole(['e']),inspectionController.listInspections);
router.put('/:id/:status'
    ,validateLogging.isLoggedIn,
    validateRole(['e']),
    validateInspection.validateInspectionResponse,
    inspectionController.responseInspection);

module.exports = router;