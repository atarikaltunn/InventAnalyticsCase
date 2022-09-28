const { Sequelize } = require("sequelize");

//Database Connection
module.exports = new Sequelize("library", "atarikaltunn", "Istanbul123", {
    host: "localhost",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });