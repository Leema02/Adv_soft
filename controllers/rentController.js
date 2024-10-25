const Rent = require('../models/rent');
const Item = require('../models/item');
const User = require('../models/user');

const Expert = require('../models/expert');
const  sendEmail  = require('../utils/emailService');
const  priceCalculate  = require('../utils/price');
const  calculateLateDays  = require('../utils/rent');




const catchAsync = require('../utils/catchAsyn');
const bodyParser = require('body-parser');

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
    // const receiver = 's12112422@stu.najah.edu';
    // const subject = 'Welcome to our service';
    // const message = 'Welcome! We are glad to have you.';

    // try {
    //     // This should call sendEmail
    //     await sendEmail( receiver, subject, message);
    //     console.log("Email send function called."); // This will confirm the call
    // } catch (error) {
    //     console.error(`Error sending email: ${error.message}`);
    //     return res.status(500).json({ error: "Failed to send email." });
    // }

     const id=res.locals.user.UID
     const role=res.locals.user.role
     const rents=await Rent.rentList(id,role);
    
     res.status(200).json(rents);
    
    });

const statusRentList = catchAsync(async (req, res) => {

     const id=res.locals.user.UID
     const status = req.params.status;
     console.log(status)
     const rents=await Rent.statusRentList(id,status);
    
     res.status(200).json(rents);
    
});

const updateRentStatus= catchAsync(async (req, res) => {

    const ownerId=res.locals.user.UID
    const status = req.params.status;
    const rentalId = req.params.rentalId;

    const rentToUpdate = await Rent.findRentalById(rentalId);
    if (!rentToUpdate)
        return res.status(400).json({errors: "there is no rent with id " + rentalId});
    
    const itemRent = await Item.findItemById(rentToUpdate.itemtId);
    if (itemRent.ownerId!=ownerId) {
        return res.status(400).json({errors: "You do not have permission to update this rent."});
     }
    const rents=await Rent.updateRentStatus(rentalId,status);


    if(status=="accept")
    {
        const price=await priceCalculate(rentToUpdate.itemtId,rentToUpdate.startDate,rentToUpdate.endDate)
        await sendEmail("s12112422@stu.najah.edu","Update rent Status",`your rent with id  ${rentalId} to item ${rentToUpdate.itemtId} status update to ${status} your total price is ${price} for period from ${rentToUpdate.startDate} to ${rentToUpdate.endDate}`)
        await User.incLoyalty(rentToUpdate.customerId)
        
    }
    else if(status=="reject")
    {
        await sendEmail("s12112422@stu.najah.edu","Update rent Status",`Sorry!!,your rent with id  ${rentalId} to item ${rentToUpdate.itemtId} status update to ${status}`)
    
    }
    else if (status === "return") {
        const inspectionRequired = req.body.inspection; 
        await calculateLateDays(rentToUpdate)

        if (inspectionRequired) {
            await sendEmail("s12112422@stu.najah.edu", "Inspection Scheduled", "An expert will inspect your returned item.");
            return res.status(200).json({ message: "Inspection scheduled. Await expert feedback." });
        } else {
           // const refund = calculateRefund(rentToUpdate.securityDeposit);
            await sendEmail("s12112422@stu.najah.edu", "Item Returned Successfully", `Refund processed: `);
            return res.status(200).json({ message: "Item returned and refund processed." });
        }
    }
    else {
        return res.status(400).json({errors: "there is no status  " + status+" your status should be (accept / reject / return)"});
    }

    return res.status(200).json(rents);



});


module.exports = {rentList,rentAdd,rentDelete,rentList,statusRentList,updateRentStatus};


