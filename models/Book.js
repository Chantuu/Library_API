const mongoose = require('mongoose');

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
