//a middleware that controls if borrower of book and person wants to return a book are same.
//By controlling this we ensure that book can not get returned by someone else than borrower.
//the main control process is at line 16. 

const express = require('express');
const db = require('../config/database');
const User = require('../models/User');
const Book = require('../models/Book');

module.exports = async (req, res, next) => {
    await User.findOne({ where: { id: req.params.id } })
    .then(async (user) => {
        await Book.findOne({ where: { id: req.params.bookid } })
        .then((book) => {
            console.log(user.dataValues.active[0].name + ' ' + book.name);
            if (user.dataValues.active[0].name != book.name) {
                console.log(`user: ${user.name} can not give other person's book.`);
                res.status(401).send("you can not return other's book")
            } else {
                next();
            }
        })
        .catch(err => {
            console.log("Error-1 at is returner the owner middleware: " + err)
            res.status(500).send("Server error")
        });
    })
    .catch(err => {
        console.log("Error-2 at is returner the owner middleware: " + err)
        res.status(500).send("Server error")
    });
};
