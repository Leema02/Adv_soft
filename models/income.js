const { sequelize } = require("./config.js");
const {DataTypes, QueryTypes} = require("sequelize");

const Income = sequelize.define('Income', {
    incomeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rentalId: {
      type: DataTypes.INTEGER,
      references: {
        model: "rents",
        key: "rentalId",
      },
      allowNull: false,
    },
    adminShare: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
    ownertShare: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
      },
    expertShare: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0,
    },
    totalIncome: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  
  const addIncome=async( rentalId,  expertShare,adminShare,ownerShare)=>{
    const income=await findIncomeByRentalId(rentalId)
    if(!income){
        await newIncome(rentalId,  expertShare,adminShare,ownerShare)
    }
    else
    await updateIncome(income.incomeId,expertShare,adminShare,ownerShare)
  }

  const newIncome=async(rentalId,  expertShare,adminShare,ownerShare)=>{
   const  createdAt=new Date()
    const totalIncome=expertShare+adminShare+ownerShare
    const sqlQuery = `
    INSERT INTO Incomes (rentalId, expertShare,adminShare,ownertShare,createdAt,totalIncome)
     VALUES (:rentalId, :expertShare, :adminShare, :ownerShare,:createdAt,:totalIncome )`;

     await sequelize.query(sqlQuery, {
        replacements: {rentalId, expertShare, adminShare, ownerShare,createdAt,totalIncome },
        type: QueryTypes.INSERT
      });

  }

  const updateIncome = async (id, expertShare, adminShare, ownerShare) => {
    const totalIncome=expertShare+adminShare+ownerShare
    
    const sqlQuery = `
    UPDATE incomes 
    SET expertShare = :expertShare, adminShare = :adminShare, ownertShare = :ownerShare,totalIncome=:totalIncome
    WHERE incomeId = :id
  `;

    await sequelize.query(sqlQuery, {
      replacements: { id, expertShare, adminShare, ownerShare,totalIncome },
      type: QueryTypes.UPDATE
    });
};


  const findIncomeByRentalId=async(rentalId)=>{
    const sqlQuery = `SELECT * from Incomes where rentalId =:rentalId `;

    const result = await sequelize.query(sqlQuery, {
        replacements: { rentalId },
        type: QueryTypes.SELECT,
    });
    console.log("Query result:", result);

    return result[0];

  }

  const getTotalIncomeIn = async (incomeField, startOfMonth, endOfMonth, id, userRole) => {
    let sqlQuery = `
        SELECT SUM(${incomeField}) AS totalIncome
        FROM incomes
    `;

    const whereConditions = [
        `${incomeField} > 0`,
        `incomes.createdAt BETWEEN :startOfMonth AND :endOfMonth`
    ];

    if (userRole === 'e') {
        sqlQuery += `
            INNER JOIN rents ON rents.rentalId = incomes.rentalId
            WHERE ${whereConditions.join(' AND ')}
            AND rents.expertId = :id;
        `;
    } else if (userRole === 'o') {
        sqlQuery += `
            INNER JOIN rents ON rents.rentalId = incomes.rentalId
            INNER JOIN items ON rents.itemtId = items.itemId
            WHERE ${whereConditions.join(' AND ')}
            AND items.ownerId = :id;
        `;
    } else {
        sqlQuery += `
            WHERE ${whereConditions.join(' AND ')}
        `;
    }

    const replacements = { startOfMonth, endOfMonth };
    if (userRole === 'e' || userRole === 'o') {
        replacements.id = id;
    }

    const result = await sequelize.query(sqlQuery, {
        replacements,
        type: QueryTypes.SELECT,
    });

    return result[0] || { totalIncome: 0 }; // Return 0 if no records found
};

const getIncomeTrends = async (startYear, endYear, userRole, id) => {
  let sqlQuery = `
      SELECT YEAR(incomes.createdAt) AS year, 
             SUM(incomes.totalIncome) AS totalIncome
      FROM incomes
      INNER JOIN rents ON rents.rentalId = incomes.rentalId
      INNER JOIN items ON items.itemId = rents.itemtId
      WHERE YEAR(incomes.createdAt) BETWEEN :startYear AND :endYear
  `;

  const whereConditions = [];

  if (userRole === 'e') {
      whereConditions.push('rents.expertId = :id'); 
  } else if (userRole === 'o') {
      whereConditions.push('items.ownerId = :id'); 
  }

  if (whereConditions.length > 0) {
      sqlQuery += ' AND ' + whereConditions.join(' AND ');
  }

  sqlQuery += ' GROUP BY YEAR(incomes.createdAt) ORDER BY YEAR(incomes.createdAt);';

  const result = await sequelize.query(sqlQuery, {
      replacements: { startYear, endYear, id },
      type: QueryTypes.SELECT,
  });

  return result;
};

const getMonthlyIncomeReport = async (year, userRole, id) => {
  let sqlQuery = `
      SELECT 
          MONTH(incomes.createdAt) AS month,
          SUM(incomes.totalIncome) AS totalIncome
      FROM incomes
  `;

  if (userRole === 'e') {
      sqlQuery += `
          INNER JOIN rents ON rents.rentalId = incomes.rentalId
          WHERE YEAR(incomes.createdAt) = :year
          AND rents.expertId = :id
      `;
  } else if (userRole === 'o') {
      sqlQuery += `
          INNER JOIN rents ON rents.rentalId = incomes.rentalId
          INNER JOIN items ON items.itemId = rents.itemtId
          WHERE YEAR(incomes.createdAt) = :year
          AND items.ownerId = :id
      `;
  } else {
      sqlQuery += ` WHERE YEAR(incomes.createdAt) = :year `;
  }

  sqlQuery += `
      GROUP BY MONTH(incomes.createdAt)
      ORDER BY MONTH(incomes.createdAt);
  `;

  try {
      const result = await sequelize.query(sqlQuery, {
          replacements: { year, id },
          type: QueryTypes.SELECT,
      });

      return result; 
  } catch (error) {
      console.error('Error generating monthly income report:', error);
      throw error;
  }
};


  
  

  module.exports={Income,addIncome,getTotalIncomeIn,getIncomeTrends,getMonthlyIncomeReport}