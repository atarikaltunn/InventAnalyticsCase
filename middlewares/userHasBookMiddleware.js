//a middleware that controls a user who wants to borrow a book has a book or not.
//if user has a book, middleware does not allow user to borrow new one without returning old book.

const express = require('express');
const db = require('../config/database');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    await User.findOne({ where: { id: req.params.id } })
        .then((user) => {
            if (user) {
                if (!user.active) {
                    console.log(
                        'user can take book'
                    );
                    next();
                } else {
                    console.log(`The user: ${user.name} have a book.`)
                    res.status(500).send(`The user: ${user.name} have a book so can not take new book.`)
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