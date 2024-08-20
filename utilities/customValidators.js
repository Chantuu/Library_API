const bookRepository = require("../repositories/bookRepository");
const {ValidationError, NotFoundError, AlreadyExistsError, UnauthenticatedError} = require("./errors");
const {validationContentTypeErrorMessage, validationIdErrorMessage, validationIdFormatErrorMessage,
    validationJsonErrorMessage, userAlreadyExistsErrorMessage, incorrectUserAndPasswordErrorMessage,
    incorrectApiKeyErrorMessage
} = require("./errorMessages")
const mongoose = require("mongoose");
const UserRepository = require("../repositories/userRepository");
const {validationResult} = require("express-validator");
const userRepository = require("../repositories/bookRepository");
const {comparePassword} = require("./helperFunctions");


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

/**
 * This validator is responsible for user validation. It takes username and password fields
 * from request body, searches for a user and checks plaint text password with hashed passwords.
 * If user is found and passwords match, authentication is successful.
 * If user is not found or passwords do not match, function throws UnauthorizedError.
 * If Validations fail, function throws ValidationError.
 *
 * @param {import('express').request} req Request Object
 * @param {import('express').response} res Response Object
 * @param {Function} next Next middleware function
 * @throws {ValidationError, UnauthenticatedError}
 */
async function authenticateUser(req, res, next) {
    const validationRes = validationResult(req);

    if (validationRes.isEmpty()) {
        const {username, password} = req.body;

        const user = await UserRepository.getUserByUsername(username);
        await userRepository.disconnectFromDb();

        // Checks if user object is not empty and password from request body is similar to hashed password from found
        // user.
        if (user && await comparePassword(password, user.hash)) {
            next();
        }
        else {
            throw new UnauthenticatedError(incorrectUserAndPasswordErrorMessage);
        }
    }
    else {
        throw new ValidationError(validationJsonErrorMessage, validationRes.array({onlyFirstError: true}));
    }
}

/**
 * This validator is responsible for user authentication using API key. It takes apiKey field
 * from request body and searches for a matching user.
 * If user is found, authentication is successful.
 * If user is not found, function throws UnauthorizedError.
 * If Validations fail, function throws ValidationError.
 *
 * @param {import('express').request} req Request Object
 * @param {import('express').response} res Response Object
 * @param {Function} next Next middleware function
 * @throws {ValidationError, UnauthenticatedError}
 */
async function authenticateUserWithApiKey(req, res, next) {
    const validationRes = validationResult(req);

    if (validationRes.isEmpty()) {
        const {apiKey} = req.body;

        const user = await UserRepository.getUserByApiKey(apiKey);
        await userRepository.disconnectFromDb();

        if (user) {
            next();
        }
        else {
            throw new UnauthenticatedError(incorrectApiKeyErrorMessage);
        }
    }
    else {
        throw new ValidationError(validationJsonErrorMessage, validationRes.array({onlyFirstError: true}));
    }
}

/**
 * This validator validates that there is not any whitespace present between characters
 * in a field value. This validator is mostly used inside express-validator .custom() method.
 * This method returns true, if there is not any whitespace, otherwise it returns false.
 *
 * @param {String} fieldValue String value of the express-validator supplied field
 * @returns {boolean}
 */
function noWhitespacesBetween(fieldValue) {
    return !fieldValue.includes(" ");
}

/**
 * This method is used for checking, if object is empty. If an actual object
 * is empty, it returns false, otherwise true.
 *
 * @param {Object} obj Desired object to be checked
 * @returns {boolean}
 */
function isObjectEmpty(obj) {
    const result = JSON.stringify(obj);
    return result !== '{}';
}


module.exports.validateBookExists = validateBookId;
module.exports.validateContentType = validateContentType;
module.exports.validateUserNotExists = validateUserNotExists;
module.exports.authenticateUser = authenticateUser;
module.exports.authenticateUserWithApiKey = authenticateUserWithApiKey;
module.exports.noWhitespacesBetween = noWhitespacesBetween;
module.exports.isObjectEmpty = isObjectEmpty;
