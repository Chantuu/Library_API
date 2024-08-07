/**
 * This error class extends base Error class
 * and is used for representing any validation errors
 * coming from express-validator.
 */
class ValidationError extends Error {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     * @param {Number} statusCode HTTP status code
     * @param {Array} innerValidationErrors Array of any additional errors (optional)
     */
    constructor(message, statusCode, innerValidationErrors) {
        super(message);
        this.statusCode = statusCode;
        this.innerValidationErrors = innerValidationErrors;
    }
}

module.exports = ValidationError;
