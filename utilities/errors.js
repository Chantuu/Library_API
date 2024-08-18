/**
 * This error class is base class,
 * used for grouping base functionality
 * in one place
 */
class BaseError {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     */
    constructor(message) {
        this.message = message;
    }
}

/**
 * This error class is used for
 * representing any validation errors
 * coming from express-validator.
 */
class ValidationError extends BaseError {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     * @param {Array} innerValidationErrors Array of any additional errors (optional)
     */
    constructor(message, innerValidationErrors = []) {
        super(message);
        this.innerValidationErrors = innerValidationErrors;
    }
}

/**
 * This error class is used for
 * representing any 404/Not found errors.
 */
class NotFoundError extends BaseError {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     */
    constructor(message) {
        super(message);
    }
}

/**
 * This error class is used for
 * representing errors, telling that
 * item already exists.
 */
class AlreadyExistsError extends BaseError {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     */
    constructor(message) {
        super(message);
    }
}


/**
 * This error class is used for
 * representing errors, when authorization error
 * occurs
 */
class UnauthorizedError extends BaseError {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     */
    constructor(message) {
        super(message);
    }
}

module.exports.BaseError = BaseError;
module.exports.ValidationError = ValidationError;
module.exports.NotFoundError = NotFoundError;
module.exports.AlreadyExistsError = AlreadyExistsError;
module.exports.UnauthenticatedError = UnauthorizedError;
