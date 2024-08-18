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
 * @throws {ValidationError}
 */
async function registerNewUser(req, res) {
    const validationRes = validationResult(req);

    if (validationRes.isEmpty()) {
        const { username, password, firstName, lastName } = req.body;
        const newUser = await UserRepository.createUser(username, password, firstName, lastName);

        await UserRepository.disconnectFromDb();

        res.json(createSuccessMessageResponse(`User ${username} successfully registered`));
    }
    else {
        throw new ValidationError(validationJsonErrorMessage, validationRes.array({onlyFirstError: true}));
    }
}


module.exports.returnUserData = returnUserData;
module.exports.registerNewUser = registerNewUser;
