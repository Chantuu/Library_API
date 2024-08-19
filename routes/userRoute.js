const express = require('express');
const {checkExact, body} = require("express-validator");
const router = express.Router();
const catchAsyncError = require("../utilities/catchAsyncError");
const {validateContentType, validateUserNotExists, authenticateUser, noWhitespacesBetween} = require("../utilities/customValidators");
const {registerNewUser, returnUserData} = require("../controllers/userRouteController");
const {noSpaceBetweenErrorMessage} = require("../utilities/errorMessages");


router.get("/",
    validateContentType('application/json'),
    checkExact([
        body("username").notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage),
        body("password").notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage)
    ]),
    catchAsyncError(authenticateUser),
    catchAsyncError(returnUserData));

router.post('/',
    validateContentType('application/json'),
    checkExact([
        body('username').notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage),
        body('password').notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage),
        body('firstName').notEmpty().isString().trim(),
        body('lastName').notEmpty().isString().trim(),
    ]),
    catchAsyncError(validateUserNotExists),
    catchAsyncError(registerNewUser));


module.exports = router;
