const {DataTypes, QueryTypes, Op, QueryError} = require("sequelize");
const { sequelize } = require("./config.js");

const expert = sequelize.define(
  "expert",
  {
    expertId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "UID",
      },
      primaryKey: true,
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
  },
  {
    timestamps: false,
  }
);


const findExpertToAssign = async (catId) => {
  const sqlQuery = `SELECT expertId FROM experts WHERE catId = :catId ORDER BY RAND() LIMIT 1`;

  const expertResult = await sequelize.query(sqlQuery, {
      replacements: { catId },
      type: QueryTypes.SELECT,
  });

  return expertResult[0]; 
};

const addExpert = async (id , catId) => {

    const sqlQuery = `INSERT INTO experts(expertId , catId) VALUES(:id,:catId);`;

    return await sequelize.query(sqlQuery, {
        replacements:{
            id:id,
            catId:catId
        },
        type:QueryTypes.INSERT
    });

};

module.exports = {expert,findExpertToAssign, addExpert};
