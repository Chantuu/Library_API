const express = require('express');
const {checkExact, body, validationResult, matchedData} = require("express-validator");
const router = express.Router();
const catchAsyncError = require("../utilities/catchAsyncError");
const {ValidationError, AlreadyExistsError, NotFoundError, UnauthorizedError} = require("../utilities/errors");
const {validationJsonErrorMessage, validationIdErrorMessage, incorrectUserAndPasswordErrorMessage} = require("../utilities/errorMessages");
const {validateContentType, validateUserNotExists} = require("../utilities/customValidators");
const UserRepository = require("../repositories/userRepository");
const {registerNewUser, returnUserData} = require("../controllers/userRouteController");
const userRepository = require("../repositories/bookRepository");
const {comparePassword} = require("../utilities/helperFunctions");


router.get("/",
    validateContentType('application/json'),
    checkExact([
        body("username").notEmpty().isString(),
        body("password").notEmpty().isString(),
    ]),
    catchAsyncError(returnUserData));

router.post('/',
    validateContentType('application/json'),
    checkExact([
        body('username').notEmpty().isString(),
        body('password').notEmpty().isString(),
        body('firstName').notEmpty().isString(),
        body('lastName').notEmpty().isString(),
    ]),
    catchAsyncError(validateUserNotExists),
    catchAsyncError(registerNewUser));


module.exports = router;
