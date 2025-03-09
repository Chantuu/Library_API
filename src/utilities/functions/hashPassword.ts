import * as bcrypt from 'bcrypt';

/**
 * This simple function transforms plain text password and returns a promise
 * containing that password's hash.
 *
 * @param {string} plainPassword - Password to be hashed
 * @returns {Promise<string>}
 */
export async function hashPassword(plainPassword: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  return hashedPassword;
}
