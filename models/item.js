
const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

const item = sequelize.define("Item", {
  itemId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "UID",
    },
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
  priceModelId: {
    type: DataTypes.INTEGER,
    references: {
      model: "PriceModels",
      key: "priceModelId",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  ItemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  Description: {
    type: DataTypes.TEXT,
  },
  ConditionBefore: {
    type: DataTypes.TEXT,
  },
  SecurityDeposit: {
    type: DataTypes.DOUBLE,
  },
});

const getItemsByCategoryAndAvailability = async (catId, availability) => {
  const sqlQuery = `SELECT * FROM Items WHERE catId = :catId AND Availability = :availability`;

  return await sequelize.query(sqlQuery, {
      replacements: { catId: catId, availability: availability },
      type: QueryTypes.SELECT
  });
};

module.exports = {
  item, getItemsByCategoryAndAvailability
};
