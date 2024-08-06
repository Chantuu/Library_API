const express = require('express');
const router = express.Router();
const {
    getBooksRoute,
    createBookRoute,
    displayBookByIdRoute,
    patchBookRoute,
    deleteBookRoute
} = require('../controllers/apiRouteController');


router.get('/books', getBooksRoute);

router.post('/books', createBookRoute);

router.get('/books/:bookId', displayBookByIdRoute);

router.patch('/books/:bookId', patchBookRoute);

router.delete('/books/:bookId', deleteBookRoute);

module.exports = router;
