//database config file

const { Sequelize } = require("sequelize");
require('dotenv').config()

//Database Connection
module.exports = new Sequelize(process.env.DBNAME, process.env.DBUSERNAME, process.env.DBPASSWORD, {
    host: process.env.HOST,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });