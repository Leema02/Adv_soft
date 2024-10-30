const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

const inspection = sequelize.define("inspection", {
  InspectionId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  rentalId: {
    type: DataTypes.INTEGER,
    references: {
      model: "rents",
      key: "rentalId",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  conditionBefore: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  conditionAfter: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Status: {
    type: DataTypes.BOOLEAN,//false true
  },

});

module.exports = inspection;
