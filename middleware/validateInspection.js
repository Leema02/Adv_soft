const inspection = require('../models/inspection');

const validateInspectionResponse = async(req , res ,next) =>{
    const inspectionId = req.params.id;
    const status = req.params.status;

    if(!inspectionId || !status){
        res.status(400).json({error : "you have to specify both id and status"});
        return;
    }

    if(status !== 'true' && status !== 'false'){
        res.status(400).json({error : "non-valid status value (must be true or false)"});
        return;
    }

    const insp = await inspection.findInspectionById(inspectionId);
    if(!insp) {
        res.status(400).json({error : "there is no inspection with id " + inspectionId});
        return;
    }

    next();
};
module.exports={validateInspectionResponse}