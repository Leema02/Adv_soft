const {DataTypes, QueryTypes} = require("sequelize");
const {sequelize} = require("./config.js");

const inspection = sequelize.define("inspection", {
    InspectionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    expertId: {
        type: DataTypes.INTEGER,
        references: {
            model: "experts",
            key: "expertId",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
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
    ImageAfter: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Status: {
        type: DataTypes.BOOLEAN,//false true
    },

});

const addInspection = async (rentalId, expertId, imagePath) => {

    const sqlQuery = `INSERT INTO inspections(expertId , rentalId,ImageAfter ) VALUES(:expertId,:rentalId,:imagePath);`;

    return await sequelize.query(sqlQuery, {
        replacements:{
            expertId:expertId,
            rentalId:rentalId,
            imagePath:imagePath
        },
        type:QueryTypes.INSERT
    });
};


const getInspections = async (expertId) => {
    const sqlQuery = `SELECT * FROM inspections WHERE expertId = :expertId;`;

    return await sequelize.query(sqlQuery, {
        replacements:{
            expertId:expertId,
        },
        type:QueryTypes.SELECT
    });
};
module.exports = {inspection, addInspection,getInspections};
