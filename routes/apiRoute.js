const express = require('express');
const router = express.Router();
const bookRepository = require('../repositories/bookRepository');


router.get('/books', async (req, res) => {
    const books = await bookRepository.getAllBooks();
    res.json(books);
});

router.post('/books', async (req, res) => {
    console.log(req.body);

    const newBook = await bookRepository.createBook({...req.body});
    await newBook.save();
    await bookRepository.disconnectFromDb();

    res.json(newBook);
});


module.exports = router;
