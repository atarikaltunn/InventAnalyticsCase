const express = require('express');
const db = require('../config/database');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    await User.findOne({ where: { id: req.params.id } })
        .then(user => {
            if(user){
                console.log("user found, middlewares completed, next")
                next();
            } else {
                console.log(`Searching user with id: ${req.params.id} is not found.`);
                res.status(404).send('You are not a user')
            }
        })
        .catch(err => {
            console.log("Error: " + err);
            res.status(500).send('Server error')
        });
};
