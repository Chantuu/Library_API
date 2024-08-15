const {createErrorResponse} = require("../utilities/jsonResponseCreator");
const {ValidationError, NotFoundError} = require("../utilities/AppError");
const {Error: mongooseError} = require('mongoose');
const {incorrectAddressErrorMessage, validationJsonErrorMessage} = require('../utilities/errorMessages');

/**
 * This method handles any incoming requests
 * with wrong or undefined route paths.
 *
 * @param {import('express').request} req Request Object
 * @param {import('express').response} res Response Object
 */
function handleIncorrectRoutes(req, res) {
    res.status(404).json(createErrorResponse(new ValidationError(incorrectAddressErrorMessage)));
}

/**
 * This error handler sends errors in JSON format to the end user.
 * If any error is incoming from mongoose, it automatically is considered
 * internal server error.
 *
 * @param {import('../utilities/AppError')} err
 * @param {import('express').request} req
 * @param {import('express').response} res
 * @param {Function} next
 */
function handleAppErrors(err, req, res, next) {
    /* This conditional checks, if incoming error is instance of
    * mongoose Error. This check is done for correct HTTP status code
    * assigment.
    */
    if (err instanceof mongooseError.MongooseServerSelectionError) {
        res.status(500);
    }
    else if (err instanceof NotFoundError) {
        res.status(404);
    }
    else {
        res.status(400);
    }

    /* This conditional checks, if incoming error is caused by incorrect JSON syntax.
    * If that is the case, err object is converted into AppError object for proper error
    * JSON output.
    */
    if (err instanceof SyntaxError &&  err.type === 'entity.parse.failed') {
        err = new ValidationError(validationJsonErrorMessage);
    }

    res.json(createErrorResponse(err));
}

module.exports.handleIncorrectRoutes = handleIncorrectRoutes;
module.exports.handleAppErrors = handleAppErrors;
