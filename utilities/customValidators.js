const bookRepository = require("../repositories/bookRepository");
const AppError = require("./AppError");
const {validationContentTypeErrorMessage} = require("./errorMessages")

/**
 * This validator checks for document existence by supplied bookId parameter.
 * If corresponding document exists, true is returned, else false.
 *
 * @param {ObjectId} bookId Book document id
 * @returns {Promise<boolean>} Boolean
 */
async function validateBookId(bookId) {
    const result = await bookRepository.getBookById(bookId);
    await bookRepository.disconnectFromDb();
    
    if (result) {
        return true;
    }
    else {
        throw new Error();
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
                throw new AppError(validationContentTypeErrorMessage, 400);
            }
        }
        else if (allowedContentType === req.get('content-type')) {
            next();
        }
        else {
            throw new AppError(validationContentTypeErrorMessage, 400);
        }
    }
}

module.exports.validateBookExists = validateBookId;
module.exports.validateContentType = validateContentType;
