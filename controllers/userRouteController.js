const {validationResult} = require("express-validator");
const UserRepository = require("../repositories/userRepository");
const {ValidationError} = require("../utilities/errors");
const {validationJsonErrorMessage} = require("../utilities/errorMessages");
const {createSuccessMessageResponse, createUserJsonResponse} = require('../utilities/jsonResponseCreator')
const userRepository = require("../repositories/bookRepository");


/**
 * This route function is responsible for authenticating user and
 * returning user object in JSON response. This function does not have any built-in
 * validations because all validations are handled in middlewares before this function
 *
 * @param {import('express').request} req Request Object
 * @param {import('express').response} res Response Object
 */
async function returnUserData(req, res) {
    const {username} = req.body;

    const user = await UserRepository.getUserByUsername(username);
    await userRepository.disconnectFromDb();

    res.json(createUserJsonResponse(user));
}

/**
 * This route method is responsible for registering new user.
 * This function works, if all previous middleware validations are passed.
 * When registering the user, password is hashed and individual API key is
 * automatically created. If any validation fails, it throws ValidationError
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @returns {Promise<void>}
 */
async function registerNewUser(req, res) {
    const { username, password, firstName, lastName } = req.body;

    await UserRepository.createUser(username, password, firstName, lastName);
    await UserRepository.disconnectFromDb();

    res.json(createSuccessMessageResponse(`User ${username} successfully registered`));
}

/**
 * This route method is responsible for updating an existing user document
 * with new data from the request body. This function works, if all previous middleware validations are passed.
 * Username and new data is extracted from request body and applied to the specified User document.
 *
 * @param {import('express').request} req Express Request Object
 * @param {import('express').response} res Express Response Object
 * @returns {Promise<void>}
 */
async function updateUserData(req, res) {
    const {update: updateData, username} = req.body;

    const updatedUser = await UserRepository.updateUser(username, updateData);
    await UserRepository.disconnectFromDb();

    res.json(createUserJsonResponse(updatedUser));
}


module.exports.returnUserData = returnUserData;
module.exports.registerNewUser = registerNewUser;
module.exports.updateUserData = updateUserData;
