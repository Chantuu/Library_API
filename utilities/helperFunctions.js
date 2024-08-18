const bcrypt = require('bcrypt');

/**
 * This function transforms plain text password into
 * hashed and salted password ready for database usage.
 *
 * @param {string} password Plain text Password
 * @returns {Promise<String>} Promise with hashed password as a result
 */
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
}

/**
 * This function compares plain text password to hashed password
 * and checks if they are the same. Returns true or false.
 *
 * @param {string} plainPassword Plain text password
 * @param {string} hashedPassword Hashed password
 * @returns {Promise<boolean>} Returns promise with boolean
 */
async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;
