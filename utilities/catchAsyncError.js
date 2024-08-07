/**
 * This method is used for handling errors in async functions.
 * It takes desired function as callback and immediately returns
 * new function, where req, res and next parameters get arguments
 * from app/route methods. As returned function returns, it automatically
 * triggers callback function. .catch is used to catch any errors and send
 * them to error handlers with next.
 *
 * @param {Function} callback Desired function
 * @returns {(function(import('express').Request, import('express').Response, callback): void)|*}
 */
function catchAsyncError(callback) {
    return function (req, res, next) {
        callback(req, res, next).catch(err => next(err));
    }
}

module.exports = catchAsyncError;
