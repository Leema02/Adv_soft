const {DataTypes, QueryTypes} = require("sequelize");
const {sequelize} = require("./config.js");

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

const insertItem = async (itemObj) => {
    const sqlQuery = `
            INSERT INTO Items (
                ownerId, catId, priceModelId , ItemName, 
                Description, ConditionBefore, SecurityDeposit
            ) VALUES (
                :ownerID, :catId, :priceModelId, :itemName, 
                :description, :conditionBefore, :securityDeposit
            )
        `;

    const results = await sequelize.query(sqlQuery, {
        replacements: {
            ownerID: itemObj.ownerID,
            catId: itemObj.catId, priceModelId: itemObj.priceModelId,
            itemName: itemObj.itemName, description: itemObj.Description,
            conditionBefore: itemObj.conditionBefore, securityDeposit: itemObj.SecuirityDeposit
        },
        type: QueryTypes.INSERT
    })

    return results;


};
module.exports = {item, insertItem};