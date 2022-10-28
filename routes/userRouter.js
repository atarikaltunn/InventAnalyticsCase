//a router that routes requests about localhost/users

const express = require('express');
const { body, validationResult } = require('express-validator');

const userController = require('../controller/userController');

const userExists = require('../middlewares/userExistsMiddleware');
const isReturnerTheBorrower = require('../middlewares/isReturnerTheBorrowerMiddleware');

const nameCharsValidator = require('../middlewares/nameCharsValidator');
const nameLengthValidator = require('../middlewares/nameLengthValidator');
const scoreMinMaxValidator = require('../middlewares/scoreMinMaxValidator');

const router = express.Router();

//Get All Users
router.route('/').get(
    userController.getAllUsers      //function that returns all users with id and name
);

//Get User
router.route('/:id').get(
    userController.getUser          //funciton that returns a user with id, name and past and present history if has
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
    }),nameLengthValidator,         //validates name length

    // validation to check name characters
    body(
        'name',
        'Name only can contain letters and spaces'
    ).matches(
        /^[A-Za-zğüşöçıİĞÜŞÖÇ\s]+$/ //regular expression to check does name contain only letters and spaces
    ), nameCharsValidator,     //validates characters have only letters and spaces

    userController.createUser       //function to create user with given name
);

//Borrow Book
router.route('/:id/borrow/:bookid').post(
    userExists,                     //if user exists then user can borrow a book
    userController.borrowBook       //borrow book function that where database updates are happen
);

//Return Book
router.route('/:id/return/:bookid').post(
    userExists,                     //if user exists so can return book
    isReturnerTheBorrower,          //if returner is different from book borrower then returner is not able to return that book

    //score validator that checks score is between 0-10
    body(
        'score',
        'Score must be a number between 0 and 10'
    ).isInt({
        min: 0,
        max: 10,
    }), scoreMinMaxValidator,       //validates score is in given range

    userController.returnBook       // return book function that where db updates are happen
);

//Delete All Users
// router.route('/delete/deleteAll').get(); //function to use while testing

module.exports = router;
