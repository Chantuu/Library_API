const bookRepository = require("../repositories/bookRepository");


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
