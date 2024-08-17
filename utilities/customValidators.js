const bookRepository = require("../repositories/bookRepository");
const {ValidationError, NotFoundError, AlreadyExistsError} = require("./errors");
const {validationContentTypeErrorMessage, validationIdErrorMessage, validationIdFormatErrorMessage,
    validationJsonErrorMessage, userAlreadyExistsErrorMessage
} = require("./errorMessages")
const mongoose = require("mongoose");
const UserRepository = require("../repositories/userRepository");
const {validationResult} = require("express-validator");


/**
 * This function validates id format and the existence of
 * the book document by the bookId parameter.
 * If id format is incorrect, ValidationError is thrown.
 * If specified document does not exist,
 * NotFoundError is thrown.
 *
 * @param {import('express').request} req Request Object
 * @param {import('express').response} res Response Object
 * @param {function} next Callback function
 * @returns {Promise<void>}
 * @throws {ValidationError, NotFoundError}
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
        throw new NotFoundError(validationIdErrorMessage);
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

/**
 * This validator is used to validate, that a User
 * does not exist in the database. It also checks for
 * express-validator validations. If express-validator validations
 * are passed and user does not exist, this validator is validated.
 * If express-validator validations fail, it throws ValidationError.
 * If user exists, it throws AlreadyExistsError.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @param {function} next Next middleware function
 * @returns {Promise<void>}
 * @throws {ValidationError, AlreadyExistsError}
 */
async function validateUserNotExists(req, res, next) {
    const user = await UserRepository.getUserByUsername(req.body.username);
    await UserRepository.disconnectFromDb();

    const validationRes = validationResult(req);

    // If validations are passed and user by specified username is not found
    if (!user && validationRes.isEmpty()) {
        next();
    }
    // If validations failed
    else if (!validationRes.isEmpty()) {
        throw new ValidationError(validationJsonErrorMessage, validationRes.array({onlyFirstError: true}));
    }
    //If user already exists
    else {
        throw new AlreadyExistsError(userAlreadyExistsErrorMessage);
    }
}


module.exports.validateBookExists = validateBookId;
module.exports.validateContentType = validateContentType;
module.exports.validateUserNotExists = validateUserNotExists;
