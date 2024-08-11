const {createErrorResponse} = require("../utilities/jsonResponseCreator");
const AppError = require("../utilities/AppError");
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
    res.status(404).json(createErrorResponse(new AppError(incorrectAddressErrorMessage)));
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
    if (err instanceof mongooseError.MongooseServerSelectionError) {
        res.status(500);
    }
    else {
        res.status(400);
    }
    console.log(err);
    res.json(createErrorResponse(err));
}

module.exports.handleIncorrectRoutes = handleIncorrectRoutes;
module.exports.handleAppErrors = handleAppErrors;
