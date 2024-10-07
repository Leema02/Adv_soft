const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

const review = sequelize.define("review", {
  reviewId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  itemtId: {
    type: DataTypes.INTEGER,
    references: {
      model: "items",
      key: "itemId",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "UID",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = review;
