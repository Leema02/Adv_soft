const express = require('express');
const router = express.Router();
const IncomeReport = require('../controllers/externalFeatureIncomeReport');
const validateLogging = require('../middleware/validateLogging');
const validateRole = require('../middleware/validateRole');


router.get('/thisMonth',validateLogging.isLoggedIn,validateRole(['a','o','e']),IncomeReport.getIncomeThisMonth);
router.get('/today',validateLogging.isLoggedIn,validateRole(['a','o','e']),IncomeReport.getIncomeReportToday);

router.get('/DoY/:year/:month/:day',validateLogging.isLoggedIn,validateRole(['a','o','e']),IncomeReport.getIncomeReportByDay);
router.get('/MoY/:year/:month',validateLogging.isLoggedIn,validateRole(['a','o','e']),IncomeReport.getIncomeReportByMonth);
router.get('/year/:year',validateLogging.isLoggedIn,validateRole(['a','o','e']),IncomeReport.getIncomeReportByYear);
router.get('/trends/:startYear/:endYear',validateLogging.isLoggedIn,validateRole(['a','o','e']),IncomeReport.getIncomeTrends);
router.get('/monthlyReport/:year',validateLogging.isLoggedIn,validateRole(['a','o','e']),IncomeReport.getMonthlyIncomeReport);




module.exports = router;
