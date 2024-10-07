const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

const expert = sequelize.define(
  "expert",
  {
    expertId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "UID",
      },
      primaryKey: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    catId: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "catId",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = expert;
