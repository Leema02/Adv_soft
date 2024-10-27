const inspection = require('../models/inspection');
const rental = require('../models/rent');
const User = require('../models/user');
const Item = require('../models/item');
const Expert = require('../models/expert');
const catchAsync = require('../utils/catchAsyn');
const sendEmail = require("../utils/emailService");
const {findInspectionById} = require("../models/inspection");
const {findRentalById} = require("../models/rent");
const penalty = require('../utils/penalty');

const openInspection = async (rentalId, ownerEmail, imagePath) => {

    if (!imagePath) {
        return {error: "you have to specify iamge if you want to open inspection"};
    }

    const rent = await rental.findRentalById(rentalId);
    const user = await User.findUserByEmail(ownerEmail);

    const item = await Item.findItemById(rent.itemId);
    const expert = await Expert.findExpertToAssign(item.catId);

    await inspection.addInspection(rentalId, expert.expertId, imagePath);


};

const listInspections = catchAsync(async (req, res) => {
    const expertId = res.locals.user.UID;

    const results = await inspection.getInspections(expertId);

    res.status(200).json({result : results});
});

const responseInspection = catchAsync(async(req , res) => {
    const inspectionId = req.params.id;
    const status = req.params.status;

    await inspection.editInspectionStatus(inspectionId , status);

    const insp2 = await inspection.findInspectionById(inspectionId);
    const rent = await rental.findRentalById(insp2.rentalId);
    const item = await Item.findItemById(rent.itemId);

    const ownerEmail = await User.getEmailById(item.ownerId);
    const customerEmail = await User.getEmailById(rent.customerId);

    if(status === 'true'){
        await sendEmail(ownerEmail.email, "Rent Refund", "An inspection was closed and your request is succesful");
        await sendEmail(customerEmail.email, "Rent Refund", "An inspection was closed and you have to pay secuirity deposit");
        await penalty.refundCash(rent);
    }
    else{
        await sendEmail(ownerEmail.email, "Rent Refund", "An inspection was closed and your request is failed");
        await sendEmail(customerEmail.email, "Rent Refund", "An inspection was closed and you do not have to pay secuirity deposit");
        await penalty.refundCash(rent);
    }
    res.status(200).json({result : "inspection " + inspectionId + " have been edited"});
});

module.exports = {openInspection, listInspections,responseInspection}