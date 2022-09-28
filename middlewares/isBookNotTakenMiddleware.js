const express = require('express');
const db = require('../config/database');
const Book = require('../models/Book');

module.exports = async (req, res, next) => {
    await Book.findOne({ where: { id: req.params.bookid } })
        .then((book) => {
            if (book) {
                if (book.isTaken) {
                    console.log(
                        'book can be returned'
                    );
                    next();
                } else {
                    console.log(`The book: ${book.name} was not taken before.`)
                    res.status(500).send(`The book: ${book.name} was not taken before.`)
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