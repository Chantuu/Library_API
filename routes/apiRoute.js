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

router.get('/books/:bookId', async (req, res) => {
    console.log(req.params);

    const { bookId } = req.params;
    const book = await bookRepository.getBookById(bookId);

    res.json(book);
});


module.exports = router;
