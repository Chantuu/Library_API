const bookRepository = require("../repositories/bookRepository");


async function getBooksRoute(req, res) {
    const books = await bookRepository.getAllBooks();
    await bookRepository.disconnectFromDb();

    res.json(books);
}

async function createBookRoute(req, res) {
    const newBook = await bookRepository.createBook({...req.body});
    await newBook.save();
    await bookRepository.disconnectFromDb();

    res.json(newBook);
}

async function displayBookByIdRoute(req, res) {
    const { bookId } = req.params;
    const book = await bookRepository.getBookById(bookId);
    await bookRepository.disconnectFromDb();

    res.json(book);
}

async function patchBookRoute(req, res) {
    const { bookId } = req.params;
    const updatedBook = await bookRepository.getBookByIdAndUpdate(bookId, {...req.body});
    await bookRepository.disconnectFromDb();

    res.json(updatedBook);
}

async function deleteBookRoute(req, res) {
    const {bookId} = req.params;
    const deletedBook = await bookRepository.getBookByIdAndDelete(bookId);
    await bookRepository.disconnectFromDb();

    res.json(deletedBook);
}


module.exports.getBooksRoute = getBooksRoute;
module.exports.createBookRoute = createBookRoute;
module.exports.displayBookByIdRoute = displayBookByIdRoute;
module.exports.patchBookRoute = patchBookRoute;
module.exports.deleteBookRoute = deleteBookRoute;
