const mongoose = require('mongoose');

/**
 * This schema represents a book document in the database.
 *
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultSchemaOptions, {publishYear: {type: NumberConstructor, required: boolean}, author: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, name: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, genre: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, description: StringConstructor}, HydratedDocument<FlatRecord<{publishYear: {type: NumberConstructor, required: boolean}, author: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, name: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, genre: {maxlength: (number|string)[], minLength: (number|string)[], type: StringConstructor, required: boolean}, description: StringConstructor}>, {}>>}
 */
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    publishYear: {
        type: Number,
        required: true
    },
    description: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Book', bookSchema);
