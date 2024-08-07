const {createErrorResponse} = require("../utilities/jsonResponseCreator");

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
        createErrorResponse('Incorrect address. Please ensure, that you are using correct method on correct path',
            'path_Not_Found', statusCode))
}

/**
 * This error handler sends errors in JSON format to the end user.
 *
 * @param {import('../utilities/ValidationError')} err
 * @param {import('express').request} req
 * @param {import('express').response} res
 * @param {Function} next
 */
function handleAppErrors(err, req, res, next) {
    res.status(err.status).json(createErrorResponse(err.message, err.type, err.status));
}

module.exports.handleIncorrectRoutes = handleIncorrectRoutes;
module.exports.handleAppErrors = handleAppErrors;
