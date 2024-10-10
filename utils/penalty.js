const pricing = require('../models/pricing');
const item = require('../models/item');


const calculatePenalties = (rental) => {
    let totalPenalties = 0;

    const lateDays = rental.lateDays
    totalPenalties += lateDays * priceModel.dailyLateFee; 

    if (rental.Status=='damaged') {
        if(rental.damageFee > rental.SecurityDeposit){
            totalPenalties += rental.damageFee-rentedItem.SecurityDeposit; 
        }
    }
    
    return totalPenalties;
  };

  const refundCash = async (rental) => {
    const rentedItem = await item.findItemById(rental.itemId);
    const customer = await user.findUserById(rental.customerId); 

    if (!rentedItem || !customer) {
        throw new Error("Rented item or customer not found.");
    }

    const penalties = await calculatePenalties(rental);
    let refundableAmount = 0;

    if (rental.Status=='good') {
           refundableAmount=rentedItem.SecurityDeposit-penalties
    }
  
    if (refundableAmount < 0) {
        refundableAmount = 0; 
    }

    customer.cashBalance += refundableAmount; 
    await customer.save(); 
    console.log(`Refunded $${refundableAmount} in cash to customer ${customer.UID}.`);

    return refundableAmount;
};


const chargeCustomerForPenalty = async (rental) => {
    const customer = await user.findUserById(rental.customerId); 
    if (!customer) {
        throw new Error("Customer not found.");
    }
    const penalties = await calculatePenalties(rental);

    if (penalties > 0) {
        if (customer.cashBalance >= penalties) {
            customer.cashBalance -= penalties; 
            await customer.save(); 
            console.log(`Charged customer ${customer.UID} a penalty of $${penalties}.`);
        } else {
            console.log(`Insufficient balance for customer ${customer.UID} to cover penalties. Current balance: $${customer.cashBalance}.`);
        }
    } else {
        console.log(`No penalties to charge for customer ${customer.UID}.`);
    }
};


  module.exports = {refundCash,chargeCustomerForPenalty,calculatePenalties };
  