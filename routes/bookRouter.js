//a router that routes requests about localhost/books

const express = require('express');
const db = require('../config/database');
const Book = require('../models/Book');
const bookController = require('../controller/bookController')

const router = express.Router();

//Get Books
router.route('/').get(bookController.getAllBooks);

//Get Book
router.route('/:id').get(bookController.getBook);

//Create Book
router.route('/').post(bookController.createBook);

// router.route('/delete/deleteAll').get(bookController.deleteAllBooks);


module.exports = router;
