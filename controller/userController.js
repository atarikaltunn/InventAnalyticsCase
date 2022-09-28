//a controller that responding the requests about localhost/users

const express = require('express');
const db = require('../config/database');
const User = require('../models/User');
const Book = require('../models/Book');

exports.getAllUsers = async (req, res) => {
    await User.findAll() //finds all users
        .then((users) => {
            if (users) {
                //if there is users maps them to translate json
                var allUsers = [];
                users.map((user) => {
                    var newUser = {
                        id: user.dataValues.id,
                        name: user.dataValues.name,
                    };
                    allUsers.push(newUser);
                });
                console.log('All users are found.');
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
};

exports.getUser = async (req, res) => {
    await User.findOne({ where: { id: req.params.id } })
        .then((findedUser) => {
            if (findedUser) {
                if (findedUser.past && findedUser.active) {
                    //finds user with both past and present history
                    var user = {
                        id: findedUser.id,
                        name: findedUser.name,
                        books: {
                            past: findedUser.past,
                            present: findedUser.active,
                        },
                    };
                    console.log('user found with past and present history');
                    res.send(user).status(200);
                } else if (findedUser.past && !findedUser.active) {
                    //finds user with past and no present history
                    var user = {
                        id: findedUser.id,
                        name: findedUser.name,
                        books: {
                            past: findedUser.past,
                            present: [],
                        },
                    };
                    console.log('user found with past and no present history');

                    res.send(user).status(200);
                } else if (!findedUser.past && findedUser.active) {
                    //finds user with both no past but present history
                    var user = {
                        id: findedUser.id,
                        name: findedUser.name,
                        books: {
                            past: [],
                            present: findedUser.active,
                        },
                    };
                    console.log('user found with no past but present history');

                    res.send(user).status(200);
                } else {
                    //finds user with neither past nor present history
                    var user = {
                        id: findedUser.id,
                        name: findedUser.name,
                        books: {
                            past: [],
                            present: [],
                        },
                    };
                    console.log(
                        'user found with neither past nor present history'
                    );
                    res.send(user).status(200);
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
            res.status(500);
        });
};

exports.createUser = async (req, res) => {
    const data = {
        name: req.body.name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    let { name, createdAt, updatedAt } = data;

    await User.create({
        //creates user with given name and createdAt and updatedAt datas
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
};

exports.borrowBook = async (req, res) => {
    let userID = req.params.id,
        bookID = req.params.bookid;

    const user = await User.findOne({ where: { id: userID } });
    const book = await Book.findOne({ where: { id: bookID } });

    if (user.active) {
        //if user has present history
        var active = [
            ...user.active,
            {
                name: book.name,
            },
        ];
    } else {
        //if user does not have present history
        var active = [
            {
                ...user.active,
                name: book.name,
            },
        ];
    }

    await Book.update(
        //book update starts
        {
            isTaken: true,
            updatedAt: Date.now(),
        },
        {
            where: {
                id: bookID,
            },
        }
    )

        .then(async () => {
            //when updating book completed (library gives the book)
            console.log(`book: ${book.name} has been given succesfully`);
            await User.update(
                //updates user
                {
                    active: active,
                    updatedAt: Date.now(),
                },
                {
                    where: {
                        id: userID,
                    },
                }
            )
                .then(() => {
                    // user takes the book
                    console.log(
                        `book: ${book.name} has been taken succesfully by ${user.name}`
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
};

exports.returnBook = async (req, res) => {
    let userID = req.params.id,
        bookID = req.params.bookid,
        score = req.body.score;

    //finds user and book with given ids
    const user = await User.findOne({ where: { id: userID } });
    const book = await Book.findOne({ where: { id: bookID } });

    //calculates the average score for book with old scores
    score =
        (book.score * book.totalScoreCount + score) /
        (book.totalScoreCount + 1);

    if (user.past) {
        //if user has a past history
        var past = [
            ...user.past,
            {
                name: book.name,
                score: req.body.score,
            },
        ];
    } else {
        //if user does not have a past history
        var past = [
            {
                ...user.past,
                name: book.name,
                score: req.body.score,
            },
        ];
    }

    await User.update(
        //book return starts
        {
            past: past,
            active: null,
            updatedAt: Date.now(),
        },
        {
            where: {
                id: userID,
            },
        }
    )
        .then(async () => {
            //user gives the book back
            await Book.update(
                {
                    isTaken: false,
                    score: score,
                    totalScoreCount: book.totalScoreCount + 1,
                    updatedAt: Date.now(),
                },
                {
                    where: {
                        id: bookID,
                    },
                }
            )
                .then(() => {
                    //book is succesfully returns back
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
            console.log(
                `An error occured while returning the book: ${book.name} by ${user.name}`
            );
            console.log('Error: ' + err);
            res.status(500).send(
                `An error occured while returning the book: ${book.name} by ${user.name}`
            );
        });
};

// exports.deleteAllUsers = async (req, res) => {
//     await User.destroy({ truncate: true })
//         .then(() => console.log('deleted succesfully'))
//         .catch((err) => {
//             console.log('*****Error occured while deleting all users*****');
//             console.log('Error: ' + err);
//         });
// };
