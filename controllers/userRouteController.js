const {validationResult} = require("express-validator");
const UserRepository = require("../repositories/userRepository");
const {ValidationError} = require("../utilities/errors");
const {validationJsonErrorMessage} = require("../utilities/errorMessages");


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

        res.json(newUser);
    }
    else {
        throw new ValidationError(validationJsonErrorMessage, validationRes.array({onlyFirstError: true}));
    }
}


module.exports.registerNewUser = registerNewUser;
