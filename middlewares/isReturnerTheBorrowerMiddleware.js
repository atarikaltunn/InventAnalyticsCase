//a middleware that controls if borrower of book and person wants to return a book are same.
//By controlling this we ensure that book can not get returned by someone else than borrower.
//the main control process is at line 16.

const User = require('../models/User');
const Book = require('../models/Book');

module.exports = async (req, res, next) => {
    await User.findOne({
        attributes: ['name', 'active'],
        where: { id: req.params.id },
    })
        .then((user) => {
            switch (true) {
                case isNull(!user.active):
                    const returnedBook = user.active.name;
                    break;
                case isNull(user.active):
                    res.status(500);
                    break;
                default:
                    res.status(500);
            }
        })
        .catch((err) => logError(err, this.name, res));

    await Book.findOne({
        attributes: ['name'],
        where: { id: req.params.bookid },
    })
        .then((book) => {
            switch (true) {
                case isNull(!book.name):
                    const bookName = book.name;
                    break;
                case isNull(book):
                    res.status(500);
                    break;
                default:
                    res.status(500);
                    break;
            }
        })
        .catch((err) => logError(err, this.name, res));

    switch (true) {
        case returnedBook == bookName:
            next();
            break;
        case returnedBook != bookName:
            res.status(500);
            break;
        default:
            res.status(500);
            break;
    }
};

function logError(err, errLocation, res) {
    console.log(`Error occured at: ${errLocation}` + '\nError: ' + err);
    res.status(500);
}

function isNull(obj) {
    return obj ? false : true;
}
