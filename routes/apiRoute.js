const express = require('express');
const router = express.Router();
const {
    getBooksRoute,
    createBookRoute,
    displayBookByIdRoute,
    patchBookRoute,
    deleteBookRoute
} = require('../controllers/apiRouteController');
const catchAsyncError = require('../errorHandlers/catchAsyncError');
const {checkExact, body} = require("express-validator");


router.get('/books', catchAsyncError(getBooksRoute));

router.post('/books', checkExact([body('name').isString().notEmpty(),
    body('author').isString().notEmpty(),
    body('genre').isString().notEmpty(),
    body('publishYear').isNumeric().notEmpty()]),
    catchAsyncError(createBookRoute));

router.get('/books/:bookId', catchAsyncError(displayBookByIdRoute));

router.patch('/books/:bookId', catchAsyncError(patchBookRoute));

router.delete('/books/:bookId', catchAsyncError(deleteBookRoute));

module.exports = router;
