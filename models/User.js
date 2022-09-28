const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    past: {
      type: Sequelize.JSON,
    },
    active: {
      type: Sequelize.JSON,
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


module.exports = User;
