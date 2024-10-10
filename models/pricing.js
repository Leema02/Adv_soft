const {DataTypes, QueryTypes} = require("sequelize");
const {sequelize} = require("./config.js");
const catchAsync = require('../utils/catchAsyn');
const { log } = require("util");


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
        dailyLateFee:{
            type: DataTypes.DOUBLE,
            defaultValue: -1.0,

        }
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

const findPriceModelById=catchAsync(async (id) => {
    const sqlQuery = `SELECT * from PriceModels where priceModelId =:id `;

    const result = await sequelize.query(sqlQuery, {
        replacements: {id},
        type: QueryTypes.SELECT
    })
    console.log(result[0]);
    

    return result[0];
});


const updatePriceModel = catchAsync(async (id, updateData) => {
    const fields = [];
    const replacements = { priceModelId: id };

    if (updateData.dailyRate) {
        fields.push(`dailyRate = :dailyRate`);
        replacements.dailyRate = updateData.dailyRate;
    }
    if (updateData.weeklyRate) {
        fields.push(`weeklyRate = :weeklyRate`);
        replacements.weeklyRate = updateData.weeklyRate;
    }
    if (updateData.monthlyRate) {
        fields.push(`monthlyRate = :monthlyRate`);
        replacements.monthlyRate = updateData.monthlyRate;
    }
    if (updateData.discountRate) {
        fields.push(`discountRate = :discountRate`);
        replacements.discountRate = updateData.discountRate;
    }
if(fields.length>0){
    const query = `
        UPDATE PriceModels 
        SET 
            ${fields.join(', ')}
        WHERE priceModelId = :priceModelId
    `;

    await sequelize.query(query, {
        replacements,
        type: QueryTypes.UPDATE
    });
}
});




module.exports = {priceModel , insertPricing,findPriceModelById,updatePriceModel};

