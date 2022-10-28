const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
    await Book.findAll({
        attributes: ['id', 'name'],
    }) //finds all books
        .then((books) => onGetAllBooks(books, res))
        .catch((err) => logError(err, this.name, res));
};


exports.getBook = async (req, res) => {
    await Book.findOne({
        attributes: ['id', 'name', 'score'],
        where: { id: req.params.id },
    })
        .then((book) => onGetBook(book, res))
        .catch((err) => logError(err, this.name, res));
};

exports.createBook = async (req, res) => {
    const name= req.body.name,
        createdAt= Date.now(),
        updatedAt= Date.now();

    await Book.create({
        name,
        createdAt,
        updatedAt,
    })
        .then(() => onCreateBook(name, res))
        .catch((err) => logError(err, this.name, res));
};

// exports.deleteAllBooks = async (req, res) => {
//     await Book.destroy({ truncate: true })
//         .then(() => console.log('deleted succesfully'))
//         .catch((err) => {
//             console.log('*****Error occured while deleting all books*****');
//             console.log('Error: ' + err);
//         });
// };


function onGetAllBooks(books,res){
    switch (true) {
        case isNull(books):
            // console.log('All books are found.');
            res.status(404);
            break;
        case isNull(!books):
            // console.log('All books are found.');
            res.send(books).status(200);
            break;
        default:
            res.status(500);
            break;
    }
}

function onGetBook(book, res){
    switch (true) {
        case isNull(book):
            res.status(404);
            break;
        case isNull(!book):
            var book = {
                id: book.id,
                name: book.name,
                score: isNull(book.score) ? -1 : book.score,
            };
            res.send(book).status(200);
            break;
        default:
            res.send(500);
            break;
    }
}

function onCreateBook(name, res){
    res.status(201).send(`book: ${name} added succesfully`);
}


function logError(err, errLocation, res) {
    console.log(`Error occured at: ${errLocation}` + '\nError: ' + err);
    res.status(500);
}

function isNull(obj) {
    return obj ? false : true;
}