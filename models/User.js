const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define(
    'user',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
        },
        active: {
            type: Sequelize.ARRAY(Sequelize.JSON),
            allowNull: true
        },
        past: {
            type: Sequelize.ARRAY(Sequelize.JSON),
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    },
    {
        freezeTableName: true,
    }
);

module.exports = User;
