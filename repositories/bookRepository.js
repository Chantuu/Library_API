const mongoose = require('mongoose');
const Book = require('../models/Book');

class BookRepository {
    static #connectToDb() {
        return mongoose.connect(process.env.DATABASE_URI);
    }

    static disconnectFromDb() {
        return mongoose.connection.close();
    }

    static async getBookById(bookId) {
        await this.#connectToDb();

        return Book.findById(bookId);
    }

    static async getOneBookByFilter(filter) {
        await this.#connectToDb();

        return Book.findOne({...filter});
    }

    static async getManyBooksByFilter(filter) {
        await this.#connectToDb();

        return Book.find({...filter});
    }

    static async getAllBooks() {
        return this.getManyBooksByFilter({});
    }

    static async createBook(bookData) {
        await this.#connectToDb();

        const newBook = new Book({
            name: bookData.name,
            author: bookData.author,
            genre: bookData.genre,
            publishYear: bookData.publishYear,
            description: bookData.description,
        });
        await newBook.save();

        return newBook;
    }

    static async getBookByIdAndUpdate(bookId, updateData) {
        await this.#connectToDb();

        return Book.updateOne(bookId, {...updateData}, {new: true});
    }

    static async getBookByIdAndDelete(bookId) {
        await this.#connectToDb();

        return Book.findByIdAndDelete(bookId);
    }
}

module.exports = BookRepository;
