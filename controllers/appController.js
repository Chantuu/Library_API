const {createErrorResponse} = require("../utilities/jsonResponseCreator");

/**
 * This method handles any incoming requests
 * with wrong or undefined route paths.
 *
 * @param {import('express').Request} req Request Object
 * @param {import('express').Response} res Response Object
 */
function handleIncorrectRoutes(req, res) {
    const statusCode = 404
    res.status(statusCode).json(
        createErrorResponse('Incorrect address. Please ensure, that you are using correct method on correct path',
            'path_Not_Found', statusCode))
}


module.exports.handleIncorrectRoutes = handleIncorrectRoutes;
