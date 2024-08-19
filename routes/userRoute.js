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


/**
 * @swagger
 * /users/credentials:
 *  post:
 *   summary: This route is used for getting necessary user information
 *   tags: [Users]
 *   requestBody:
 *    required: true
 *    description: This body must contain username and password fields, where values of the both fields must not contain any whitespace.
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - username
 *        - password
 *       properties:
 *        username:
 *         type: string
 *         description: Unique username of the user
 *        password:
 *         type: string
 *         description: Password of the user
 *   responses:
 *    200:
 *     description: User information successfully retrieved
 *     content:
 *      application/json:
 *       type: object
 *       schema:
 *        properties:
 *         state:
 *          type: string
 *          description: Status of the API operation
 *         result:
 *          type: object
 *          description: Result of the API operation
 *          $ref: "#/components/schemas/User"
 *    400:
 *     description: Bad Request
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Internal Server Error
 *
 */
router.post("/credentials",
    validateContentType('application/json'),
    checkExact([
        body("username").notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage),
        body("password").notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage)
    ]),
    catchAsyncError(authenticateUser),
    catchAsyncError(returnUserData));

/**
 * @swagger
 * /users:
 *  post:
 *   summary: This route is used for new user registration
 *   tags: [Users]
 *   requestBody:
 *    required: true
 *    description: This body must contain firstName, lastName, username and password fields, where values of username and password must not contain any whitespace.
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - username
 *        - password
 *        - firstName
 *        - lastName
 *       properties:
 *        username:
 *         type: string
 *         description: Unique username of the user
 *        password:
 *         type: string
 *         description: Password of the user
 *        firstName:
 *         type: string
 *         description: First name of the user
 *        lastName:
 *         type: string
 *         description: Last name of the user
 *   responses:
 *    200:
 *     description: User successfully registered
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         state:
 *          type: string
 *          description: Status of the API operation
 *         result:
 *          type: string
 *          description: Result of the API operation
 *    400:
 *     description: Bad Request
 *    500:
 *     description: Internal Server Error
 */
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
