//a router that routes requests about localhost/users

const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const User = require('../models/User');
const Book = require('../models/Book');
const userController = require('../controller/userController');
const userExists = require('../middlewares/userExistsMiddleware');
const isBookTaken = require('../middlewares/isBookTakenMiddleware');
const isBookNotTaken = require('../middlewares/isBookNotTakenMiddleware');
const userHasBook = require('../middlewares/userHasBookMiddleware');
const userNotHasBook = require('../middlewares/userNotHasBookMiddleware');
const isReturnerTheBorrower = require('../middlewares/isReturnerTheBorrowerMiddleware');

const router = express.Router();

//Get All Users
router.route('/').get(
    userController.getAllUsers  //function that returns all users with id and name
);

//Get User
router.route('/:id').get(
    userController.getUser      //funciton that returns a user with id, name and past and present history if has
);

//Create User
router.route('/').post(
    // validation to check name length
    body(
        'name',
        'Name length should not be less than 6, no longer than 43(safety rules)' //no one gonna know...
    ).isLength({
        min: 6,
        max: 43,
    }),
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        next();
    },
    // validation to check name characters
    body('name', 'Name only can contain letters and spaces').matches(
        /^[A-Za-zğüşöçıİĞÜŞÖÇ\s]+$/
    ),
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        next();
    },
    userController.createUser
);

//Borrow Book
router.route('/:id/borrow/:bookid').post(
    userExists,                 //if user exists then user can borrow a book
    userHasBook,                //if user has a book then user can not take a new book without returning that book
    isBookTaken,                //if a book is borrowed before and not returned then a user can not borrow it again
    userController.borrowBook   //borrow book function that where database updates are happen
);

//Return Book
router.route('/:id/return/:bookid').post(
    userExists,             //if user exists so can return book
    userNotHasBook,         //if user do not have any book then can not return a book
    isBookNotTaken,         //if book is not taken from the library before then the book can not be returnable
    isReturnerTheBorrower,  //if returner is different from book borrower then returner is not able to return that book

    //score validator that checks score is between 0-10
    body('score', 'Score must be a number between 0 and 10').isInt({
        min: 0,
        max: 10,
    }),
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        next();
    },

    userController.returnBook // return book function that where db updates are happen
);

//Delete All Users
// router.route('/delete/deleteAll').get(); //function to use while testing

module.exports = router;
