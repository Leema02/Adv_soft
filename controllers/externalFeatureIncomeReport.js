
const Rent = require('../models/rent');
const Income = require('../models/income');
const catchAsync = require('../utils/catchAsyn');
const moment = require('moment');
const  sendEmail  = require('../utils/emailService');


const getIncomeField=async(userRole)=>{
    if (userRole === 'a') { 
        incomeField = 'adminShare';
      } else if (userRole === 'o') { 
        incomeField = 'ownertShare';
      } else if (userRole === 'e') { 
        incomeField = 'expertShare';
      } 
      return incomeField

}

const getIncomeThisMonth=catchAsync(async(req,res)=>{

    const id=res.locals.user.UID
    const userRole=res.locals.user.role

    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    let incomeField = await getIncomeField(userRole); 

    const totalIncome = await Income.getTotalIncomeIn(incomeField,startOfMonth,endOfMonth,id,userRole)
    const rentThisMonth=await Rent.getRentRecordsForMonth(startOfMonth,endOfMonth, id, userRole)

    
    res.status(200).json({
        success: true,
        message: 'Income report for this month retrieved successfully',
        data: {
            userId: id,
            userRole: userRole,
            totalIncome: totalIncome.totalIncome || 0, // Safely accessing the total income
            startOfMonth,
            endOfMonth,
            rentThisMonth,
        }
    });
});

const getIncomeReportByMonth=catchAsync(async(req,res)=>{

    const id=res.locals.user.UID
    const userRole=res.locals.user.role
    const month=Number(req.params.month)
    const year=Number(req.params.year)


    let incomeField = await getIncomeField(userRole); 

    const startOfMonth = new Date(year, month - 1, 1); // month - 1 because months are 0-indexed
    const endOfMonth = new Date(year, month, 0, 23, 59, 59); // Last day of the month

    const totalIncome = await Income.getTotalIncomeIn(incomeField,startOfMonth,endOfMonth,id,userRole)
    const rentThisMonth=await Rent.getRentRecordsForMonth(startOfMonth,endOfMonth, id, userRole)

    res.status(200).json({
        success: true,
        message: 'Income report for the month retrieved successfully',
        data: {
            userId: id,
            userRole: userRole,
            year,
            month,
            totalIncome: totalIncome.totalIncome || 0, // Safely accessing the total income
            startOfMonth,
            endOfMonth,
            rentThisMonth,
        }
    });  
});


const getIncomeReportByYear=catchAsync(async(req,res)=>{

    const id=res.locals.user.UID
    const userRole=res.locals.user.role
    const year=Number(req.params.year)


    let incomeField = await getIncomeField(userRole); 

    const startOfYear = new Date(year, 0, 1); // January 1st of the year
    const endOfYear = new Date(year + 1, 0, 0, 23, 59, 59); // December 31st of the year

    const totalIncome = await Income.getTotalIncomeIn(incomeField, startOfYear, endOfYear,id,userRole);
    const rentThisYear = await Rent.getRentRecordsForMonth(startOfYear, endOfYear, id, userRole);

    res.status(200).json({
        success: true,
        message: 'Income report for the year retrieved successfully',
        data: {
            userId: id,
            userRole: userRole,
            year,
            totalIncome: totalIncome.totalIncome || 0, // Safely accessing the total income
            startOfYear,
            endOfYear,
            rentThisYear,
        }
    });  
});

const getIncomeReportByDay=catchAsync(async(req,res)=>{

    const id=res.locals.user.UID
    const userRole=res.locals.user.role
    const month=Number(req.params.month)
    const year=Number(req.params.year)
    const day=Number(req.params.day)


    let incomeField = await getIncomeField(userRole); 

    const startOfDay = new Date(year, month - 1, day, 0, 0, 0); // Start of the day (00:00:00)
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59); // End of the day (23:59:59)

    const totalIncome = await Income.getTotalIncomeIn(incomeField,startOfDay,endOfDay,id,userRole)
    const rentThisDay = await Rent.getRentRecordsForMonth(startOfDay, endOfDay, id, userRole);

    res.status(200).json({
        success: true,
        message: 'Income report for the day retrieved successfully',
        data: {
            userId: id,
            userRole: userRole,
            startOfDay,
            endOfDay,
            totalIncome: totalIncome.totalIncome || 0, // Safely accessing the total income
            startOfDay,
            rentThisDay,
        }
    });  
});

const getIncomeReportToday=catchAsync(async(req,res)=>{

    const id=res.locals.user.UID
    const userRole=res.locals.user.role
   

    let incomeField = await getIncomeField(userRole); 

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0); // Start of today (00:00:00)
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59); // End of today (23:59:59)

    const totalIncome = await Income.getTotalIncomeIn(incomeField,startOfDay,endOfDay,id,userRole)
    const rentThisDay = await Rent.getRentRecordsForMonth(startOfDay, endOfDay, id, userRole);

    res.status(200).json({
        success: true,
        message: 'Income report for the today retrieved successfully',
        data: {
            userId: id,
            userRole: userRole,
            startOfDay,
            endOfDay,
            totalIncome: totalIncome.totalIncome || 0, // Safely accessing the total income
            startOfDay,
            rentThisDay,
        }
    });  
});

const getIncomeTrends = catchAsync(async (req, res) => {
    const id = res.locals.user.UID;
    const userRole = res.locals.user.role;

    const startYear = Number(req.params.startYear);
    const endYear = Number(req.params.endYear);
    console.log(startYear,endYear);
    

    const trends = await Income.getIncomeTrends(startYear, endYear, userRole,id,userRole);

    res.status(200).json({
        success: true,
        message: 'Income trends retrieved successfully',
        data: {
            userId: id,
            userRole: userRole,
            startYear,
            endYear,
            trends,
        }
    });
});

const getMonthlyIncomeReport = catchAsync(async (req, res) => {
    const id = res.locals.user.UID;
    const userRole = res.locals.user.role;

    const year = Number(req.params.year);

    const monthlyReport = await Income.getMonthlyIncomeReport(year, userRole, id);

    res.status(200).json({
        success: true,
        message: 'Monthly income report retrieved successfully',
        data: {
            userId: id,
            userRole: userRole,
            year,
            monthlyReport,
        }
    });
});










module.exports={getIncomeThisMonth,getIncomeReportByMonth,getIncomeReportByYear,
    getIncomeReportByDay,getIncomeReportToday,getIncomeTrends,getMonthlyIncomeReport}

