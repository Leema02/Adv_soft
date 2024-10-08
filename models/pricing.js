const {DataTypes, QueryTypes} = require("sequelize");
const {sequelize} = require("./config.js");

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

const insertPricing = async (data) => {
    const dailyRate = data.dailyRate === undefined ? -1 : data.dailyRate;
    const weeklyRate = data.weeklyRate === undefined ? -1 : data.weeklyRate;
    const monthlyRate = data.monthlyRate === undefined ? -1 : data.monthlyRate;
    const discountRate = data.discountRate === undefined ? -1 : data.discountRate;

    const sqlQuery = `
        INSERT INTO PriceModels (dailyRate, weeklyRate, monthlyRate, discountRate)
        VALUES (:dailyRate, :weeklyRate, :monthlyRate, :discountRate)
    `;

    const results = await sequelize.query(sqlQuery, {
        replacements: {dailyRate, weeklyRate, monthlyRate, discountRate},
        type: QueryTypes.INSERT
    })

    return results;

};
module.exports = {priceModel , insertPricing};
