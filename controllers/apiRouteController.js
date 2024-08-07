const bookRepository = require("../repositories/bookRepository");
const {validationResult, matchedData} = require("express-validator");
const ValidationError = require("../utilities/ValidationError");
const {createBookJsonResponse, createErrorResponse} = require('../utilities/jsonResponeCreator');
const {validationJsonErrorMessage, validationIdErrorMessage} = require("../utilities/errorMessages");


async function getBooksRoute(req, res) {
    const books = await bookRepository.getAllBooks();
    await bookRepository.disconnectFromDb();

    const responseJSON = createBookJsonResponse(books);
    res.json(responseJSON);
}

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
        throw new ValidationError(validationJsonErrorMessage,
            400, validationRes.array({onlyFirstError: true}));
    }
}

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
        throw new ValidationError(validationIdErrorMessage,
            400, validationRes.array({onlyFirstError: true}));
    }
}

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
        throw new ValidationError(validationJsonErrorMessage,
            400, validationRes.array({onlyFirstError: true}));
    }
}

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
        throw new ValidationError(validationIdErrorMessage,
            400, validationRes.array({onlyFirstError: true}));
    }
}

function handleRouteErrors(err, req, res, next) {
    res.status(err.statusCode).json(createErrorResponse(err.message, 'validation',
        err.statusCode, err.innerValidationErrors));
}


module.exports.getBooksRoute = getBooksRoute;
module.exports.createBookRoute = createBookRoute;
module.exports.displayBookByIdRoute = displayBookByIdRoute;
module.exports.patchBookRoute = patchBookRoute;
module.exports.deleteBookRoute = deleteBookRoute;
module.exports.handleRouteErrors = handleRouteErrors;
