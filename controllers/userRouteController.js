const {validationResult} = require("express-validator");
const UserRepository = require("../repositories/userRepository");
const {ValidationError, UnauthorizedError} = require("../utilities/errors");
const {validationJsonErrorMessage, incorrectUserAndPasswordErrorMessage} = require("../utilities/errorMessages");
const {createSuccessMessageResponse, createUserJsonResponse} = require('../utilities/jsonResponseCreator')
const userRepository = require("../repositories/bookRepository");
const {comparePassword} = require("../utilities/helperFunctions");


/**
 * This route function is responsible for authenticating user and
 * returning user object in JSON response.
 * If any prior validations fail, this function throws ValidationError.
 * If authorization process fails, this function throws UnauthorizedError.
 *
 * @param {import('express').request} req
 * @param {import('express').response} res
 * @throws {ValidationError, UnauthorizedError}
 */
async function returnUserData(req, res) {
    const validationRes = validationResult(req);

    if (validationRes.isEmpty()) {
        const {username, password} = req.body;

        const user = await UserRepository.getUserByUsername(username);
        await userRepository.disconnectFromDb();

        // Checks if user object is not empty and password from request body is similar to hashed password from found
        // user.
        if (user && await comparePassword(password, user.hash)) {
            res.json(createUserJsonResponse(user));
        }
        else {
            throw new UnauthorizedError(incorrectUserAndPasswordErrorMessage);
        }
    }
    else {
        throw new ValidationError(validationJsonErrorMessage, validationRes.array({onlyFirstError: true}));
    }
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
