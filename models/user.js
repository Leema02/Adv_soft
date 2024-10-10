const { sequelize } = require("./config.js");
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
  },
  role: {
    type: DataTypes.ENUM("u", "a", "e","o"),
    defaultValue: "u",
  },
});

const OwnerNearME = async (Usercity) => {
  const sqlQuery = `SELECT UID FROM Users WHERE City = :Usercity AND role = 'o'`;

  const result = await sequelize.query(sqlQuery, {
      replacements: { Usercity },
      type: QueryTypes.SELECT,
  });
  console.log("Query result:", result);

  return result;
}

const findUserById=async(id)=>{

  const sqlQuery = `SELECT * FROM Users WHERE  UID =: id`;

  const result = await sequelize.query(sqlQuery, {
      replacements: { id },
      type: QueryTypes.SELECT,
  });
  console.log("Query result:", result);

  return result[0];
}


module.exports ={user,OwnerNearME};
