const Rent = require('../models/rent');
const Item = require('../models/item');
const Expert = require('../models/expert');


const catchAsync = require('../utils/catchAsyn');
const bodyParser = require('body-parser');

const rentAdd = catchAsync(async (req, res) => {
    const customerId=res.locals.user.UID
    const {itemId,startDate,endDate}=req.body
    const itemResult=await Item.findItemById(itemId)

    if (!itemResult ||!itemResult.itemId)
        res.status(400).json({errors: "there is no item with id " + itemId});

    if(!itemResult.Availability)
        res.status(400).json({errors: "sorry the item with id no avaliable right now" + itemId});

    const availabilityResult = await Rent.checkAvailableRent(itemId, startDate, endDate);

    if (!availabilityResult.available) {
        return res.status(400).json({
            error: "The item is not available for the full requested period.",
            availablePeriods: availabilityResult.availablePeriods,
            futureRentals: availabilityResult.futureRentals,
        });
    }

    const expertResult=await Expert.findExpertToAssign(itemResult.catId)
    
    const newRent=await Rent.rentAdd(customerId,itemId,expertResult.expertId,startDate,endDate);

    res.status(200).json({success: "rent with id " + newRent[0] + " has been created and its status is pending when accepeted an email is sent to you"});

});

const rentDelete = catchAsync(async (req, res) => {

    // const id = Number(req.params.id);

    // const rentId = await Rent.findRentyById(id);
    // if (rentId.length === 0)
    //     res.status(400).json({errors: "there is no rent with id " + id});

    // await Rent.rentDelete(id);
    // res.status(200).json({success: "rent with id " +id + " has been deleted successfully"});

});

const rentList = catchAsync(async (req, res) => {

    // const id=res.locals.user.UID
    // const role=res.locals.user.role
    // const rents=await Rent.rentList(id,role);
    
    // res.status(200).json(rents);
    
    });


module.exports = {rentList,rentAdd,rentDelete};


