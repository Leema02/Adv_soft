const inspection = require('../models/inspection');
const rental = require('../models/rent');
const User = require('../models/user');
const Item = require('../models/item');
const Expert = require('../models/expert');
const catchAsync = require('../utils/catchAsyn');

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
module.exports = {openInspection, listInspections}