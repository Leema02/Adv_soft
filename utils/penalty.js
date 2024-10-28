const pricing = require('../models/pricing');
const item = require('../models/item');
const User = require('../models/user');
const inspection = require('../models/inspection');
const refund = require('../models/refund');


const calculatePenalties = async (rental) => {
    let totalPenalties = 0;
    const rentedItem = await item.findItemById(rental.itemId);

    const lateDays = rental.lateDays;
    const priceModel = await pricing.findPriceModelById(rentedItem.priceModelId);
    totalPenalties += lateDays * priceModel.dailyLateFee;


    const insp = await inspection.findInspectionByRentId(rental.rentalId);

    if (rental.Status == 'return' && insp && insp.Status == true) {
        if (rental.damageFee > rentedItem.SecurityDeposit) {
            totalPenalties += rental.damageFee - rentedItem.SecurityDeposit;
        }
    }

    return totalPenalties;
};

const refundCash = async (rental) => {
    const rentedItem = await item.findItemById(rental.itemId);
    const customer = await User.findUserById(rental.customerId);

    if (!rentedItem || !customer) {
        throw new Error("Rented item or customer not found.");
    }

    const penalties = await calculatePenalties(rental);
    let refundableAmount = 0;

    const insp = await inspection.findInspectionByRentId(rental.rentalId);


    if (rental.Status == 'return' && insp && insp.Status == false) {
        refundableAmount = rentedItem.SecurityDeposit - penalties
    }

    if (refundableAmount < 0) {
        refundableAmount = 0;
    }
    console.log(penalties);
    customer.cashBalance += refundableAmount;
    await User.updateCash(customer.UID, customer.cashBalance);

    console.log(`Refunded $${refundableAmount} in cash to customer ${customer.UID}.`);
    console.log('cash balance : '+customer.cashBalance)
    await refund.addRefund(rental.customerId, rental.rentalId, refundableAmount);

    return refundableAmount;
};


const chargeCustomerForPenalty = async (rental) => {
    const customer = await User.findUserById(rental.customerId);
    if (!customer) {
        throw new Error("Customer not found.");
    }
    const penalties = await calculatePenalties(rental);

    if (penalties > 0) {
        if (customer.cashBalance >= penalties) {
            customer.cashBalance -= penalties;
            await User.updateCash(customer.UID, customer.cashBalance);
            console.log(`Charged customer ${customer.UID} a penalty of $${penalties}.`);
        } else {
            console.log(`Insufficient balance for customer ${customer.UID} to cover penalties. Current balance: $${customer.cashBalance}.`);
        }
    } else {
        console.log(`No penalties to charge for customer ${customer.UID}.`);
    }
};


module.exports = {refundCash, chargeCustomerForPenalty, calculatePenalties};
  