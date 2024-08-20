/**
 * This method is used for creating JSON response template.
 *
 * @param {String} state
 * @param {Object} resultObj
 * @returns {{state: string, result: any}}
 */
function createBaseJsonResponse(state, resultObj) {
    return {
        state: state,
        result: resultObj
    }
}

/**
 * This method creates new successful JSON representative JavaScript object
 * containing a book document or an array of book documents in result field.
 *
 * @param {import('../models/Book') || [import('../models/Book')]} book Book document or array of book documents
 * @returns {{state: string, result: import('../models/Book') || [import('../models/Book')]}}
 */
function createBookJsonResponse(book) {
    const formattedBook = {
        name: book.name,
        author: book.author,
        genre: book.genre,
        publishYear: book.publishYear,
        creator: book.creator.username
    }

    if (book.description) {
        formattedBook.description = book.description;
    }

    return createBaseJsonResponse('success', formattedBook);
}

/**
 * This method creates new successful JSON representative Javascript object
 * containing formatted User document in result field.
 *
 * @param {import('../models/User')} user User document
 * @returns {{state: string, result: import('../models/User')}}
 */
function createUserJsonResponse(user) {
    const formattedUser = {
        username: user.username,
        apiKey: user.apiKey,
        firstName: user.firstName,
        lastName: user.lastName
    };

    return createBaseJsonResponse('success', formattedUser);
}

/**
 * This method creates new successful JSON representative JavaScript object
 * containing a message in a result field
 *
 * @param {String} message
 * @returns {{result: string, state: Object}}
 */
function createSuccessMessageResponse(message) {
    return createBaseJsonResponse('success', message);
}

/**
 * This method creates new error JSON representative Javascript object
 * containing an error
 *
 * @param {Error} err Error Object
 * @returns {{state: string, result: Object}}
 */
function createErrorResponse(err) {
    const resultObj = {...err};

    return createBaseJsonResponse('error', resultObj);
}

/**
 * This method creates new error JSON representative Javascript object
 * containing an error message
 *
 * @param {String} errMessage Error Object
 * @returns {{state: string, result: String}}
 */
function createErrorMessageResponse(errMessage) {
    return createBaseJsonResponse('error', errMessage);
}


module.exports.createBookJsonResponse = createBookJsonResponse;
module.exports.createUserJsonResponse = createUserJsonResponse;
module.exports.createSuccessMessageResponse = createSuccessMessageResponse;
module.exports.createErrorResponse = createErrorResponse;
module.exports.createErrorMessageResponse = createErrorMessageResponse;
