const bookRepository = require("../repositories/bookRepository");
const {validationResult, matchedData} = require("express-validator");
const AppError = require("../utilities/AppError");
const {createBookJsonResponse, createErrorResponse} = require('../utilities/jsonResponseCreator');
const {validationJsonErrorMessage, validationIdErrorMessage} = require("../utilities/errorMessages");


/**
 *  This function takes all available book documents from database
 *  and sends to the end client as an array of book documents in JSON format.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 */
async function getBooksRoute(req, res) {
    const books = await bookRepository.getAllBooks();
    await bookRepository.disconnectFromDb();

    const responseJSON = createBookJsonResponse(books);
    res.json(responseJSON);
}

/**
 * This function after successful validation creates new book document
 * by supplied data from the Request body and immediately saves this document
 * in the database. If validation fails, this function throws AppError.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @throws {ValidationError}
 */
async function createBookRoute(req, res) {
    const validationRes = validationResult(req);
    if (validationRes.isEmpty()) {
        const validatedData = matchedData(req);

        const newBook = await bookRepository.createBook({...validatedData});
        await newBook.save();
        await bookRepository.disconnectFromDb();

        const responseJSON = createBookJsonResponse(newBook)
        res.json(responseJSON);
    } else {
        throw new AppError(validationJsonErrorMessage,
            400, validationRes.array({onlyFirstError: true}));
    }
}

/**
 * This function after successful validation searches for a book document
 * by supplied id from the route param and returns it to the
 * end client in JSON format. If validation fails, this function throws AppError.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @throws {ValidationError}
 */
async function displayBookByIdRoute(req, res) {
    const validationRes = validationResult(req);
    if (validationRes.isEmpty()) {
        const {bookId} = req.params;
        const book = await bookRepository.getBookById(bookId);
        await bookRepository.disconnectFromDb();

        const responseJSON = createBookJsonResponse(book);
        res.json(responseJSON);
    }
    else {
        throw new AppError(validationIdErrorMessage,
            400, validationRes.array({onlyFirstError: true}));
    }
}

/**
 * This function after successful validation finds existing book document
 * by supplied id from the route param and updates it with the supplied data from
 * the Request body. After the operation, newly created book document is returned in JSON format.
 * If validation fails, this function throws AppError.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @throws {ValidationError}
 */
async function patchBookRoute(req, res) {
    const validationRes = validationResult(req);

    if (validationRes.isEmpty()) {
        const {bookId} = req.params;
        const updatedBook = await bookRepository.getBookByIdAndUpdate(bookId, {...req.body});
        await bookRepository.disconnectFromDb();

        const responseJSON = createBookJsonResponse(updatedBook);
        res.json(responseJSON);
    }
    else {
        throw new AppError(validationJsonErrorMessage,
            400, validationRes.array({onlyFirstError: true}));
    }
}

/**
 * This function after successful validation searches for a book document
 * by supplied id from the route param and deletes it from the database.
 * After that operation, deleted book document is returned to the end user in JSON format.
 * If validation fails, this function throws AppError.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @throws {ValidationError}
 */
async function deleteBookRoute(req, res) {
    const validationRes = validationResult(req);

    if (validationRes.isEmpty()) {
        const {bookId} = req.params;
        const deletedBook = await bookRepository.getBookByIdAndDelete(bookId);
        await bookRepository.disconnectFromDb();

        const responseJSON = createBookJsonResponse(deletedBook);
        res.json(responseJSON);
    }
    else {
        throw new AppError(validationIdErrorMessage,
            400, validationRes.array({onlyFirstError: true}));
    }
}


module.exports.getBooksRoute = getBooksRoute;
module.exports.createBookRoute = createBookRoute;
module.exports.displayBookByIdRoute = displayBookByIdRoute;
module.exports.patchBookRoute = patchBookRoute;
module.exports.deleteBookRoute = deleteBookRoute;
