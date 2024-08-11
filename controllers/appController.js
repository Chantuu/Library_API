const {createErrorResponse} = require("../utilities/jsonResponseCreator");
const ValidationError = require("../utilities/ValidationError");
const {Error: mongooseError} = require('mongoose');
const {incorrectAddressErrorMessage} = require('../utilities/errorMessages');

/**
 * This method handles any incoming requests
 * with wrong or undefined route paths.
 *
 * @param {import('express').request} req Request Object
 * @param {import('express').response} res Response Object
 */
function handleIncorrectRoutes(req, res) {
    const statusCode = 404
    res.status(statusCode).json(
        createErrorResponse(new ValidationError(incorrectAddressErrorMessage,
            statusCode)));
}

/**
 * This error handler sends errors in JSON format to the end user.
 * If any error is incoming from mongoose, it automatically is considered
 * internal server error.
 *
 * @param {import('../utilities/ValidationError')} err
 * @param {import('express').request} req
 * @param {import('express').response} res
 * @param {Function} next
 */
function handleAppErrors(err, req, res, next) {
    if (err instanceof mongooseError.MongooseServerSelectionError) {
        res.status(500);
    }
    else {
        res.status(400);
    }
    res.json(createErrorResponse(err));
}

module.exports.handleIncorrectRoutes = handleIncorrectRoutes;
module.exports.handleAppErrors = handleAppErrors;
