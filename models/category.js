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

const catAdd=async(catName)=>{

    const sqlQuery = `INSERT INTO Categories (catName) VALUES ( :catName )`;

const results = await sequelize.query(sqlQuery, {
replacements: {catName},
type: QueryTypes.INSERT
})

return results;
}

const catUpdate=async(id,name)=>{

    const sqlQuery = `
    UPDATE categories 
    SET catName =:name
    WHERE catId = :id
`;

await sequelize.query(sqlQuery, {
    replacements: { name: name, id: id }, // Use 'id' instead of 'catId'
    type: QueryTypes.UPDATE
});

}

const catDelete=async(id)=>{

    const sqlQuery = `
    DELETE FROM categories 
    WHERE catId=:id`;
   
await sequelize.query(sqlQuery, {
    replacements: { id: id }, // Use 'id' instead of 'catId'
    type: QueryTypes.UPDATE
});

}

const catList=async()=>{

    const sqlQuery = `SELECT * from categories `;

    const result = await sequelize.query(sqlQuery, {
        type: QueryTypes.SELECT,
    });
    console.log("Query result:", result);

    return result;

}

module.exports = {category, findCategoryById,catAdd,catUpdate,catDelete,catList};