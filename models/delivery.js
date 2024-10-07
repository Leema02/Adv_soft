const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

const delivery = sequelize.define("delivery", {
  deliveryId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rentalId: {
    type: DataTypes.INTEGER,
    references: {
      model: "rents",
      key: "rentalId",
    },
   
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  status: {
    type: DataTypes.STRING,
  },
  method: {
    type: DataTypes.ENUM("p", "d"),
  },
  estimatedDeliveryTime: {
    type: DataTypes.DOUBLE,
  },
});

module.exports = delivery;
