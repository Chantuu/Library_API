const mongoose = require('mongoose');
const Book = require('../models/Book');

class BookRepository {
    /**
     * This private method is used by other methods for
     * connecting to the database.
     *
     * @returns {Promise<Mongoose>} Promise
     */
    static #connectToDb() {
        return mongoose.connect(process.env.DATABASE_URI);
    }

    /**
     * This method closes connection to the database.
     *
     * @returns {Promise<void>} Promise
     */
    static disconnectFromDb() {
        return mongoose.connection.close();
    }

    /**
     * This method searches for a one book document with supplied bookId parameter and
     * returns first found book document in a promise.
     *
     * @param {ObjectId} bookId Book Document id
     * @returns {Promise<Book>} Returns a promise with found book
     */
    static async getBookById(bookId) {
        await this.#connectToDb();

        return Book.findById(bookId);
    }

    /**
     * This method searches for a one book document matching with the supplied filter parameter
     * and returns first found book document in promise.
     *
     * @param {Object} filter Filter object
     * @returns {Promise<Book>} Returns a promise with found book
     */
    static async getOneBookByFilter(filter) {
        await this.#connectToDb();

        return Book.findOne({...filter});
    }

    /**
     * This method searches for an any book matching with supplied filter parameter
     * and returns an array of found book documents in promise.
     *
     * @param {Object} filter Filter object
     * @returns {Promise<Array<Book>>} Returns a promise with an array of found book documents
     */
    static async getManyBooksByFilter(filter) {
        await this.#connectToDb();

        return Book.find({...filter});
    }

    /**
     * This method returns all available book documents from the database as
     * an array in promise
     *
     * @returns {Promise<Array<Book>>} Returns a promise with an array of found book documents
     */
    static async getAllBooks() {
        return this.getManyBooksByFilter({});
    }

    /**
     * This method creates new book document in the database from the bookData parameter
     * and returns newly created document in promise.
     *
     * @param {Object} bookData Object Containing necessary information for creating document
     * @returns {Promise<Book>} Returns a promise with newly created book
     */
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

    /**
     * This method searches for a first book document with bookId parameter and
     * updates its contents with updateData parameter. An updated book document
     * is returned in promise.
     *
     * @param {ObjectId} bookId Book Document id
     * @param {Object} updateData Object containing necessary data to be applied
     * @return {Promise<Book>} Returns promise with updated book
     */
    static async getBookByIdAndUpdate(bookId, updateData) {
        await this.#connectToDb();

        return Book.findByIdAndUpdate(bookId, {...updateData}, {new: true});
    }

    /**
     * This method searches for a first book document with bookId parameters
     * and deletes it from the database. A deleted book document is returned
     * in a promise.
     *
     * @param {ObjectId} bookId Book Document id
     * @return {Promise<Book>} Returns promise with deleted book
     */
    static async getBookByIdAndDelete(bookId) {
        await this.#connectToDb();

        return Book.findByIdAndDelete(bookId);
    }
}

module.exports = BookRepository;
