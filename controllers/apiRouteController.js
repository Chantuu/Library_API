const BookRepository = require("../repositories/bookRepository");
const {validationResult, matchedData} = require("express-validator");
const {ValidationError} = require("../utilities/errors");
const {createBookJsonResponse, createErrorResponse} = require('../utilities/jsonResponseCreator');
const {validationJsonErrorMessage, validationIdErrorMessage} = require("../utilities/errorMessages");
const UserRepository = require("../repositories/userRepository");


/**
 *  This function takes all available book documents from database
 *  and sends to the end client as an array of book documents in JSON format.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 */
async function getBooksRoute(req, res) {
    const books = await BookRepository.getAllBooks();
    await BookRepository.disconnectFromDb();

    const responseJSON = createBookJsonResponse(books);
    res.json(responseJSON);
}

/**
 * This function after successful validation creates new book document
 * by supplied data from the Request body and immediately saves this document
 * in the database. If validation fails, this function throws ValidationError.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @throws {ValidationError}
 */
async function createBookRoute(req, res) {
    const {apiKey, newBook: bookData} = req.body;

    const user = await UserRepository.getUserByApiKey(apiKey);
    const newBook = await BookRepository.createBook(bookData, user);

    await UserRepository.disconnectFromDb();
    await BookRepository.disconnectFromDb();

    res.json(createBookJsonResponse(newBook));
}

/**
 * This function after successful validation searches for a book document
 * by supplied id from the route param and returns it to the
 * end client in JSON format. If validation fails, this function throws ValidationError.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @throws {ValidationError}
 */
async function displayBookByIdRoute(req, res) {
    const validationRes = validationResult(req);
    if (validationRes.isEmpty()) {
        const {bookId} = req.params;
        const book = await BookRepository.getBookById(bookId);
        await BookRepository.disconnectFromDb();

        const responseJSON = createBookJsonResponse(book);
        res.json(responseJSON);
    }
    else {
        throw new ValidationError(validationIdErrorMessage, validationRes.array({onlyFirstError: true}));
    }
}

/**
 * This function after successful validation finds existing book document
 * by supplied id from the route param and updates it with the supplied data from
 * the Request body. After the operation, newly created book document is returned in JSON format.
 * If validation fails, this function throws ValidationError.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @throws {ValidationError}
 */
async function patchBookRoute(req, res) {
    const validationRes = validationResult(req);

    if (validationRes.isEmpty()) {
        const {bookId} = req.params;
        const updatedBook = await BookRepository.getBookByIdAndUpdate(bookId, {...req.body});
        await BookRepository.disconnectFromDb();

        const responseJSON = createBookJsonResponse(updatedBook);
        res.json(responseJSON);
    }
    else {
        throw new ValidationError(validationJsonErrorMessage, validationRes.array({onlyFirstError: true}));
    }
}

/**
 * This function after successful validation searches for a book document
 * by supplied id from the route param and deletes it from the database.
 * After that operation, deleted book document is returned to the end user in JSON format.
 * If validation fails, this function throws ValidationError.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @throws {ValidationError}
 */
async function deleteBookRoute(req, res) {
    const validationRes = validationResult(req);

    if (validationRes.isEmpty()) {
        const {bookId} = req.params;
        const deletedBook = await BookRepository.getBookByIdAndDelete(bookId);
        await BookRepository.disconnectFromDb();

        const responseJSON = createBookJsonResponse(deletedBook);
        res.json(responseJSON);
    }
    else {
        throw new ValidationError(validationIdErrorMessage, validationRes.array({onlyFirstError: true}));
    }
}


module.exports.getBooksRoute = getBooksRoute;
module.exports.createBookRoute = createBookRoute;
module.exports.displayBookByIdRoute = displayBookByIdRoute;
module.exports.patchBookRoute = patchBookRoute;
module.exports.deleteBookRoute = deleteBookRoute;
