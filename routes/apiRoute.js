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
const {checkExact, body, param} = require("express-validator");
const customValidators = require('../utilities/customValidators');


router.get('/books', catchAsyncError(getBooksRoute));

router.post('/books', checkExact([body('name').isString().notEmpty(),
    body('author').isString().notEmpty(),
    body('genre').isString().notEmpty(),
    body('publishYear').isNumeric().notEmpty()]),
    catchAsyncError(createBookRoute));

router.get('/books/:bookId',
    param('bookId').isMongoId().custom(customValidators.validateBookExists),
    catchAsyncError(displayBookByIdRoute));

router.patch('/books/:bookId', catchAsyncError(patchBookRoute));

router.delete('/books/:bookId', catchAsyncError(deleteBookRoute));

// TODO basic error handler for testing error output
router.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});

module.exports = router;
