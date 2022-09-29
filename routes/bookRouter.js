//a router that routes requests about localhost/books

const express = require('express');
const db = require('../config/database');
const Book = require('../models/Book');
const bookController = require('../controller/bookController');

const router = express.Router();

//Get Books
router.route('/').get(
    bookController.getAllBooks      //function that returns all books with id and name 
);

//Get Book
router.route('/:id').get(
    bookController.getBook          //function that returns a book with id, name and score. If has no score, returns -1 as score 
);

//Create Book
router.route('/').post(
    bookController.createBook       //function that creates a book with given name
);

//Delete All Books
// router.route('/delete/deleteAll').get(bookController.deleteAllBooks);       //function to use while testing

module.exports = router;
