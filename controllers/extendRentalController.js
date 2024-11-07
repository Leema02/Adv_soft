const Rental = require('../models/rent');
const Item = require('../models/item');

const  sendEmail  = require('../utils/emailService');
const catchAsync = require('../utils/catchAsyn');
const priceCalculate = require('../utils/price');
const Income = require('../models/income');
const User = require('../models/user');



const extendRental =catchAsync( async (req, res) => {
    const rentalId=Number(req.params.rentalId)
    const {  newEndDate } = req.body;

    const rental = await Rental.findRentalById(rentalId);
    if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
    }
    if(rental.customerId!=res.locals.user.UID)
    {
        return res.status(404).json({ message: 'You are not authorized to request extension for this rent   ' });
    }
    if(rental.Status!='accept'){
        return res.status(404).json({ message: `Sorry you can not request extension for this rent as its status ${rental.Status}  `});
    }
    const conflictingRentals = await Rental.findAllRentalItemIn(rental.itemtId, rental.endDate, newEndDate);
    if (conflictingRentals.length != 0) {
        return res.status(400).json({ message: 'Item is not available for the requested extension' });
    }
    
    const { email } = await User.getEmailById(rental.customerId);

    await sendEmail(email, 'Rental Extension Request', `Customer ${res.locals.user.UName} with rental id ${rentalId} to item with id ${rental.itemtId}  has requested to extend the rental until ${newEndDate}.`);

    return res.status(200).json({ message: 'Extension request sent', rental });
 
});

const respondToExtensionRequest = async (req, res) => {
    const rentalId = Number(req.params.rentalId);
    const { newEndDate, response } = req.body;

    const rental = await Rental.findRentalById(rentalId);
    if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
    }

    const item = await Item.findItemById(rental.itemtId);
    const { email } = await User.getEmailById(rental.customerId);

    switch (response) {
        case 'accept':
            return await handleAcceptResponse(rental, item, email, newEndDate, res);
        case 'reject':
            return await handleRejectResponse(email, res);
        default:
            return res.status(400).json({ message: 'Invalid response (valid options: accept/reject)' });
    }
};

const handleAcceptResponse = async (rental, item, email, newEndDate, res) => {
    const prevEndDate = rental.endDate;
    const totalPriceBeforeExtend = await priceCalculate(rental.itemtId, rental.startDate, prevEndDate);
    const totalPriceAfterExtend = await priceCalculate(rental.itemtId, rental.startDate, newEndDate);
    
    const { expertShare, adminShare, ownerShare } = await User.getIncomeDistribution(item.ownerId);
    await Income.addIncome(
        rental.rentalId,
        totalPriceAfterExtend * expertShare,
        totalPriceAfterExtend * adminShare,
        totalPriceAfterExtend * ownerShare
    );

    const toPay = totalPriceAfterExtend - totalPriceBeforeExtend;
    await Rental.updateEndDate(rental.rentalId, newEndDate);

    await sendEmail(email, 'Rental Extension Accepted', 
        `Your extension request has been accepted until ${newEndDate}. The total price now is $${totalPriceAfterExtend}. The extra amount you need to pay is $${toPay}.`
    );

    return res.status(200).json({
        "message": "Rental Extension Accepted Successfully",
        ownerNotification: `An email has been sent to the customer with the following details: Extension accepted until: ${newEndDate} Total price: $${totalPriceAfterExtend} Extra amount to pay: $${toPay}`
    }
    
    );};

const handleRejectResponse = async (email, res) => {
    await sendEmail(email, 'Rental Extension Rejected', 'Your extension request has been rejected.');
    return res.status(200).json({ message: 'Rental Extension Rejected Successfully and email sent to the customer' });
};


  



module.exports = { extendRental, respondToExtensionRequest };
