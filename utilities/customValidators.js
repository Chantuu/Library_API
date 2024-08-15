const bookRepository = require("../repositories/bookRepository");
const {ValidationError} = require("./AppError");
const {validationContentTypeErrorMessage, validationIdErrorMessage, validationIdFormatErrorMessage} = require("./errorMessages")
const mongoose = require("mongoose");


/**
 * This function validates id format and the existence of
 * the book document by the bookId parameter.
 * If specified document does not exist,
 * AppError is thrown.
 *
 * @param {import('express').request} req Request Object
 * @param {import('express').response} res Response Object
 * @param {function} next Callback function
 * @returns {Promise<void>}
 * @throws {ValidationError}
 */
async function validateBookId(req, res, next) {
    const {bookId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ValidationError(validationIdFormatErrorMessage);
    }

    const result = await bookRepository.getBookById(bookId);
    await bookRepository.disconnectFromDb();

    if (result) {
        next();
    }
    else {
        throw new ValidationError(validationIdErrorMessage);
    }
}

/**
 * This route validates incoming requests content type. It returns function
 * for express middleware consumption and checks if allowed content type is same as
 * incoming requests content type. If false, throws AppError.
 *
 * @param {string} allowedContentType Allowed content type for the route
 * @returns {(function((import('express').request), (import('express').response), function): void)|*}
 * @throws {ValidationError}
 */
function validateContentType(allowedContentType) {
    return function (req, res, next) {
        if (allowedContentType === 'none') {
            if (!req.get('content-type')) {
                next();
            }
            else {
                throw new ValidationError(validationContentTypeErrorMessage);
            }
        }
        else if (allowedContentType === req.get('content-type')) {
            next();
        }
        else {
            throw new ValidationError(validationContentTypeErrorMessage);
        }
    }
}

module.exports.validateBookExists = validateBookId;
module.exports.validateContentType = validateContentType;
