const express = require('express');
const {checkExact, body} = require("express-validator");
const router = express.Router();
const catchAsyncError = require("../utilities/catchAsyncError");
const {validateContentType, validateUserNotExists, authenticateUser, noWhitespacesBetween, isObjectEmpty} = require("../utilities/customValidators");
const {registerNewUser, returnUserData, updateUserData, deleteUser} = require("../controllers/userRouteController");
const {noSpaceBetweenErrorMessage, noEmptyPayloadErrorMessage} = require("../utilities/errorMessages");


/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    properties:
 *     username:
 *      type: string
 *      description: Unique username of the user
 *     apiKey:
 *      type: string
 *      description: Unique API key used for authorization in API
 *     firstName:
 *      type: string
 *      description: First name of the user
 *     lastName:
 *      type: string
 *      description: Last name of the user
 *    example:
 *     username: apiuser123
 *     apiKey: eeeeeeee-dddd-cccc-bbbb-aaaaaaaaaaaa
 *     firstName: Giorgi
 *     lastName: Chanturia
 */


/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Routes related to the user management
 */


router.post("/credentials",
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
