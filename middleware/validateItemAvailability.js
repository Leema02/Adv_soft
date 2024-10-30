const { body, validationResult } = require('express-validator');

const identifyAvailabilityAndValidate = (req, res, next) => {
    const catId = req.params.catID;
    
    if (!catId || isNaN(catId)) {
        return res.status(400).json({ error: "Category ID must be a valid number." });
    }

    const availability = req.params.availability;

    if (availability !== 'true' && availability !== 'false') {
        return res.status(400).json({ error: "Availability must be 'true' or 'false'." });
    }

    req.params.availability = (availability === 'true');

    next();
};

module.exports = {
    identifyAvailabilityAndValidate
};
