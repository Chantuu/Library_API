const express = require('express');
const {checkExact, body, validationResult, matchedData} = require("express-validator");
const router = express.Router();
const catchAsyncError = require("../utilities/catchAsyncError");
const {ValidationError, AlreadyExistsError} = require("../utilities/errors");
const {validationJsonErrorMessage, validationIdErrorMessage} = require("../utilities/errorMessages");
const {validateContentType, validateUserNotExists} = require("../utilities/customValidators");
const UserRepository = require("../repositories/userRepository");
const {registerNewUser} = require("../controllers/userRouteController");


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
