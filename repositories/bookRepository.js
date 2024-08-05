const mongoose = require('mongoose');
const Book = require('../models/Book');

class BookRepository {
    static #connectToDb() {
        return mongoose.connect(process.env.DATABASE_URI);
    }

    static #disconnectFromDb() {
        return mongoose.connection.close();
    }

    static async getBookById(bookId) {
        await this.#connectToDb();

        const book = await Book.findById(bookId);

        await this.#disconnectFromDb();

        return book;
    }

    static async getOneBookByFilter(filter) {
        await this.#connectToDb();

        const book = await Book.findOne({...filter});

        await this.#disconnectFromDb();

        return book;
    }

    static async getManyBooksByFilter(filter) {
        await this.#connectToDb();

        const books = await Book.find({...filter});

        await this.#disconnectFromDb();

        return books;
    }

    static async createBook(bookData) {
        await this.#connectToDb();

        const newBook = new Book({
            title: bookData.title,
            author: bookData.author,
            genre: bookData.genre,
            publishYear: bookData.publishYear,
            description: bookData.description,
        });
        await newBook.save();

        await this.#disconnectFromDb();

        return newBook;
    }

    static async getBookByIdAndUpdate(bookId, updateData) {
        await this.#connectToDb();

        const book = await Book.updateOne(bookId, {...updateData}, {new: true});

        await this.#disconnectFromDb();

        return book;
    }

    static async getBookByIdAndDelete(bookId) {
        await this.#connectToDb();

        const book = await Book.findByIdAndDelete(bookId);

        await this.#disconnectFromDb();

        return book;
    }
}

module.exports = BookRepository;
