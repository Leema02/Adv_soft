const express = require('express');
const inspectionController = require('../controllers/inspectionController');
const validateRole = require('../middleware/validateRole');
const validateLogging = require("../middleware/validateLogging");
const router = express.Router();


router.get('/',validateLogging.isLoggedIn,validateRole(['e']),inspectionController.listInspections);

module.exports = router;