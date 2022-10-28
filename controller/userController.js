//a controller that responding the requests about localhost/users

const User = require('../models/User');
const Book = require('../models/Book');

exports.getAllUsers = async (req, res) => {
    await User.findAll({
        attributes: ['id', 'name'],
    }) //finds all users
        .then((users) => onGetAllUsers(users, res))
        .catch((err) => logError(err, this.name, res));
};

exports.getUser = async (req, res) => {
    await User.findOne({
        attributes: ['id', 'name', 'past', 'active'],
        where: { id: req.params.id },
    })
        .then((user) => onGetUser(user, res))
        .catch((err) => logError(err, this.name, res));
};

exports.createUser = async (req, res) => {
    const name = req.body.name,
        createdAt = Date.now(),
        updatedAt = Date.now();

    await User.create({
        //creates user with given name and createdAt and updatedAt datas
        name,
        createdAt,
        updatedAt,
    })
        .then(() => onCreateUser(name, res))
        .catch((err) => logError(err, this.name, res));
};

exports.borrowBook = async (req, res) => {
    const userID = req.params.id,
        bookID = req.params.bookid;

    const user = await User.findOne({ where: { id: userID } });
    const book = await Book.findOne({ where: { id: bookID } });

    const active = [
        {
            ...user.active,
            name: book.name,
        },
    ];

    updateBookOnBorrow(bookID, res);
    updateUserOnBorrow(user, book, userID, active, res);

    res.status(204);
};

exports.returnBook = async (req, res) => {
    const userID = req.params.id,
        bookID = req.params.bookid;

    let score = req.body.score;

    //finds user and book with given ids
    const user = await User.findOne({ where: { id: userID } });
    const book = await Book.findOne({ where: { id: bookID } });

    //calculates the average score for book with old scores
    score =
        (book.score * book.totalScoreCount + score) /
        (book.totalScoreCount + 1);

    //if user has a past history
    var past = [
        ...user.past,
        {
            name: book.name,
            score: req.body.score,
        },
    ];

    updateBookOnReturn(book, bookID, score);
    updateUserOnReturn(userID, past, res);

    res.status(204);
};

// exports.deleteAllUsers = async (req, res) => {
//     await User.destroy({ truncate: true })
//         .then(() => console.log('deleted succesfully'))
//         .catch((err) => {
//             console.log('*****Error occured while deleting all users*****');
//             console.log('Error: ' + err);
//         });
// };

//Controller Funcitons

function onGetAllUsers(users, res) {
    switch (true) {
        case isNull(users):
            // console.log('All users are found.');
            res.status(404);
            break;
        case isNull(!users):
            // console.log('All users are found.');
            res.send(users).status(200);
            break;
        default:
            // console.log('no user found');
            res.status(500);
            break;
    }
}

function onGetUser(user, res) {
    switch (true) {
        case isNull(user):
            res.status(404);
            break;
        case isNull(!user):
            var user = {
                id: user.id,
                name: user.name,
                books: {
                    past: isNull(user.past) ? [] : user.past,
                    present: isNull(user.active) ? [] : user.active,
                },
            };
            res.send(user).status(200);
            break;
        default:
            console.log('something went wrong');
            // res.send(404);
            break;
    }
}

function onCreateUser(name, res) {
    res.status(201).send(`user: ${name} added succesfully`);
}

async function updateBookOnBorrow(bookID, res) {
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
    ).catch((err) => logError(err, updateBookOnBorrow.name, res));
}
async function updateUserOnBorrow(user, book, userID, active, res) {
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
    ).catch((err) => logError(err, updateUserOnBorrow.name, res));
}

async function updateBookOnReturn(book, bookID, score) {
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
    ).catch((err) => logError(err, updateBookOnReturn.name, res));
}
async function updateUserOnReturn(userID, past, res) {
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
    ).catch((err) => logError(err, updateUserOnReturn.name, res));
}

//Error functions
function logError(err, errLocation, res) {
    console.log(`Error occured at: ${errLocation}` + '\nError: ' + err);
    res.status(500);
}

function isNull(obj) {
    return obj ? false : true;
}
