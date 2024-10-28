const {DataTypes, QueryTypes} = require("sequelize");
const {sequelize} = require("./config.js");

const review = sequelize.define("review", {
    reviewId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    itemId: {
        type: DataTypes.INTEGER,
        references: {
            model: "items",
            key: "itemId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    customerId: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: "UID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});


const addReview = async (itemId, customerId, rating, comment) => {

    const sqlQuery = `INSERT INTO reviews(itemId , customerId,rating,comment ) VALUES(:itemId,:customerId,:rating,:comment);`;

    return await sequelize.query(sqlQuery, {
        replacements: {
            itemId: itemId,
            customerId: customerId,
            rating: rating,
            comment: comment
        },
        type: QueryTypes.INSERT
    });
};

const findReviewByCustomerAndItem = async (customerId, itemId) => {
    const sqlQuery = `SELECT * FROM reviews WHERE customerId =:customerId AND itemId=:itemId;`;

    const result = await sequelize.query(sqlQuery, {
        replacements: {
            itemId: itemId,
            customerId: customerId,
        },
        type: QueryTypes.SELECT
    });

    return result;
}

const getItemsToReview = async (customerId) => {
    const sqlQuery = `
        SELECT itemId FROM rents WHERE customerId = :customerId 
        AND NOT EXISTS (SELECT itemId FROM reviews WHERE customerId =:customerId); 
    `;

    return await sequelize.query(sqlQuery, {
        replacements: {
            customerId: customerId,
        },
        type: QueryTypes.SELECT
    });

}

const getReviews = async (customerId) => {
    const sqlQuery = `SELECT * FROM reviews WHERE customerId=:customerId`;

    return await sequelize.query(sqlQuery, {
        replacements: {
            customerId: customerId,
        },
        type: QueryTypes.SELECT
    });
}
module.exports = {review, addReview, findReviewByCustomerAndItem, getItemsToReview,getReviews};