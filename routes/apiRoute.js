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
const {validateContentType, validateBookExists} = require('../utilities/customValidators');


/**
 * @swagger
 * components:
 *  schemas:
 *   Book:
 *    type: object
 *    required:
 *     - name
 *     - author
 *     - genre
 *     - publishYear
 *    properties:
 *     _id:
 *      type: string
 *      description: Unique identifier of the book
 *     __v:
 *      type: integer
 *      description: Internal revision of the document in MongoDB
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
 *    example:
 *     _id: 66b8d272689cd84f6a762a23
 *     __v: 0
 *     name: Twenty Thousand Leagues Under the Seas
 *     author: Jules Verne
 *     genre: Adventure
 *     publishYear: 1872
 *     description: Twenty Thousand Leagues Under the Seas is a science fiction adventure novel by the French writer Jules Verne.
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
 *        - name
 *        - author
 *        - genre
 *        - publishYear
 *       properties:
 *        name:
 *         type: string
 *         description: Title of the book
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
    body('name').isString().notEmpty(),
    body('author').isString().notEmpty(),
    body('genre').isString().notEmpty(),
    body('publishYear').isNumeric().notEmpty(),
    body('description').isString().optional()]),
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
 * This route validates request body for having any of 4 fields with correct types and
 * request param for correct mongoId structure, finds corresponding book document
 * and updates it with relevant information. Returns updated book in JSON format.
 * If fails, throws ValidateError.
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
 * This route validates request param for correct mongoId structure
 * and deletes it from the database. Returns deleted book document in JSON format.
 * If fails, throws ValidateError.
 */
router.delete('/books/:bookId',
    validateContentType('none'),
    catchAsyncError(validateBookExists),
    catchAsyncError(deleteBookRoute));

module.exports = router;
