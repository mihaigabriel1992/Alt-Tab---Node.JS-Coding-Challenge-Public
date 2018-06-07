'use strict';

/**
 * @module services/user
 */

const User = require('../models/user').user;
/**
 * Creates a new user account.
 * @param {string} email - The email of the user.
 * @param {string} password - The users's password.
 * @param {string} name - The user's name.
 * @returns {Promise}
 */
function createUser(
  email,
  password,
  name
) {
  const user = new User({
    email,
    password,
    name,
  });

  return user.save();
}

/**
 * Check if user exists based on email.
 *
 * @param {String} email The user's name
 * @returns {promise}
 */
function* checkIfUserExists(email) {
  const user = yield User
    .findOne({
      email,
    });

  if (user) {
    return true;
  }
  return false;
}

/**
 * Gets user profile by user id.
 *
 * @param {String} userId The id of the user to get the profile for.
 * @returns {Promise}
 */
function getProfile(userId) {
  return User
    .findById({ _id: userId })
    .then(user => Promise.resolve({
      userId,
      name: user.name,
      email: user.email,
    }));
}

/**
 * Registers a new user within the system.
 *
 * @param {string} [options.email] - The email of the user.
 * @param {string} [options.name] - The name of the user.
 * @param {string} [options.password] - The password of the user.
 * @returns {Promise}
 */
function* register(options) {
  const email = options.email;
  const name = options.name;
  const password = options.password;

  if (yield checkIfUserExists(email)) {
    throw new Error('User already exists');
  } else {
    return createUser(email, password, name);
  }
}

module.exports = {
  getProfile,
  register,
};
