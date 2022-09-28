const express = require("express");
const db = require("../config/database");
const User = require("../models/User");

const router = express.Router();


//Get All Users
router.get("/", (req, res) => {
  User.findAll()
    .then(users => {
        console.log(users);
        res.sendStatus(200);
    })
    .catch(err => console.log("Error: "+ err))
});

//Get User
router.get("/:id", (req, res) => {
  res.send("get localhost/users/:id");
});

//Create User
router.post("/", (req, res) => {
  res.send("post localhost/users");
});

//Borrow Book
router.post("/:id/borrow/:bookid", (req, res) => {
  res.send("post localhost/users/:id/borrow/:bookid");
});

//Return Book
router.post("/:id/return/:bookid", (req, res) => {
  res.send("post localhost/users/:id/return/:bookid");
});


module.exports = router;
