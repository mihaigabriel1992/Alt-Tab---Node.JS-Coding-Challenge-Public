'use strict';

/* eslint max-len: ["error", 180] */

/**
 * UnEscape base64 strings
 *
 * @param {String} str String to be unescaped
 * @returns {String}
 */
function base64urlUnEscape(str) {
  str += new Array(5 - (str.length % 4)).join('=');
  return str.replace(/-/g, '+').replace(/_/g, '/');
}

/**
 * Validates an email
 *
 * @param {String} email The email to be validated
 * @returns {Boolean}
 */
function validateEmail(email) {
  const re = /^(?!.{81})(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**
 * Validates a string length
 *
 * @param {String} string The string to be validated
 * @param {Integer} string The string to be validated
 * @returns {Boolean}
 */

function validateName(name, maxLength) {
  if (!name || name.length > maxLength) return false;
  return true;
}

/**
 * Validates a password format
 *
 * @param {String} password The password to be validated
 * @returns {Boolean}
 */
function validatePassword(password) {
  if (!password || password.length < 4) return false;
  return true;
}

module.exports = {
  base64urlUnEscape,
  validateEmail,
  validatePassword,
  validateName,
};
