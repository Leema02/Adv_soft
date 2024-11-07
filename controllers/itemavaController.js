const { getItemsByCategoryAndAvailability } = require('../models/item');  

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

module.exports = {
    filterItemsByAvailability
};
