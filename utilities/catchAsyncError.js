function catchAsyncError(callback) {
    return function (req, res, next) {
        callback(req, res, next).catch(err => next(err));
    }
}

module.exports = catchAsyncError;
