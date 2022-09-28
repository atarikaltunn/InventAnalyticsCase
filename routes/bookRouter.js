const express = require('express');
const db = require('../config/database');
const Book = require('../models/Book');

const router = express.Router();

//Get Books
router.get('/', async (req, res) => {
    await Book.findAll()
        .then((books) => {
            if (books) {
                var allBooks = [];
                books.map((book) => {
                    // console.log(user.dataValues);
                    var newBook = {
                        id: book.dataValues.id,
                        name: book.dataValues.name,
                    };
                    console.log(newBook);
                    allBooks.push(newBook);
                });
                // console.log(allUsers)
                res.send(allBooks).status(200);
            } else {
                console.log('There is no book in library.');
                res.status(404);
            }
        })
        .catch((err) => {
            console.log('Error: ' + err);
            res.status(400)
        });
    // res.send("get localhost/books")
});

//Get Book
router.get('/:id', async (req, res) => {
    // console.log(req.params.id);
    await Book.findOne({ where: { id: req.params.id } })
        .then((findedBook) => {
            if (findedBook) {
                // console.log("findedBook is: " + findedBook.name);
                if (findedBook.score) {
                    // console.log(findedBook.score)
                    var book = {
                        id: findedBook.id,
                        name: findedBook.name,
                        score: findedBook.score,
                    };
                    res.send(book).status(200);
                } else {
                    // console.log(-1)
                    var book = {
                        id: findedBook.id,
                        name: findedBook.name,
                        score: -1,
                    };
                    res.send(book).status(200);
                }
            } else {
                console.log(
                    `searching book with id: ${req.params.id} is not found`
                );
                res.sendStatus(404);
            }
        })
        .catch((err) => {
            console.log('****Error occured while getting a book!*****');
            console.log('Error: ' + err);
            res.status(400);
        });

    // res.send("get localhost/books/:id")
});

//Create Book
router.post('/', async (req, res) => {
    const data = {
        name: req.body.name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    let { name, createdAt, updatedAt } = data;

    await Book.create({
        name,
        createdAt,
        updatedAt,
    })
        .then(() => {
            console.log('book added succesfully');
            res.status(201);
        })
        .catch((err) => {
            console.log('***Error occured while adding a book****');
            console.log(err);
        });
    // res.send("post localhost/books")
});

module.exports = router;
