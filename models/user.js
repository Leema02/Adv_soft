const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

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
  UPoints: {
    type: DataTypes.INTEGER, // money back 
    defaultValue: 0,
  },
  avgRating: {
    type: DataTypes.DOUBLE(11, 10), //review 
    defaultValue: 0.0,
  },
  loyalty: {
    type: DataTypes.STRING, // .1  ==> 1 silver 2 gold  
  },
  role: {
    type: DataTypes.ENUM("u", "a", "e","o"),
    defaultValue: "u",
  },
});

module.exports = user;
