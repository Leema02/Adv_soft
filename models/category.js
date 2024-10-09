const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

const category = sequelize.define("category", {
  catId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  catName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = category;
