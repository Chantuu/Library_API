const express = require('express');
const router = express.Router();
const {
    getBooksRoute,
    createBookRoute,
    displayBookByIdRoute,
    patchBookRoute,
    deleteBookRoute
} = require('../controllers/apiRouteController');
const catchAsyncError = require('../utilities/catchAsyncError');
const {checkExact, body} = require("express-validator");
const {validateContentType, validateBookExists, authenticateUserWithApiKey, noWhitespacesBetween, isObjectEmpty} = require('../utilities/customValidators');
const {noSpaceBetweenErrorMessage, noEmptyPayloadErrorMessage, fieldMustBeNumberErrorMessage,
    fieldMustBeStringErrorMessage, fieldMustExistErrorMessage, payloadMustBeObjectErrorMessage
} = require("../utilities/errorMessages");


/**
 * @swagger
 * components:
 *  schemas:
 *   Book:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      description: Title of the book
 *     author:
 *      type: string
 *      description: Author of the book
 *     genre:
 *      type: string
 *      description: Genre of the book
 *     publishYear:
 *      type: integer
 *      description: Year, when the book was published
 *     description:
 *      type: string
 *      description: Description of the book
 *     creator:
 *      type: string
 *      description: User, who uploaded this book to the API.
 *    example:
 *     name: Twenty Thousand Leagues Under the Seas
 *     author: Jules Verne
 *     genre: Adventure
 *     publishYear: 1872
 *     description: Twenty Thousand Leagues Under the Seas is a science fiction adventure novel by the French writer Jules Verne.
 *     creator: someUser
 */


/**
 * @swagger
 * tags:
 *  name: Books
 *  description: Routes related to the book management
 */


/**
 * @swagger
 * /api/books:
 *  get:
 *   summary: This route returns the list of all available books.
 *   tags: [Books]
 *   responses:
 *    200:
 *     description: Successfully returned list containing all books
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         state:
 *          type: string
 *          description: Status of the API operation
 *         result:
 *          type: array
 *          description: Result of the API operation
 *          items:
 *           $ref: "#/components/schemas/Book"
 *    400:
 *     description: Bad Request
 *    500:
 *     description: Internal Server Error
 */
router.get('/books',
    validateContentType('none'),
    catchAsyncError(getBooksRoute));

/**
 * @swagger
 * /api/books:
 *  post:
 *   summary: This route creates new book in the program.
 *   tags: [Books]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - apiKey
 *        - newBook
 *       properties:
 *        apiKey:
 *         type: string
 *         description: API key of the user
 *        newBook:
 *         type: object
 *         description: Necessary data for creating new Book
 *         required:
 *          - name
 *          - author
 *          - genre
 *          - publishYear
 *         properties:
 *          name:
 *           type: string
 *           description: Title of the book
 *          author:
 *           type: string
 *           description: Author of the book
 *          genre:
 *           type: string
 *           description: Genre of the book
 *          publishYear:
 *           type: integer
 *           description: Year, when the book was published
 *          description:
 *           type: string
 *           description: Description of the book
 *   responses:
 *    200:
 *     description: Successfully created new book
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         state:
 *          type: string
 *          description: Status of the API operation
 *         result:
 *          type: object
 *          description: Result of the API operation
 *          $ref: "#/components/schemas/Book"
 *    400:
 *     description: Bad Request
 *    500:
 *     description: Internal Server Error
 */
router.post('/books',
    validateContentType('application/json'),
    checkExact([
        body('apiKey').notEmpty().isString().custom(noWhitespacesBetween).withMessage(noSpaceBetweenErrorMessage),
        body('newBook').isObject().withMessage(payloadMustBeObjectErrorMessage)
            .custom(isObjectEmpty).withMessage(noEmptyPayloadErrorMessage),

        body('newBook.name').notEmpty().withMessage(fieldMustExistErrorMessage)
            .isString().withMessage(fieldMustBeStringErrorMessage),

        body('newBook.author').notEmpty().withMessage(fieldMustExistErrorMessage)
            .isString().withMessage(fieldMustBeStringErrorMessage),

        body('newBook.genre').notEmpty().withMessage(fieldMustExistErrorMessage)
            .isString().withMessage(fieldMustBeStringErrorMessage),

        body('newBook.publishYear').notEmpty().withMessage(fieldMustExistErrorMessage)
            .isNumeric().withMessage(fieldMustBeNumberErrorMessage),

        body('newBook.description').isString().optional()]),
    catchAsyncError(authenticateUserWithApiKey),
    catchAsyncError(createBookRoute));

/**
 * @swagger
 * /api/books/{bookId}:
 *  get:
 *   summary: This route gets one book by specified book ID
 *   tags: [Books]
 *   parameters:
 *    - in: path
 *      name: bookId
 *      schema:
 *       type: string
 *       required: true
 *       description: ID of the book
 *   responses:
 *    200:
 *     description: Successfully returned book
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         state:
 *          type: string
 *          description: Status of the API operation
 *         result:
 *          type: object
 *          description: Result of the API operation
 *          $ref: "#/components/schemas/Book"
 *    400:
 *     description: Bad Request
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 */
router.get('/books/:bookId',
    validateContentType('none'),
    catchAsyncError(validateBookExists),
    catchAsyncError(displayBookByIdRoute));

/**
 * @swagger
 * /api/books/{bookId}:
 *  patch:
 *   summary: This route updates one book by specified book ID
 *   tags: [Books]
 *   parameters:
 *    - in: path
 *      name: bookId
 *      schema:
 *       type: string
 *       required: true
 *       description: ID of the book
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: Name of the book
 *        author:
 *         type: string
 *         description: Author of the book
 *        genre:
 *         type: string
 *         description: Genre of the book
 *        publishYear:
 *         type: integer
 *         description: Year, when the book was published
 *        description:
 *         type: string
 *         description: Description of the book
 *   responses:
 *    200:
 *     description: Successfully updated book
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         state:
 *          type: string
 *          description: Status of the API operation
 *         result:
 *          type: object
 *          description: Result of the API operation
 *          $ref: "#/components/schemas/Book"
 *    400:
 *     description: Bad Request
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 */
router.patch('/books/:bookId',
    validateContentType('application/json'),
    catchAsyncError(validateBookExists),
    checkExact([
    body('name').isString().optional(),
    body('author').isString().optional(),
    body('genre').isString().optional(),
    body('publishYear').isNumeric().optional(),
    body('description').isString().optional()
    ]),
    catchAsyncError(patchBookRoute));

/**
 * @swagger
 * /api/books/{bookId}:
 *  delete:
 *   summary: This route deletes book by the specified book ID
 *   tags: [Books]
 *   parameters:
 *    - in: path
 *      name: bookId
 *      schema:
 *       type: string
 *       description: ID of the book
 *       required: true
 *   responses:
 *    200:
 *     description: Successfully updated book
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         state:
 *          type: string
 *          description: Status of the API operation
 *         result:
 *          type: object
 *          description: Result of the API operation
 *          $ref: "#/components/schemas/Book"
 *    400:
 *     description: Bad Request
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 */
router.delete('/books/:bookId',
    validateContentType('none'),
    catchAsyncError(validateBookExists),
    catchAsyncError(deleteBookRoute));

module.exports = router;
