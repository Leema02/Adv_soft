const category = require('../models/category');
const user = require('../models/user');

const validateAssignExpert = async (req , res, next) => {
    const catId = await category.findCategoryById(req.params.catId);
    if (catId.length === 0){
        res.status(400).json({errors: "there is no category with id " + req.params.catId});
        return;
    }
    const uId = await user.findUserById(req.params.id);
    if(uId.length === 0){
        res.status(400).json({errors: "there is no user with id " + req.params.id});
        return;
    }

    if(uId.role !== 'e'){
        res.status(400).json({errors: "the user you are trying to assign is not role expert"});
        return;
    }
    next();
}

module.exports = {validateAssignExpert}