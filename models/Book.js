const Sequelize = require("sequelize");
const db = require("../config/database");

const Book = db.define(
  "book",
  {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
    },
    score: {
        type: Sequelize.FLOAT
    },
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    }
  },
  {
    freezeTableName: true,
  }
);


module.exports = Book;
