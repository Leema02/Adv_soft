const pricing = require('../models/pricing');
const item = require('../models/item');

const priceCalculate = async (itemId, startDate, endDate) => {
    const priceModelId = await item.getPriceModelId(itemId);
    const priceModel = await pricing.findPriceModelById(priceModelId);

    const millisecondsInDay = 1000 * 60 * 60 * 24;
    let durationInDays = Math.ceil((new Date(endDate) - new Date(startDate)) / millisecondsInDay); 
    let totalPrice = 0;

    if (durationInDays >= 30 && priceModel.monthlyRate !== -1) {
        const months = Math.floor(durationInDays / 30);
        totalPrice += months * priceModel.monthlyRate;
        durationInDays -= months * 30;
    }

    if (durationInDays >= 7 && priceModel.weeklyRate !== -1) {
        const weeks = Math.floor(durationInDays / 7);
        totalPrice += weeks * priceModel.weeklyRate;
        durationInDays -= weeks * 7;
    }

    if (priceModel.dailyRate !== -1) {
        totalPrice += durationInDays * priceModel.dailyRate;
    }

    if (priceModel.discountRate) {
        totalPrice -= totalPrice * (priceModel.discountRate / 100); 
    }
    
    return totalPrice;
};

module.exports = priceCalculate;
