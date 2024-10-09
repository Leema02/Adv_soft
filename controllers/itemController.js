const item = require('../models/item');
const category = require('../models/category');
const pricing = require('../models/pricing');

const itemAdd = async (req, res) => {

    const catId = await category.findCategoryById(req.body.catId);
    if (catId.length === 0)
        res.status(400).json({errors: "there is no category with id " + req.body.catId});

    const priceModel = await pricing.insertPricing(req.body.priceModel);

    req.body.priceModelId = priceModel[0];

    const itemRes = await item.insertItem(req.body);


    res.status(200).json({success: "item with id " + itemRes[0] + " has been created"});


};

const itemDelete = async (req, res) => {

    if (!req.params.id) {
        res.status(400).json({error: "you have to specify id to delete !"});
        return;
    }

    const result = await item.findItemById(req.params.id);
    if (result.length === 0) {
        res.status(400).json({errors: "there is no item with id " + req.params.id});
        return;
    }

    const itemDelRes = await item.deleteItemById(req.params.id);

    res.status(200).json({success: "item with id " + req.params.id + " has been deleted"});

};

const itemObj = (req, res, next) => {

    req.body.ownerID = res.locals.user.UID;
    next();
}

module.exports = {itemAdd, itemObj, itemDelete};