const category = require('../models/category');
const catchAsync = require('../utils/catchAsyn');

const bodyParser = require('body-parser');


const categoryAdd = catchAsync(async (req, res) => {
    
    const {catName}=req.body
    const newCategory=await category.catAdd(catName);

    res.status(200).json({success: "category with id " + newCategory[0] + " has been created"});
});

const categoryUpdate = catchAsync(async (req, res) => {

    const id = Number(req.params.id);
    const {catName}=req.body
    console.log(catName)

    const catId = await category.findCategoryById(id);
    if (catId.length === 0)
        res.status(400).json({errors: "there is no category with id " + id});

    await category.catUpdate(id,catName);
    res.status(200).json({success: "category with id " +id + " has been updated successfully"});

});

const categoryDelete = catchAsync(async (req, res) => {

    const id = Number(req.params.id);

    const catId = await category.findCategoryById(id);
    if (catId.length === 0)
        res.status(400).json({errors: "there is no category with id " + id});

    await category.catDelete(id);
    res.status(200).json({success: "category with id " +id + " has been deleted successfully"});

});

const categoryList = catchAsync(async (req, res) => {

    const categories=await category.catList();
    
    res.status(200).json(categories);
    
    });


module.exports = {categoryAdd,categoryUpdate,categoryDelete,categoryList};