//a router that routes requests about localhost/users

const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const User = require('../models/User');
const Book = require('../models/Book');
const userController = require('../controller/userController');
const userExistsMiddleware = require('../middlewares/userExistsMiddleware');
const isBookTakenMiddleware = require('../middlewares/isBookTakenMiddleware');
const isBookNotTakenMiddleware = require('../middlewares/isBookNotTakenMiddleware');
const userHasBookMiddleware = require('../middlewares/userHasBookMiddleware');
const userNotHasBookMiddleware = require('../middlewares/userNotHasBookMiddleware');
const isReturnerTheOwner = require('../middlewares/isReturnerTheOwner');

const router = express.Router();

//Get All Users
router.route('/').get(userController.getAllUsers);

//Get User
router.route('/:id').get(userController.getUser);

//Create User
router.route('/').post(
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
    //validation that checks if name contains letters and spaces
    body(
        'name',
        'Name can only contain letters and spaces' 
    ).matches(/[a-zA-Z ]*$/),
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
router
    .route('/:id/borrow/:bookid')
    .post(
        userExistsMiddleware,
        userHasBookMiddleware,
        isBookTakenMiddleware,
        userController.borrowBook
    );

//Return Book
router.route('/:id/return/:bookid').post(
    userExistsMiddleware,
    userNotHasBookMiddleware,
    isBookNotTakenMiddleware,
    isReturnerTheOwner,
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

    userController.returnBook
);

//Delete All Users
// router.route('/delete/deleteAll').get();

module.exports = router;
