const mongoose = require('mongoose');
const User = require('../models/User');
const {v4: uuidv4} = require("uuid");
const {hashPassword} = require("../utilities/helperFunctions");

class UserRepository {
    /**
     * This private method is used by other methods for
     * connecting to the database.
     *
     * @returns {Promise<Mongoose>} Promise
     */
    static #connectToDb() {
        return mongoose.connect(process.env.DATABASE_URI, {serverSelectionTimeoutMS: 10000});
    }

    /**
     * This method closes connection to the database.
     *
     * @returns {Promise<void>} Promise
     */
    static disconnectFromDb() {
        return mongoose.connection.close();
    }

    /**
     *  This method returns the user by specified username parameter.
     *
     * @param {String} username Username of the user
     * @returns {Query<User>}
     */
    static async getUserByUsername(username) {
        await this.#connectToDb();

        return User.findOne({username: username});
    }

    /**
     * This method creates new user from supplied parameters, but before saving to the database,
     * API key is automatically generated and password is hashed before saving to the MongoDB.
     *
     * @param {String} username Username of the user
     * @param {String} password Password of the user
     * @param {String} firstName First name of the user
     * @param {String} lastName Last name of the user
     * @returns {Query<User>} Returns query containing newly created User
     */
    static async createUser(username, password, firstName, lastName) {
        await this.#connectToDb();

        const hashedPassword = await hashPassword(password);
        const apiKey = uuidv4();

        const newUser = new User({
            username: username,
            hash: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            apiKey: apiKey
        });
        await newUser.save();
        return newUser;
    }

    /**
     * This method gets existing user by username parameters and updates data with updateData object.
     * As a result, updated object is saved to MongoDB and returned after that.
     *
     * @param {string} username User username
     * @param {{firstName: String, lastName: String, password: String}} updateData New data for specified user document
     * @returns {Promise<User>}
     */
    static async updateUser(username, updateData) {
        const updatedUser = await this.getUserByUsername(username);

        for (let property in updateData) {
            if (property === 'password') {
                updatedUser.hash = await hashPassword(updateData[property]);
            }
            else if (property) {
                updatedUser[property] = updateData[property];
            }
        }

        await updatedUser.save();
        return updatedUser;
    }

    /**
     * This method gets user matching to the specified username
     * and deletes it from the MongoDB. As a result is returned object
     * containing details about operation.
     *
     * @param {String} username User username
     * @returns {Promise<{acknowleged: Boolean, deletedCount: Number}>}
     */
    static async deleteUser(username) {
        await this.#connectToDb();

        return User.deleteOne({ username: username });
    }
}

module.exports = UserRepository;
