const catchAsync = require('../utils/catchAsyn');
const Item = require('../models/item');
const Review = require('../models/review');
const User = require('../models/user');
const {findItemById} = require("../models/item");
const {review} = require("../models/review");
const makeReview = catchAsync(async (req, res) => {
    const itemId = req.body.itemId;
    const item = await findItemById(itemId);
    let rating = req.body.rating;
    const comment = req.body.comment;
    const customerId = res.locals.user.UID;

    if (rating < 0) rating = 0;
    if (rating > 5) rating = 5;

    await Review.addReview(itemId, customerId, rating, comment);

    const rate = await User.calcAvgRating(item.ownerId);

    await User.updateAvgRating(item.ownerId, Number(rate.rating));

    res.status(200).json({result: "review has been made"});


});

const ListItemsToReview = catchAsync(async (req, res) => {

    const customerId = res.locals.user.UID;
    const items = await Review.getItemsToReview(customerId);

    const items_res = await Promise.all(
        items.map(async (item) => await Item.findItemById(item.itemId))
    );
    await res.status(200).json({result : items_res});


});

const ListItemsReviewed = catchAsync(async(req , res) => {
    const customerId = res.locals.user.UID;
    const result = await Review.getReviews(customerId);

    res.status(200).json({result : result});
});
module.exports = {makeReview, ListItemsToReview,ListItemsReviewed};