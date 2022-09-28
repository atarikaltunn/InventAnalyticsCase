const express = require('express');
const db = require('../config/database');
const User = require('../models/User');
const Book = require('../models/Book');
const userExistsMiddleware = require('../middlewares/userExistsMiddleware');
const isBookTakenMiddleware = require('../middlewares/isBookTakenMiddleware');
const isBookNotTakenMiddleware = require('../middlewares/isBookNotTakenMiddleware');
const userHasBookMiddleware = require('../middlewares/userHasBookMiddleware');
const userNotHasBookMiddleware = require('../middlewares/userNotHasBookMiddleware');
const isReturnerTheOwner = require('../middlewares/isReturnerTheOwner');

const router = express.Router();

//Get All Users
router.get('/', async (req, res) => {
    await User.findAll()
        .then((users) => {
            if (users) {
                var allUsers = [];
                users.map((user) => {
                    // console.log(user.dataValues);
                    var newUser = {
                        id: user.dataValues.id,
                        name: user.dataValues.name,
                    };
                    console.log(newUser);
                    allUsers.push(newUser);
                });
                // console.log(allUsers)
                res.send(allUsers).status(200);
            } else {
                console.log('There is no user in library.');
                res.status(404);
            }
        })
        .catch((err) => {
            console.log('Error: ' + err);
            res.status(500);
        });
});

//Get User
router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    // const user = await User.findOne({ where: { id: req.params.id } });
});

//Create User
router.post('/', async (req, res) => {
    const data = {
        name: req.body.name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    let { name, createdAt, updatedAt } = data;

    await User.create({
        name,
        createdAt,
        updatedAt,
    })
        .then(() => {
            console.log('user added succesfully');
            res.status(201).send(`user: ${name} added succesfully`);
        })
        .catch((err) => {
            console.log('***Error occured while adding a user****');
            console.log(err);
            res.status(500).send(`An Error occured while adding user: ${name}`);
        });
    // res.send('post localhost/users');
});

//Borrow Book
router
    .route('/:id/borrow/:bookid')
    .post(
        userExistsMiddleware,
        userHasBookMiddleware,
        isBookTakenMiddleware,
        async (req, res) => {
            let userID = req.params.id,
                bookID = req.params.bookid;
            console.log(userID + ' ' + bookID);

            const user = await User.findOne({ where: { id: userID } });
            const book = await Book.findOne({ where: { id: bookID } });

            // console.log(user.dataValues);
            // console.log(book.dataValues);
            // console.log(user.active);
            if (user.active) {
                var active = [
                    ...user.active,
                    {
                        name: book.name,
                    },
                ];
            } else {
                var active = [
                    {
                        ...user.active,
                        name: book.name,
                    },
                ];
            }
            // console.log(active);

            await User.update(
                { active: active },
                {
                    where: {
                        id: userID,
                    },
                }
            )
                .then(async () => {
                    await Book.update(
                        { isTaken: true },
                        {
                            where: {
                                id: bookID,
                            },
                        }
                    )
                        .then(() => {
                            console.log(
                                `book: ${book.name} has been given succesfully`
                            );
                        })
                        .catch((err) => {
                            console.log(
                                `An error occured while giving the book: ${book.name}`
                            );
                            console.log('Error: ' + err);
                            res.status(500).send(
                                `An error occured while giving the book: ${book.name}`
                            );
                        });
                    console.log(
                        `book: ${book.name} has been taken succesfully by ${user.name}`
                    );
                    res.status(200).send(
                        `book: ${book.name} has been taken succesfully by ${user.name}`
                    );
                })
                .catch((err) => {
                    console.log(
                        `An error occured while taking the book: ${book.name} by ${user.name}`
                    );
                    console.log('Error: ' + err);
                    res.status(500).send(
                        `An error occured while taking the book: ${book.name} by ${user.name}`
                    );
                });

            // res.send('post localhost/users/:id/borrow/:bookid');
        }
    );

//Return Book
router
    .route('/:id/return/:bookid')
    .post(
        userExistsMiddleware,
        userNotHasBookMiddleware,
        isBookNotTakenMiddleware,
        isReturnerTheOwner,
        async (req, res) => {
            let userID = req.params.id,
                bookID = req.params.bookid,
                score = req.body.score;
            console.log(userID + ' ' + bookID + ' ' + score);

            const user = await User.findOne({ where: { id: userID } });
            const book = await Book.findOne({ where: { id: bookID } });
            
            score =
                ((book.score * book.totalScoreCount) + score) /
                (book.totalScoreCount + 1);

            console.log(score);
            if (user.past) {
                var past = [
                    ...user.past,
                    {
                        name: book.name,
                        score: score,
                    },
                ];
            } else {
                var past = [
                    {
                        ...user.past,
                        name: book.name,
                        score: score,
                    },
                ];
            }
            bookScore = book.score;

            await User.update(
                { past: past, active: null },
                {
                    where: {
                        id: userID,
                    },
                }
            )
                .then(async () => {
                    await Book.update(
                        {
                            isTaken: false,
                            score: req.body.score,
                            totalScoreCount: book.totalScoreCount + 1
                        },
                        {
                            where: {
                                id: bookID,
                            },
                        }
                    )
                        .then(() => {
                            console.log(
                                `book: ${book.name} has been returned succesfully`
                            );
                        })
                        .catch((err) => {
                            console.log(
                                `An error occured while returning the book: ${book.name}`
                            );
                            console.log('Error: ' + err);
                            res.status(500).send(
                                `An error occured while returning the book: ${book.name}`
                            );
                        });
                    console.log(
                        `book: ${book.name} has been returned succesfully by ${user.name}`
                    );
                    res.status(200).send(
                        `book: ${book.name} has been returned succesfully by ${user.name}`
                    );
                })
                .catch((err) => {
                    console.log(`An error occured while returning the book: ${book.name} by ${user.name}`);
                    console.log('Error: ' + err);
                    // res.status(500).send(`An error occured while returning the book: ${book.name} by ${user.name}`);
                });
        }
    );

// router.get('/delete/deleteAll', async (req, res) => {
//     await User.destroy({ truncate: true })
//         .then(() => console.log('deleted succesfully'))
//         .catch((err) => {
//             console.log('*****Error occured while deleting all users*****');
//             console.log('Error: ' + err);
//         });
// });

module.exports = router;
