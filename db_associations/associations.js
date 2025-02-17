const { sequelize } = require("../models/config.js");

const  User  = require("../models/user.js");
const Item = require("../models/item.js");
const Review = require("../models/review.js");
const Pricing = require("../models/pricing.js");
const Category = require("../models/category.js");
const Inspection = require("../models/inspection.js");
const Rent = require("../models/rent.js");
const Delivery = require("../models/delivery.js");
const Expert = require("../models/expert.js");
const event = require("../models/event.js");
const refund = require("../models/refund.js");
const income = require("../models/income.js");





// user.hasMany(Item, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
// Item.belongsTo(user, { foreignKey: 'ownerId', onDelete: 'CASCADE' });

// Category.hasMany(Item, { foreignKey: 'catId', onDelete: 'SET NULL' });
// Item.belongsTo(Category, { foreignKey: 'catId', onDelete: 'SET NULL' });


// Category.hasMany(Event, { foreignKey: 'catId', onDelete: 'CASCADE' });
// Event.belongsTo(Category, { foreignKey: 'catId', onDelete: 'CASCADE' });

// Pricing.hasOne(Item, { foreignKey: 'priceModelId', onDelete: 'SET NULL' });
// Item.belongsTo(Pricing, { foreignKey: 'priceModelId', onDelete: 'SET NULL' });

// user.hasMany(Rent, { foreignKey: 'customerId', onDelete: 'CASCADE' });
// Rent.belongsTo(user, { foreignKey: 'customerId', onDelete: 'CASCADE' });

// Item.hasMany(Rent, { foreignKey: 'itemId', onDelete: 'CASCADE' });
// Rent.belongsTo(Item, { foreignKey: 'itemId', onDelete: 'CASCADE' });

// Expert.hasMany(Rent, { foreignKey: 'expertId', onDelete: 'SET NULL' });
// Rent.belongsTo(Expert, { foreignKey: 'expertId', onDelete: 'SET NULL' });

// Expert.hasMany(Inspection, { foreignKey: 'expertId', onDelete: 'SET NULL' });
// Inspection.belongsTo(Expert, { foreignKey: 'expertId', onDelete: 'SET NULL' });

// Rent.hasOne(Inspection, { foreignKey: 'rentalId', onDelete: 'CASCADE' });
// Inspection.belongsTo(Rent, { foreignKey: 'rentalId', onDelete: 'CASCADE' });

// Item.hasMany(Review, { foreignKey: 'itemId', onDelete: 'CASCADE' });
// Review.belongsTo(Item, { foreignKey: 'itemId', onDelete: 'CASCADE' });

// user.hasMany(Review, { foreignKey: 'customerId', onDelete: 'CASCADE' });
// Review.belongsTo(user, { foreignKey: 'customerId', onDelete: 'CASCADE' });

// Delivery.belongsTo(Rent, { foreignKey: 'rentalId', onDelete: 'CASCADE' });
// Rent.hasOne(Delivery, { foreignKey: 'rentalId', onDelete: 'CASCADE' });


sequelize.sync({ alter: true }).then(() => {
  console.log("Database synchronized with changes.");
});
