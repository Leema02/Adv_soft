const expert = require('../models/expert');
const catchAsync = require('../utils/catchAsyn');


const assignExpert = catchAsync(async (req, res) => {

    const result = await expert.addExpert(req.params.id, req.params.catId);

    res.status(200).json({success : "the expert is assigned!"});

});

module.exports = {assignExpert};