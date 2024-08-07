const bookRepository = require("../repositories/bookRepository");

/**
 * This validator checks for document existence by supplied bookId parameter.
 * If corresponding document exists, true is returned, else false.
 *
 * @param {ObjectId} bookId Book document id
 * @returns {Promise<boolean>} Boolean
 */
async function validateBookId(bookId) {
    const result = await bookRepository.getBookById(bookId);
    await bookRepository.disconnectFromDb();
    
    if (result) {
        return true;
    }
    else {
        return false;
    }
}


module.exports.validateBookExists = validateBookId;
