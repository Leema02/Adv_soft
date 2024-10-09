const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

const priceModel = sequelize.define(
  "PriceModel",
  {
    priceModelId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dailyRate: {
      type: DataTypes.DOUBLE,
      defaultValue: -1.0,
    },
    weeklyRate: {
      type: DataTypes.DOUBLE,
      defaultValue: -1.0,
    },
    monthlyRate: {
      type: DataTypes.DOUBLE,
      defaultValue: -1.0,
    },
    discountRate: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = priceModel;
