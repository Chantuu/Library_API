const express = require('express');
const router = express.Router();
const bookRepository = require('../repositories/bookRepository');


router.get('/books', async (req, res) => {
    const books = await bookRepository.getAllBooks();
    res.json(books);
});


module.exports = router;
