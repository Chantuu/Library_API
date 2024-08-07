function createBaseJsonResponse(state, resultObj) {
    return {
        state: state,
        result: resultObj
    }
}

function createBookJsonResponse(book) {
    return createBaseJsonResponse('success', book);
}


module.exports.createBookJsonResponse = createBookJsonResponse;
