const express = require('express');
const db = require('../config/database');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    await User.findOne({ where: { id: req.params.id } })
        .then((user) => {
            if (user) {
                if (user.active) {
                    console.log(
                        'user can return book'
                    );
                    next();
                } else {
                    console.log(`The user: ${user.name} does not have a book.`)
                    res.status(500).send(`The user: ${user.name} does not have a book so can not return book.`)
                }
            } else {
                console.log(`There is no user with name: ${req.params.id}.`);
                res.status(404).send(`There is no user with name: ${req.params.id}.`);
            }
        })
        .catch((err) => {
            console.log('Error: ' + err);
            res.status(500).send('Server error');
            next();
        });
};