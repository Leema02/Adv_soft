

const Rent = require('../models/rent');
const Item = require('../models/item');
const User = require('../models/user');
const Income = require('../models/income');


const Expert = require('../models/expert');
const  sendEmail  = require('../utils/emailService');
const  priceCalculate  = require('../utils/price');
const  calculateLateDays  = require('../utils/rent');


const inspectionController = require('../controllers/inspectionController');


const catchAsync = require('../utils/catchAsyn');
const bodyParser = require('body-parser');
const {refundCash} = require("../utils/penalty");

const rentAdd = catchAsync(async (req, res) => {
    const customerId=res.locals.user.UID
    const {itemId,startDate,endDate}=req.body
    const itemResult=await Item.findItemById(itemId)

    if (!itemResult ||!itemResult.itemId)
        res.status(400).json({errors: "there is no item with id " + itemId});

    if(!itemResult.Availability)
        res.status(400).json({errors: "sorry the item with id no avaliable right now" + itemId});

    const availabilityResult = await Rent.checkAvailableRent(itemId, startDate, endDate);

    if (!availabilityResult.available) {
        return res.status(400).json({
            error: "The item is not available for the full requested period.",
            availablePeriods: availabilityResult.availablePeriods,
            futureRentals: availabilityResult.futureRentals,
        });
    }

    const expertResult=await Expert.findExpertToAssign(itemResult.catId)
    
    const newRent=await Rent.rentAdd(customerId,itemId,expertResult.expertId,startDate,endDate);

    res.status(200).json({success: "rent with id " + newRent[0] + " has been created and its status is pending when accepeted an email is sent to you"});

});

const rentDelete = catchAsync(async (req, res) => {

    const id = Number(req.params.id);
    const ownerId=res.locals.user.UID

    const rentToDelete = await Rent.findRentalById(id);
    if (rentToDelete.length === 0)
        return res.status(400).json({errors: "there is no rent with id " + id});
    
    const itemRent = await Item.findItemById(rentToDelete.itemtId);
    if (itemRent.ownerId!=ownerId) {
        return res.status(400).json({errors: "You do not have permission to delete this rent."});
     }
    
    await Rent.rentDelete(id);
    return res.status(200).json({success: "rent with id " +id + " has been deleted successfully"});

});

const rentList = catchAsync(async (req, res) => {
   

     const id=res.locals.user.UID
     const role=res.locals.user.role
     const rents=await Rent.rentList(id,role);
    await Rent.rentDelete(id);
    return res.status(200).json({success: "rent with id " +id + " has been deleted successfully"});

});



const statusRentList = catchAsync(async (req, res) => {

     const id=res.locals.user.UID
     const status = req.params.status;
     console.log(status)
     const rents=await Rent.statusRentList(id,status);
    
     res.status(200).json(rents);
    
});


const updateRentStatus = catchAsync(async (req, res) => {
    const ownerId = res.locals.user.UID;
    const rentalId = Number(req.params.rentalId);
    const status = req.params.status;

    const rentToUpdate = await Rent.findRentalById(rentalId);
    if (!rentToUpdate) {
        return res.status(400).json({ errors: `There is no rent with ID ${rentalId}` });
    }

    const itemRent = await Item.findItemById(rentToUpdate.itemId);
    if (itemRent.ownerId !== ownerId) {
        return res.status(400).json({ errors: "You do not have permission to update this rent." });
    }

    await Rent.updateRentStatus(rentalId, status);
    const { email } = await User.getEmailById(rentToUpdate.customerId);

    switch (status) {
        case "accept":
            return await handleAcceptStatus(rentToUpdate, itemRent, email, rentalId, res);
        case "reject":
            return await handleRejectStatus(rentalId, itemRent, email, res);
        case "return":
            return await handleReturnStatus(rentToUpdate, email, req.body.inspection, res);
        default:
            return res.status(400).json({ errors: `Invalid status "${status}". Valid statuses are: accept, reject, return.` });
    }
});

const handleAcceptStatus = async (rentToUpdate, itemRent, email, rentalId, res) => {
    const price = await priceCalculate(rentToUpdate.itemtId, rentToUpdate.startDate, rentToUpdate.endDate);
    await createIncome(price, itemRent.ownerId, rentalId);
    await User.incLoyalty(rentToUpdate.customerId);
    await User.incLoyalty(itemRent.ownerId);

    await sendEmail(
        email,
        "Update Rent Status",
        `Your rent with ID ${rentalId} for item ${rentToUpdate.itemtId} status has been updated to accept. Your total price is ${price} for the period from ${rentToUpdate.startDate} to ${rentToUpdate.endDate}.`
    );

    return res.status(200).json({ success: "Status updated to accept and email sent successfully." });
};

const handleRejectStatus = async (rentalId, itemRent, email, res) => {
    await sendEmail(
        email,
        "Update Rent Status",
        `Sorry! Your rent with ID ${rentalId} for item ${itemRent.itemId} status has been updated to reject.`
    );

    return res.status(200).json({ success: "Status updated to reject and email sent successfully." });
};

const handleReturnStatus = async (rentToUpdate, email, inspectionField, res) => {
    await calculateLateDays(rentToUpdate);

    if (inspectionField) {

        const insp = await inspectionController.openInspection(rentToUpdate.rentalId, email, inspectionField.imagePath);
        if (insp && insp.error !== undefined) {
            res.status(400).json(insp);
            return;
        }
        await sendEmail(email, "Inspection Scheduled", "An expert will inspect your returned item.");
        res.status(200).json({ message: "Inspection scheduled. Await expert feedback." });
        return;
    } else {
        await refundCash(rentToUpdate);
        await sendEmail(email, "Item Returned Successfully", `Refund processed.`);
        res.status(200).json({ message: "Item returned and refund processed." });
        return;
    }
};


const createIncome=async(totalPrice,ownerId,rentalId)=>{

    const { expertShare, adminShare, ownerShare } =await User.getIncomeDistribution(ownerId);

    await Income.addIncome( rentalId,  totalPrice * expertShare,totalPrice * adminShare,totalPrice * ownerShare,);

}

 module.exports = {rentList,rentAdd,rentDelete,rentList,statusRentList,updateRentStatus};


