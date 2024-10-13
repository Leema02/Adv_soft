
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

const getItemsByCategoryAndLoyalty = async (catId) => {
  const sqlQuery = `
    SELECT I.*, U.loyalty, U.role 
    FROM Items I
    JOIN Users U ON I.ownerId = U.UID
    WHERE I.catId = :catId AND U.role = 'o'
  `;

  const items = await sequelize.query(sqlQuery, {
    replacements: { catId },
    type: QueryTypes.SELECT,
  });

  return items.map(item => {
    const roundedLoyalty = Math.round(item.loyalty);
    let loyaltyGrade;

    switch (roundedLoyalty) {
      case 5:
        loyaltyGrade = 'A'; // Best loyalty
        break;
      case 4:
        loyaltyGrade = 'B';
        break;
      case 3:
        loyaltyGrade = 'C';
        break;
      case 2:
        loyaltyGrade = 'D';
        break;
      case 1:
      default:
        loyaltyGrade = 'E'; // Lowest loyalty
    }

    return {
      ...item, 
      loyaltyGrade, 
    };
  });
};

module.exports = {
  item,
  getItemsByCategoryAndAvailability,
  getItemsByCategoryAndLoyalty,
};