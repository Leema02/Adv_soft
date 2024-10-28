const Item = require("../models/item");
const Rental = require("../models/rent");
const Review = require('../models/review');
const validateMakeReview = async (req, res, next) => {
    const itemId = req.body.itemId;
    const rating = req.body.rating;
    const comment = req.body.comment;
    const customerId = res.locals.user.UID;

    if(!itemId || !rating || !comment){
        res.status(400).json({error : "item id and rating and comment must be specified"});
        return;
    }

    const item = await Item.findItemById(itemId);

    if(!item){
        res.status(400).json({error : "there is no item with id "+ itemId});
        return;
    }
    if(!isFinite(rating)){
        res.status(400).json({error : "rating must be a number"});
        return;
    }

    const reviews = await Review.findReviewByCustomerAndItem(customerId,itemId);

    if(reviews.length >= 1){
        res.status(400).json({error : "you can't rate this item two times"});
        return;
    }

    const rent = await Rental.findRentalByCustomerAndItem(itemId,customerId);
    if(rent && rent.Status !== 'return'){
        res.status(400).json({error : "the item you are rate is not returned"});
        return;
    }
    if(!rent){
        res.status(400).json({error : "you can't rate this item" });
        return;
    }

    next();
};


module.exports = {validateMakeReview}