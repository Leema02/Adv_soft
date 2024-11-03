const Event = require('../models/event');
const category = require('../models/category');

const catchAsync = require('../utils/catchAsyn');

const eventAdd = catchAsync(async (req, res) => {
    
    const { eventName, discountPercentage, startDate, endDate, catId } = req.body;
    catId0 = await category.findCategoryById(req.body.catId);
    if (catId0.length === 0)
        res.status(400).json({errors: "there is no category with id " + req.body.catId});
    const newEvent = await Event.addEvent( eventName, discountPercentage, startDate,endDate,catId);

    res.status(200).json({ success: "Event  "+eventName +" has been created successfully" });
});

const eventUpdate = catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    const { eventName, discountPercentage, startDate, endDate, catId } = req.body;

    const event = await Event.findEventByPk(id);
    if (!event) {
        return res.status(400).json({ error: "No event found with id " + id });
    }
    if(req.body.eventName||req.body.discountPercentage||req.body.startDate||req.body.endDate||req.body.catId)
    await Event.updateEvent(id,{eventName,discountPercentage,startDate,endDate,catId});

    res.status(200).json({ success: "Event with id " + id + " has been updated successfully" });
});

const eventDelete = catchAsync(async (req, res) => {
    const id = Number(req.params.id);

    const event = await Event.findEventByPk(id);
    if (!event) {
        return res.status(400).json({ error: "No event found with id " + id });
    }

    await Event.deleteEventById(id);
    res.status(200).json({ success: "Event with id " + id + " has been deleted successfully" });
});

const eventList = catchAsync(async (req, res) => {
    const events = await Event.listEvent();
    res.status(200).json(events);
});

module.exports = {
    eventAdd,
    eventUpdate,
    eventDelete,
    eventList,
};
