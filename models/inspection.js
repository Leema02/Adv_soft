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
        replacements: {
            expertId: expertId,
            rentalId: rentalId,
            imagePath: imagePath
        },
        type: QueryTypes.INSERT
    });
};


const getInspections = async (expertId) => {
    const sqlQuery = `SELECT * FROM inspections WHERE expertId = :expertId;`;

    return await sequelize.query(sqlQuery, {
        replacements: {
            expertId: expertId,
        },
        type: QueryTypes.SELECT
    });
};

const editInspectionStatus = async (id, status) => {

    const sqlQuery = `UPDATE inspections SET Status = :status WHERE InspectionId = :id`;
    const statusBool = status === 'true';
    return await sequelize.query(sqlQuery, {
        replacements: {
            status: statusBool,
            id: id,
        },
        type: QueryTypes.UPDATE
    });

}

const findInspectionById = async (id) => {
    const sqlQuery = `SELECT * FROM inspections WHERE InspectionId = :id`;

    const result = await sequelize.query(sqlQuery, {
        replacements: {id},
        type: QueryTypes.SELECT,
    });

    return result[0];

}

const findInspectionByRentId = async (id) => {
    const sqlQuery = `SELECT * FROM inspections WHERE rentalId = :id`;

    const result = await sequelize.query(sqlQuery, {
        replacements: {id},
        type: QueryTypes.SELECT,
    });

    return result[0];
};

const deleteInspectionById = async (id) => {
    const sqlQuery = `DELETE FROM inspections WHERE InspectionId=:id`;

    return await sequelize.query(sqlQuery, {
        replacements: {
            id: id
        },
        type: QueryTypes.DELETE
    });

};
module.exports = {
    inspection,
    addInspection,
    getInspections,
    editInspectionStatus,
    findInspectionById,
    findInspectionByRentId,
    deleteInspectionById
};
