//a middleware that controls if book is taken or not. If book is taken before middleware
//does not allow the user to borrow book.

const express = require('express');
const db = require('../config/database');
const Book = require('../models/Book');

module.exports = async (req, res, next) => {
    await Book.findOne({ where: { id: req.params.bookid } })
        .then((book) => {
            if (book) {
                if (!book.isTaken) {
                    console.log(
                        'book is not taken, middlewares completed, next'
                    );
                    next();
                } else {
                    console.log(`The book: ${book.name} was taken from another user.`)
                    res.status(500).send(`The book: ${book.name} was taken from another user.`)
                }
            } else {
                console.log(`Searching book with id: ${req.params.bookid} is not found.`);
                res.status(404).send(`Searching book with id: ${req.params.bookid} is not found.`);
            }
        })
        .catch((err) => {
            console.log('Error: ' + err);
            res.status(500).send('Server error');
            next();
        });
};
