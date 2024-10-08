const { sequelize } = require("../models/config.js");

const User = require("../models/user.js");
const Item = require("../models/item.js");
const Review = require("../models/review.js");
const Pricing = require("../models/pricing.js");
const Category = require("../models/category.js");
const Inspection = require("../models/inspection.js");
const Rent = require("../models/rent.js");
const Delivery = require("../models/delivery.js");
const Expert = require("../models/expert.js");


User.hasMany(Item, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
Item.belongsTo(User, { foreignKey: 'ownerId', onDelete: 'CASCADE' });

Category.hasMany(Item, { foreignKey: 'catId', onDelete: 'SET NULL' });
Item.belongsTo(Category, { foreignKey: 'catId', onDelete: 'SET NULL' });

Pricing.hasOne(Item, { foreignKey: 'priceModelId', onDelete: 'SET NULL' });
Item.belongsTo(Pricing, { foreignKey: 'priceModelId', onDelete: 'SET NULL' });

User.hasMany(Rent, { foreignKey: 'customerId', onDelete: 'CASCADE' });
Rent.belongsTo(User, { foreignKey: 'customerId', onDelete: 'CASCADE' });

Item.hasMany(Rent, { foreignKey: 'itemId', onDelete: 'CASCADE' });
Rent.belongsTo(Item, { foreignKey: 'itemId', onDelete: 'CASCADE' });

Expert.hasMany(Rent, { foreignKey: 'expertId', onDelete: 'SET NULL' });
Rent.belongsTo(Expert, { foreignKey: 'expertId', onDelete: 'SET NULL' });

Expert.hasMany(Inspection, { foreignKey: 'expertId', onDelete: 'SET NULL' });
Inspection.belongsTo(Expert, { foreignKey: 'expertId', onDelete: 'SET NULL' });

Rent.hasOne(Inspection, { foreignKey: 'rentalId', onDelete: 'CASCADE' });
Inspection.belongsTo(Rent, { foreignKey: 'rentalId', onDelete: 'CASCADE' });

Item.hasMany(Review, { foreignKey: 'itemId', onDelete: 'CASCADE' });
Review.belongsTo(Item, { foreignKey: 'itemId', onDelete: 'CASCADE' });

User.hasMany(Review, { foreignKey: 'customerId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'customerId', onDelete: 'CASCADE' });

Delivery.belongsTo(Rent, { foreignKey: 'rentalId', onDelete: 'CASCADE' });
Rent.hasOne(Delivery, { foreignKey: 'rentalId', onDelete: 'CASCADE' });


sequelize.sync({ force: true }).then(() => {
  console.log("Synced");
});
