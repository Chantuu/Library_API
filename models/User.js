const mongoose = require('mongoose');

/**
 * This class represent User documents in MongoDB
 *
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultSchemaOptions, {firstName: {type: StringConstructor, required: boolean}, lastName: {type: StringConstructor, required: boolean}, apiKey: {type: StringConstructor, required: boolean}, hash: {type: StringConstructor, required: boolean}, username: {type: StringConstructor, required: boolean}}, HydratedDocument<FlatRecord<{firstName: {type: StringConstructor, required: boolean}, lastName: {type: StringConstructor, required: boolean}, apiKey: {type: StringConstructor, required: boolean}, hash: {type: StringConstructor, required: boolean}, username: {type: StringConstructor, required: boolean}}>, {}>>}
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('User', userSchema);
