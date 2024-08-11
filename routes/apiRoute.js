const express = require('express');
const router = express.Router();
const {
    getBooksRoute,
    createBookRoute,
    displayBookByIdRoute,
    patchBookRoute,
    deleteBookRoute
} = require('../controllers/apiRouteController');
const catchAsyncError = require('../utilities/catchAsyncError');
const {checkExact, body} = require("express-validator");
const {validateContentType, validateBookExists} = require('../utilities/customValidators');


/**
 * This route returns an array of book documents in JSON format.
 */
router.get('/books',
    validateContentType('none'),
    catchAsyncError(getBooksRoute));

/**
 * This route validates request body for having 4 exact fields
 * required for new book document creation. Returns newly created
 * book document in JSON format. If fails, throws ValidateError.
 */
router.post('/books',
    validateContentType('application/json'),
    checkExact([
    body('name').isString().notEmpty(),
    body('author').isString().notEmpty(),
    body('genre').isString().notEmpty(),
    body('publishYear').isNumeric().notEmpty(),
    body('description').isString().optional()]),
    catchAsyncError(createBookRoute));

/**
 * This route validates request param for correct mongoId structure
 * and returns found book document in JSON format. If fails, throws
 * ValidateError.
 */
router.get('/books/:bookId',
    validateContentType('none'),
    catchAsyncError(validateBookExists),
    catchAsyncError(displayBookByIdRoute));

/**
 * This route validates request body for having any of 4 fields with correct types and
 * request param for correct mongoId structure, finds corresponding book document
 * and updates it with relevant information. Returns updated book in JSON format.
 * If fails, throws ValidateError.
 */
router.patch('/books/:bookId',
    validateContentType('application/json'),
    catchAsyncError(validateBookExists),
    checkExact([
    body('name').isString().optional(),
    body('author').isString().optional(),
    body('genre').isString().optional(),
    body('publishYear').isNumeric().optional(),
    body('description').isString().optional()
    ]),
    catchAsyncError(patchBookRoute));

/**
 * This route validates request param for correct mongoId structure
 * and deletes it from the database. Returns deleted book document in JSON format.
 * If fails, throws ValidateError.
 */
router.delete('/books/:bookId',
    validateContentType('none'),
    catchAsyncError(validateBookExists),
    catchAsyncError(deleteBookRoute));

module.exports = router;
