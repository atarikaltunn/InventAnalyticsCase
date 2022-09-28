const express = require('express');
const db = require('../config/database');
const User = require('../models/User');

const router = express.Router();

//Get All Users
router.get('/', async (req, res) => {
    await User.findAll()
        .then((users) => {
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
            res.send(allUsers);
        })
        .catch((err) => console.log('Error: ' + err));
});

//Get User
router.get('/:id', async (req, res) => {
    console.log(req.params.id)
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
            res.status(201);
        })
        .catch((err) => {
            console.log('***Error occured while adding a user****');
            console.log(err);
        });
    // res.send('post localhost/users');
});

//Borrow Book
router.post('/:id/borrow/:bookid', (req, res) => {
    res.send('post localhost/users/:id/borrow/:bookid');
});

//Return Book
router.post('/:id/return/:bookid', (req, res) => {
    res.send('post localhost/users/:id/return/:bookid');
});

router.get('/delete/deleteAll', async (req, res) => {
    await User.destroy({ truncate: true })
        .then(() => console.log('deleted succesfully'))
        .catch((err) => {
            console.log('*****Error occured while deleting all users*****');
            console.log('Error: ' + err);
        });
});

module.exports = router;
