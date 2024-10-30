const {DataTypes, QueryTypes, Op, QueryError} = require("sequelize");
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
            catId: itemObj.catId,
            priceModelId: itemObj.priceModelId,
            itemName: itemObj.itemName,
            description: itemObj.description,
            conditionBefore: itemObj.conditionBefore,
            securityDeposit: itemObj.SecuirityDeposit
        },
        type: QueryTypes.INSERT
    })

    return results;


};


const findItemById = async (id) => {
    const sqlQuery = `SELECT * from Items where itemId =:id `;

    const result = await sequelize.query(sqlQuery, {
        replacements: {id},
        type: QueryTypes.SELECT,
    });
    console.log("Query result:", result);

    return result[0];
};


const updateItem = async (itemId, updateData) => {
    const fields = [];
    const replacements = {itemId};

    if (updateData.catId) {
        fields.push(`catId = :catId`);
        replacements.catId = updateData.catId;
    }
    if (updateData.itemName) {
        fields.push(`ItemName = :ItemName`);
        replacements.ItemName = updateData.itemName;
    }
    if (updateData.Availability) {
        fields.push(`Availability = :Availability`);
        replacements.Availability = updateData.Availability;
    }
    if (updateData.Description) {
        fields.push(`Description = :Description`);
        replacements.Description = updateData.Description;
    }
    if (updateData.ConditionBefore) {
        fields.push(`ConditionBefore = :ConditionBefore`);
        replacements.ConditionBefore = updateData.ConditionBefore;
    }
    if (updateData.SecurityDeposit) {
        fields.push(`SecurityDeposit = :SecurityDeposit`);
        replacements.SecurityDeposit = updateData.SecurityDeposit;
    }

    const sqlQuery = `
        UPDATE Items 
        SET 
            ${fields.join(', ')}
        WHERE itemId = :itemId
    `;

    await sequelize.query(sqlQuery, {
        replacements,
        type: QueryTypes.UPDATE
    });
};


const ItemsNearME = async (ownersIdArray) => {
    if (!Array.isArray(ownersIdArray) || ownersIdArray.length === 0) {
        throw new Error("Invalid ownersIdArray");
    }
    const ownerIdsString = ownersIdArray.join(", ");
    console.log(ownerIdsString)
    const sqlQuery = `
        SELECT i.*,p.dailyRate, p.weeklyRate, p.monthlyRate, p.discountRate 
        FROM Items i
        LEFT JOIN PriceModels p ON i.priceModelId = p.priceModelId
        WHERE i.ownerId IN (${ownerIdsString})
    `;

    const result = await sequelize.query(sqlQuery, {
        type: QueryTypes.SELECT,
    });

    console.log("Query result:", result);

    return result;
};


const deleteItemById = async (itemId) => {
    const sqlQuery = `DELETE FROM Items WHERE itemId=:itemId`;

    const results = await sequelize.query(sqlQuery, {
        replacements: {itemId},
        type: QueryTypes.DELETE
    });

    return results;
};

const filterItemsByMinMax = async (way, min, max) => {

    const sqlQuery = `SELECT * FROM Items 
                      INNER JOIN PriceModels 
                      ON Items.priceModelId = PriceModels.priceModelId
                      WHERE ${way} >= :min AND ${way} <= :max
                    `;

    return await sequelize.query(sqlQuery, {
        replacements: {
            min: min,
            max: max,
        },
        type: QueryTypes.SELECT
    });
};

const getItemByCatAndItemId = async (catId, itemId) => {

    const sqlQuery = `SELECT * FROM Items WHERE catId = :catId AND itemId = :itemId`;

    return await sequelize.query(sqlQuery, {
        replacements: {
            catId: catId,
            itemId: itemId
        },
        type: QueryTypes.SELECT
    })
};


const getLikeItemName = async (catId, itemName) => {
    const sqlQuery = `SELECT * FROM Items WHERE catId = :catId AND ItemName LIKE :itemName`;

    return await sequelize.query(sqlQuery, {
        replacements: {
            catId: catId,
            itemName: `%${itemName}%`
        },
        type: QueryTypes.SELECT
    })
};

const getItemsByCategoryAndAvailability = async (catId, availability) => {
    const sqlQuery = `SELECT * FROM Items WHERE catId = :catId AND Availability = :availability`;
  
    return await sequelize.query(sqlQuery, {
        replacements: { catId: catId, availability: availability },
        type: QueryTypes.SELECT
    });
  };

  const getItemsByCategoryAndLoyalty = async (catId) => {
    const sqlQuery = `
      SELECT I.*, U.loyalty, U.role 
      FROM Items I
      JOIN Users U ON I.ownerId = U.UID
      WHERE I.catId = :catId AND U.role = 'o'
    `;
  
    const items = await sequelize.query(sqlQuery, {
      replacements: { catId },
      type: QueryTypes.SELECT,
    });
  
    return items.map(item => {
      const roundedLoyalty = Math.round(item.loyalty);
      let loyaltyGrade;
  
      switch (roundedLoyalty) {
        case 5:
          loyaltyGrade = 'A'; // Best loyalty
          break;
        case 4:
          loyaltyGrade = 'B';
          break;
        case 3:
          loyaltyGrade = 'C';
          break;
        case 2:
          loyaltyGrade = 'D';
          break;
        case 1:
        default:
          loyaltyGrade = 'E'; // Lowest loyalty
      }
  
      return {
        ...item, 
        loyaltyGrade, 
      };
    });
  };

module.exports = {
    item, insertItem, findItemById, updateItem, ItemsNearME, deleteItemById,
    filterItemsByMinMax, getItemByCatAndItemId,getLikeItemName, getItemsByCategoryAndAvailability,
    getItemsByCategoryAndLoyalty
};

