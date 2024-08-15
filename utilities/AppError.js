/**
 * This error class is used for
 * representing any validation errors
 * coming from express-validator.
 */
class ValidationError {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     * @param {Array} innerValidationErrors Array of any additional errors (optional)
     */
    constructor(message, innerValidationErrors = []) {
        this.message = message;
        this.innerValidationErrors = innerValidationErrors;
    }
}

/**
 * This error class is used for
 * representing any 404/Not found errors.
 */
class NotFoundError {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     */
    constructor(message) {
        this.message = message;
    }
}

module.exports.ValidationError = ValidationError;
module.exports.NotFoundError = NotFoundError;
