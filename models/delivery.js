const { DataTypes, QueryTypes } = require('sequelize');
const { sequelize } = require('./config.js');

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
    allowNull: false,
    defaultValue: 'pending',
  },
  method: {
    type: DataTypes.ENUM("p", "d"),
    allowNull: false,
  },
  estimatedDeliveryTime: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

const createDelivery = async (rentalId, method, estimatedDeliveryTime) => {
  const sqlQuery = `
      INSERT INTO deliveries (rentalId, status, method, estimatedDeliveryTime, createdAt, updatedAt)
      VALUES (:rentalId, :status, :method, :estimatedDeliveryTime, NOW(), NOW())`;

      try {
        const results = await sequelize.query(sqlQuery, {
          replacements: { rentalId, status: 'pending', method, estimatedDeliveryTime },
          type: QueryTypes.INSERT
        });
        console.log('SQL query executed successfully:', results);
        return results;
      } catch (error) {
        console.error('SQL query failed:', error);
        throw error;
      }
    };

module.exports = { createDelivery };
