const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

const Rental = sequelize.define("rent", {
  rentalId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  itemtId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Items",
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

  expertId: {
    type: DataTypes.INTEGER,
    references: {
      model: "experts",
      key: "expertId",
    },

    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  damageFee:{
    type: DataTypes.DOUBLE,
  },
  Status: {
    type: DataTypes.STRING,//good (owner) inspect(expert --> damaged good) owner(rented) returned
  },
  RPrice: {
    type: DataTypes.DOUBLE,
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
  },
 

});

module.exports = Rental;
