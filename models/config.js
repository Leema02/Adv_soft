const { Sequelize } = require("sequelize");
require('dotenv').config();
const sequelize = new Sequelize("rent_it_out",process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
});


const db = {};
db.sequelize = sequelize;
module.exports = db;