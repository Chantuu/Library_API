function createBaseJsonResponse(state, resultObj) {
    return {
        state: state,
        result: resultObj
    }
}

function createBookJsonResponse(book) {
    return createBaseJsonResponse('success', book);
}

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
