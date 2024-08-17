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

module.exports.hashPassword = hashPassword;
