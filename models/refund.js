const { sequelize } = require("./config.js");
const {DataTypes, QueryTypes} = require("sequelize");
const Refund = sequelize.define('Refund', {
    refundId: {
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
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "UID",
      },
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  