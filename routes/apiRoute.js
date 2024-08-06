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


router.get('/books', catchAsyncError(getBooksRoute));

router.post('/books', catchAsyncError(createBookRoute));

router.get('/books/:bookId', catchAsyncError(displayBookByIdRoute));

router.patch('/books/:bookId', catchAsyncError(patchBookRoute));

router.delete('/books/:bookId', catchAsyncError(deleteBookRoute));

module.exports = router;
