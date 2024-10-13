const Item = require('../models/item');  
const User = require('../models/user');  

const listItemsByLoyalty = async (req, res) => {
    console.log("Request received for items in category:", req.params.catID);

    try {
        const catId = req.params.catID;

        // Log before querying the database
        console.log("Fetching items for category ID:", catId);

        // Fetch items in the category, where the owner has role 'o'
        const items = await Item.findAll({
            where: { catId: catId },
            include: [
                {
                    model: User,
                    attributes: ['loyalty', 'role'],  // Fetch loyalty and role of the owner
                    where: {
                        role: 'o'  // Only fetch items where the owner's role is 'o'
                    }
                }
            ]
        });

        console.log("Fetched items:", items); // Log the fetched items

        if (items.length === 0) {
            return res.status(204).json({ message: "No items found in this category" });
        }

        // Map the loyalty values to grades (A to E)
        const gradedItems = items.map(item => {
            const roundedLoyalty = Math.round(item.User.loyalty);
            let loyaltyGrade;

            switch (roundedLoyalty) {
                case 5:
                    loyaltyGrade = 'A';  // Best loyalty
                    break;
                case 4:
                    loyaltyGrade = 'B';
                    break;
                case 3:
                    loyaltyGrade = 'C';
                    break;
                case 2:
                    loyaltyGrade = 'D';
                    break;
                case 1:
                default:
                    loyaltyGrade = 'E';  // Lowest loyalty
            }

            return {
                ...item.toJSON(),  // Spread the item data
                loyaltyGrade       // Add the loyalty grade to the response
            };
        });

        // Sort items by loyalty grade (A -> E)
        const sortedItems = gradedItems.sort((a, b) => a.loyaltyGrade.localeCompare(b.loyaltyGrade));

        res.status(200).json(sortedItems);
    } catch (error) {
        console.error("Error in listItemsByLoyalty:", error);
        return res.status(500).json({ error: 'An error occurred while retrieving items.' });
    }
};

module.exports = {
    listItemsByLoyalty
};
