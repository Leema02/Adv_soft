const {sequelize} = require("./config.js");
const {DataTypes, QueryTypes} = require("sequelize");

const user = sequelize.define("User", {
    UID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Mobile: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    City: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Street: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cashBalance: {
        type: DataTypes.DOUBLE, // money back
        defaultValue: 0,
    },
    avgRating: {
        type: DataTypes.DOUBLE(11, 10), //review
        defaultValue: 0.0,
    },
    loyalty: {
        type: DataTypes.DOUBLE, // .1  ==> 1 silver 2 gold
        defaultValue: 0.0,
    },
    role: {
        type: DataTypes.ENUM("u", "a", "e", "o"),
        defaultValue: "u",
    },
});

const OwnerNearME = async (Usercity) => {
    const sqlQuery = `SELECT UID FROM Users WHERE City = :Usercity AND role = 'o'`;

    const result = await sequelize.query(sqlQuery, {
        replacements: {Usercity},
        type: QueryTypes.SELECT,
    });
    console.log("Query result:", result);

    return result;
}

const findUserById = async (id) => {

    const sqlQuery = `SELECT * FROM Users WHERE  UID = :id`;

    const result = await sequelize.query(sqlQuery, {
        replacements: {id: id},
        type: QueryTypes.SELECT,
    });
    console.log("Query result:", result);

    return result[0];
}

const incLoyalty = async (id) => {
    const sqlQuery = `
    UPDATE users 
    SET loyalty = loyalty + 0.1
    WHERE UID = :id
  `;

    try {
        await sequelize.query(sqlQuery, {
            replacements: {id},
            type: QueryTypes.UPDATE
        });
    } catch (error) {
        console.error('Error updating loyalty:', error);
        throw error; // Rethrow the error if needed
    }
};


const ownerLoyalty = async (id) => {
    const sqlQuery = `SELECT loyalty FROM Users WHERE UID = :id`;


    const result = await sequelize.query(sqlQuery, {
        replacements: {id},
        type: QueryTypes.SELECT
    });
    return result[0]
}

const getIncomeDistribution = async (id) => {
    const loyalty = await ownerLoyalty(id)
    let expertShare = 0.10;
    let adminShare = 0.15;
    let ownerShare = 0.75;

    if (loyalty >= 2) {
        expertShare = 0.5;
        adminShare = 0.10;
        ownerShare = 0.85;
    } else if (loyalty >= 4) {
        expertShare = 0.90;
        adminShare = 0.07;
        ownerShare = 0.03;
    }

    return {expertShare, adminShare, ownerShare};
};

const getEmailById = async (id) => {
    const sqlQuery = `SELECT email FROM Users WHERE UID = :id`;


    const result = await sequelize.query(sqlQuery, {
        replacements: {id},
        type: QueryTypes.SELECT
    });
    return result[0]
}

module.exports = {user, OwnerNearME, findUserById, incLoyalty, ownerLoyalty, getIncomeDistribution, getEmailById};
