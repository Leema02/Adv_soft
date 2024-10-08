const {QueryTypes, DataTypes} = require("sequelize");
const {sequelize} = require("./config.js");

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

const findCategoryById = async (id) => {

    const results = await sequelize.query('SELECT catId FROM categories WHERE catId = :catId', {
        replacements: {catId: id},
        type: QueryTypes.SELECT
    });

    return results;

}
module.exports = {category, findCategoryById};
