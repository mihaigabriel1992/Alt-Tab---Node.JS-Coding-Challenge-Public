'use strict';

/**
 * @module services/user
 */

const User = require('../models/user').user;
const errors = require('./errors.service');

/**
 * Creates a new user account.
 * @param {string} id - The id of the user to create.
 * @param {string} email - The email of the user.
 * @param {string} password - The users's password.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @returns {Promise}
 */
function createUser(
  email,
  password,
  firstName,
  lastName
) {
  return User.create({
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  });
}

/**
 * Get info about user if it's active or not.
 *
 * @param {String} userId The user's id
 * @returns {Promise}
 */
function getUserActive(userId) {
  return User
        .findById(userId);
}

/**
 * Check if an user is valid
 *
 * @param {String} email The user's email address
 * @param {String} password The user's password
 * @returns {Promise}
 */
function validateUser(email, password) {
  return User
    .find({
      email,
      password,
    })
    .then((user) => {
      if (!user || !user.id) throw new errors.UnauthorizedError();

      return user;
    });
}

/**
 * Gets user profile by user id.
 *
 * @param {String} userId The id of the user to get the profile for.
 * @returns {Promise}
 */
function getProfile(userId) {
  return User
    .find({ id: userId })
    .then(user => Promise.resolve({
      userId,
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
    }));
}

/**
 * Registers a new user within the system.
 *
 * @param {string} [options.email] - The email of the user.
 * @param {string} [options.firstName] - The first name of the user.
 * @param {string} [options.lastName] - The last name of the user.
 * @returns {Promise}
 */
function register(options) {
  const email = options.email;
  const firstName = options.firstName;
  const lastName = options.lastName;
  const password = options.password;

  return createUser(email, password, firstName, lastName);
}

module.exports = {
  validateUser,
  getProfile,
  register,
  getUserActive,
};
