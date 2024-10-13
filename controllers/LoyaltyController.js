const { item, getItemsByCategoryAndLoyalty } = require('../models/item');

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

module.exports = {
  listItemsByLoyalty,
};
