const Rental = require('../models/rental');
const { sendEmail } = require('../utils/emailService');
const catchAsync = require('../utils/catchAsyn');
const priceCalculate = require('../utils/price');
const rentUtil = require('../utils/rent');


const extendRental =catchAsync( async (req, res) => {
    const { rentalId, newEndDate } = req.body;

    const rental = await Rental.findRentalById(rentalId);
    if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
    }
    const conflictingRentals = await Rent.findAllRentalItemIn(itemId, currentEndDate, newEndDate);
    if (conflictingRentals.length != 0) {
        return res.status(400).json({ message: 'Item is not available for the requested extension' });
    }

    // sendEmail(rental.ownerId, 'Rental Extension Request', `Customer ${res.locals.user.UName} with rental id ${rentalId} has requested to extend the rental until ${newEndDate}.`);

    return res.status(200).json({ message: 'Extension request sent', rental });
 
});

const respondToExtensionRequest = async (req, res) => {
    const { rentalId,newEndDate, response } = req.body;

    const rental = await Rental.findRentalById(rentalId);
    if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
    }

    if (response === 'accept') {
        const totalPriceBeforeExtend = priceCalculate(rental.startDate, rental.endDate);
        const totalPriceAfterExtend = priceCalculate(rental.startDate, newEndDate);
        const toPay =totalPriceAfterExtend-totalPriceBeforeExtend;

        await Rental.updateEndDate(rental.rentalId,newEndDate);

        //sendEmail(rental.customerId, 'Rental Extension Accepted', `Your extension request has been accepted until ${newEndDate}. The total price now is $${totalPriceAfterExtend} the extra money you need to pay $${toPay}.`);
    } else if (response === 'reject') {
        rental.status = 'rejected';
        //  sendEmail(rental.customerId, 'Rental Extension Rejected', 'Your extension request has been rejected.');
    } else {
        return res.status(400).json({ message: 'Invalid response' });
    }

    return res.status(200).json({ message: 'Response recorded', rental });
    
};

  



module.exports = { extendRental, respondToExtensionRequest };
