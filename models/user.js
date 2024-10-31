const {sequelize} = require("./config.js");
const {DataTypes, QueryTypes} = require("sequelize");
const validator = require("validator");
const AppError = require("../utils/AppError");

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


const addUser = async (username, email, hashedPassword, mobile, city, street, role) => {

    try {
        await sequelize.query(
            'INSERT INTO Users (UName, Email, Password, Mobile, City, Street, role) VALUES (:username, :email, :password, :mobile, :city, :street, :role)',
            {
                replacements: {username, email, password: hashedPassword, mobile, city, street, role},
                type: QueryTypes.INSERT,
            }
        );
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({message: 'Mobile number already exists'});
        } else {
            console.error("SQL Error:", error);
            return res.status(500).json({message: 'Database operation failed'});
        }
    }

}
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

const findUserByEmail = async (email) => {
    const sqlQuery = `SELECT * FROM Users WHERE Email = :email`;

    const result = await sequelize.query(sqlQuery, {
        replacements: {email: email},
        type: QueryTypes.SELECT,
    });
    console.log("Query result:", result);

    return result[0];
};

const findUserByUsername = async (username) => {
    const queryUser = `SELECT * FROM Users WHERE UName = :username `;


    const result = await sequelize.query(queryUser, {
        replacements: {username}, // Use 'replacements' option correctly
        type: QueryTypes.SELECT
    });

    return result[0];
};
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

const updateCash = async (id, cashBalance) => {
    const sqlQuery = `UPDATE Users SET cashBalance = :cashBalance WHERE UID = :id`;

    return await sequelize.query(sqlQuery, {
        replacements: {
            id: id,
            cashBalance: cashBalance,
        },
        type: QueryTypes.UPDATE
    });
};

const calcAvgRating = async (UID) => {
    const sqlQuery = `
        SELECT AVG(rating) AS rating FROM reviews 
        INNER JOIN items ON  reviews.itemId = items.itemId
        WHERE ownerId = :ownerId;
    `;

    const result = await sequelize.query(sqlQuery, {
        replacements: {
            ownerId: UID
        },
        type: QueryTypes.SELECT
    });

    return result[0];
}

const updateAvgRating = async (UID, rate) => {
    const sqlQuery = `UPDATE users SET avgRating = :rate WHERE UID=:UID`;

    return await sequelize.query(sqlQuery, {
        replacements: {
            UID: UID,
            rate: rate
        },
        type: QueryTypes.UPDATE
    });
};

const loginFunc = async (username, email, password) => {
    let query;
    let replacement
    if (email) {
        query = `SELECT * FROM Users WHERE Email = :email LIMIT 1`;
        replacement = {email};
    } else if (username) {
        query = `SELECT * FROM Users WHERE UName = :username LIMIT 1`;
        replacement = {username};
    }

    const result = await sequelize.query(query, {
        replacements: replacement,
        type: QueryTypes.SELECT
    });

    return result[0];

}


module.exports = {
    user,
    OwnerNearME,
    findUserById,
    findUserByEmail,
    incLoyalty,
    ownerLoyalty,
    getIncomeDistribution,
    getEmailById,
    updateCash,
    calcAvgRating,
    updateAvgRating,
    loginFunc,
    findUserByUsername,
    addUser

};
