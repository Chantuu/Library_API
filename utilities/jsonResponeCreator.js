/**
 * This method is used for creating JSON response template.
 *
 * @param {String} state
 * @param {Object} resultObj
 * @returns {{result: string, state: Object}}
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
 * @returns {{result: string, state: import('../models/Book') || [import('../models/Book')]}}
 */
function createBookJsonResponse(book) {
    return createBaseJsonResponse('success', book);
}

/**
 *
 * This method creates new error JSON representative Javascript
 * object containing an error in result field.
 *
 * @param {String} errorMessage Error message
 * @param {String} type Type of error
 * @param {Number} statusCode HTTP status code
 * @param {Array} innerErrors Any additional errors (optional)
 * @returns {{result: string, state: Object}}
 */
function createErrorResponse(errorMessage, type, statusCode, innerErrors=[]) {
    const resultObj = {
        errorMessage: errorMessage,
        type: type,
        statusCode: statusCode
    };

    if (innerErrors.length) {
        resultObj.innerErrors = innerErrors;
    }

    return createBaseJsonResponse('error', resultObj);
}

module.exports.createBookJsonResponse = createBookJsonResponse;
module.exports.createErrorResponse = createErrorResponse;
