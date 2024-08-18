const express = require('express');
const {checkExact, body} = require("express-validator");
const router = express.Router();
const catchAsyncError = require("../utilities/catchAsyncError");
const {validateContentType, validateUserNotExists, authenticateUser} = require("../utilities/customValidators");
const {registerNewUser, returnUserData} = require("../controllers/userRouteController");


router.get("/",
    validateContentType('application/json'),
    checkExact([
        body("username").notEmpty().isString(),
        body("password").notEmpty().isString(),
    ]),
    catchAsyncError(authenticateUser),
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
