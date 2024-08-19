const express = require('express');
const {checkExact, body} = require("express-validator");
const router = express.Router();
const catchAsyncError = require("../utilities/catchAsyncError");
const {validateContentType, validateUserNotExists, authenticateUser, noWhitespacesBetween, isObjectEmpty} = require("../utilities/customValidators");
const {registerNewUser, returnUserData, updateUserData, deleteUser} = require("../controllers/userRouteController");
const {noSpaceBetweenErrorMessage, noEmptyPayloadErrorMessage} = require("../utilities/errorMessages");


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

router.patch('/',
    validateContentType('application/json'),
    checkExact([
        body("username").notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage),
        body("password").notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage),
        body("update").isObject().custom(isObjectEmpty).withMessage(noEmptyPayloadErrorMessage),
        body("update.firstName").optional().isString().trim(),
        body("update.lastName").optional().isString().trim(),
        body("update.password").optional().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage)
    ]),
    catchAsyncError(authenticateUser),
    catchAsyncError(updateUserData));

router.delete('/',
    validateContentType('application/json'),
    checkExact([
        body("username").notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage),
        body("password").notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage)
    ]),
    catchAsyncError(authenticateUser),
    catchAsyncError(deleteUser));

module.exports = router;
