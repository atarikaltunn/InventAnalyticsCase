const express = require("express");
const router = express.Router();


//Get Books
router.get("/", (req, res) => {
    res.send("get localhost/books")
});

//Get Bok
router.get("/:id", (req, res) => {
    res.send("get localhost/books/:id")
});

//Create Book
router.post("/", (req, res) => {
    res.send("post localhost/books")
});


module.exports = router;