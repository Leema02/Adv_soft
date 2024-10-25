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
    const sqlQuery = `
    INSERT INTO Incomes (rentalId, expertShare,adminShare,ownertShare)
     VALUES (:rentalId, :expertShare, :adminShare, :ownerShare )`;

     await sequelize.query(sqlQuery, {
        replacements: {rentalId, expertShare, adminShare, ownerShare },
        type: QueryTypes.INSERT
      });

  }

  const updateIncome = async (id, expertShare, adminShare, ownerShare) => {
    const sqlQuery = `
    UPDATE incomes 
    SET expertShare = :expertShare, adminShare = :adminShare, ownertShare = :ownerShare
    WHERE incomeId = :id
  `;

    await sequelize.query(sqlQuery, {
      replacements: { id, expertShare, adminShare, ownerShare },
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
  

  module.exports={Income,addIncome}