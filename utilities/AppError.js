/**
 * This error class is used for
 * representing any validation errors
 * coming from express-validator.
 */
class AppError {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     * @param {Number} statusCode HTTP status code
     * @param {Array} innerValidationErrors Array of any additional errors (optional)
     */
    constructor(message, statusCode, innerValidationErrors = []) {
        this.message = message;
        this.statusCode = statusCode;
        this.innerValidationErrors = innerValidationErrors;
    }
}

module.exports = AppError;
