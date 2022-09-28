//a router that routes requests about localhost/users


const express = require('express');
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
router.route('/').post(userController.createUser);

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
router
    .route('/:id/return/:bookid')
    .post(
        userExistsMiddleware,
        userNotHasBookMiddleware,
        isBookNotTakenMiddleware,
        isReturnerTheOwner,
        userController.returnBook
    );

//Delete All Users
// router.route('/delete/deleteAll').get();

module.exports = router;
