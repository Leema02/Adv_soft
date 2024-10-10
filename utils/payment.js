const pricing = require('../models/pricing');
const item = require('../models/item');


const calculatePenalties = (rental) => {
    let totalPenalties = 0;
  
    const currentDate = new Date();
    const endDate = new Date(rental.endDate);
    const rentedItem=item.findItemById(rental.itemtId)
    const priceModel=pricing.findPriceModelById(rentedItem.priceModelId)
    
    if (currentDate > endDate) {
      const lateDays = Math.ceil((currentDate - endDate) / (1000 * 60 * 60 * 24));
      totalPenalties += lateDays * priceModel.dailyLateFee; 
    }
  
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


  
  
  
  
  module.exports = {refundCash,chargeCustomerForPenalty,calculatePenalties, };
  