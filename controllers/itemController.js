const item = require('../models/item');
const user = require('../models/user');

const category = require('../models/category');
const pricing = require('../models/pricing');
const catchAsync = require('../utils/catchAsyn');
const AppError = require('../utils/AppError');

const itemAdd = async (req, res) => {

    const catId = await category.findCategoryById(req.body.catId);
    if (catId.length === 0)
        res.status(400).json({errors: "there is no category with id " + req.body.catId});

    const priceModel = await pricing.insertPricing(req.body.priceModel);

    req.body.priceModelId = priceModel[0];

    const itemRes = await item.insertItem(req.body);


    res.status(200).json({success: "item with id " + itemRes[0] + " has been created"});
};

const itemUpdate = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const itemToUpdate = await item.findItemById(id);

    console.log("we", itemToUpdate)

    if (!itemToUpdate || itemToUpdate.length === 0) {
        return res.status(400).json({errors: "there is no item with id " + id});
    }

    const catId = req.body.catId ? await category.findCategoryById(req.body.catId) : null;
    if (req.body.catId && catId.length === 0) {
        return res.status(400).json({errors: "there is no category with id " + req.body.catId});
    }

    if (res.locals.user.UID === itemToUpdate.ownerId) {
        const {
            catId,
            itemName,
            Availability,
            Description,
            ConditionBefore,
            SecurityDeposit,
            dailyRate,
            weeklyRate,
            monthlyRate,
            discountRate
        } = req.body;

        await item.updateItem(id, {
            catId,
            itemName,
            Availability,
            Description,
            ConditionBefore,
            SecurityDeposit
        });

        if (req.body.dailyRate || req.body.weeklyRate || req.body.monthlyRate || req.body.discountRate) {
            await pricing.updatePriceModel(itemToUpdate.priceModelId, {
                dailyRate: req.body.dailyRate,
                weeklyRate: req.body.weeklyRate,
                monthlyRate: req.body.monthlyRate,
                discountRate: req.body.discountRate,
            });
        }

        return res.status(200).json({success: "Item with id " + id + " has been updated"});
    } else {
        return res.status(401).send('You are not authorized to update this item');
    }
});


const itemNearME = catchAsync(async (req, res, next) => {
    const UserCity = res.locals.user.City;
    const ownerNearME = await user.OwnerNearME(UserCity)

    if (!ownerNearME || ownerNearME.length == 0) {
        return res.status(400).json({message: "Sorry there is no items near you.. "});
    }

    const ownersIdArray = ownerNearME.map(owner => owner.UID);


    const items = await item.ItemsNearME(ownersIdArray);


    return res.status(200).json(items);

});


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

const addImage = catchAsync(async (req , res) => {

    const result = item.findItemById(req.params.id);
    if (result.length === 0) {
        res.status(400).json({errors: "there is no item with id " + req.params.id});
        return;
    }
   const rr = await item.editImage(req.params.id,req.body.path);

   res.status(200).json({success : "Added Image to Item " + req.params.id });
});

const filterByMinMax = async (req, res) => {

    const result = await item.filterItemsByMinMax(req.params.way + "lyRate", req.params.min, req.params.max);

    if (result.length === 0) {
        res.status(204).json({result: "no content"});
        return;
    }
    res.status(200).json(result);
}

const getItemByIds = catchAsync(async (req, res) => {
    const result = await item.getItemByCatAndItemId(req.params.catId, req.params.idItem);
    if (result.length === 0) {
        res.status(404).json({result: "not found"});
        return;
    }
    res.status(200).json(result);
});

const searchItemByName = catchAsync(async (req, res) => {

    const result = await item.getLikeItemName(req.params.catId,req.query.item);
    if (result.length === 0) {
        res.status(204).json({result: "no results"});
        return;
    }

    res.status(200).json(result);
});
const itemObj = (req, res, next) => {

    req.body.ownerID = res.locals.user.UID;
    next();
}


const filterItemsByAvailability = async (req, res) => {
    const catId = req.params.catID;

    let availability = null;
    try {
        availability = JSON.parse(req.params.availability);  // Convert "true"/"false" strings to boolean
    } catch (error) {
        availability = null;  
    }

    if (typeof availability !== 'boolean') {
        return res.status(400).json({ error: "Availability must be 'true' or 'false'." });
    }

    try {
        const result = await item.getItemsByCategoryAndAvailability(catId, availability);

        if (result.length === 0) {
            return res.status(204).json({ message: "No available items found in this category" });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error while retrieving available items:", error);  // Log the error for debugging
        res.status(500).json({ error: "An error occurred while retrieving available items" });
    }
};

const listItemsByLoyalty = async (req, res) => {
    const catId = req.params.catID;
  
    try {
      const items = await getItemsByCategoryAndLoyalty(catId);
  
      if (items.length === 0) {
        return res.status(204).json({ message: "No items found in this category" });
      }
  
      const sortedItems = items.sort((a, b) => a.loyaltyGrade.localeCompare(b.loyaltyGrade));
  
      res.status(200).json(sortedItems);
    } catch (error) {
      console.error("Error in listItemsByLoyalty:", error);
      res.status(500).json({ error: 'An error occurred while retrieving items.' });
    }
  };

module.exports = {itemAdd, itemObj, itemDelete, filterByMinMax, itemUpdate,
    itemNearME, getItemByIds, searchItemByName, filterItemsByAvailability,
    listItemsByLoyalty,addImage
};

