const mongoose = require('mongoose');

/**
 * This schema represents a book document in the database.
 *
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultSchemaOptions, {publishYear: {type: NumberConstructor, required: boolean}, author: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, name: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, genre: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, description: StringConstructor}, HydratedDocument<FlatRecord<{publishYear: {type: NumberConstructor, required: boolean}, author: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, name: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, genre: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, description: StringConstructor}>, {}>>}
 */
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: [30, 'Name length limit exceeds 30 characters'],
        minLength: [1, 'Name length minimum limit is below 1']
    },
    author: {
        type: String,
        required: true,
        maxlength: [30, 'Name length limit exceeds 30 characters'],
        minLength: [1, 'Name length minimum limit is below 1']
    },
    genre: {
        type: String,
        required: true,
        maxlength: [20, 'Name length limit exceeds 30 characters'],
        minLength: [1, 'Name length minimum limit is below 1']
    },
    publishYear: {
        type: Number,
        required: true
    },
    description: String
});

module.exports = mongoose.model('Book', bookSchema);
