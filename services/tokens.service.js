/**
 * @module services/tokens
 */

const timestamp = require('unix-timestamp');
const jwt = require('jwt-simple');
const config = require('../config');
const helperService = require('./helper.service');
const errors = require('./errors.service');
const userService = require('./user.service');

/**
 * Validate an access token
 *
 * @param {String} token The access token to be validated.
 * @param {String} secret The shared secret used to validate the token
 * @returns {Promise}
 */
function validateAccessToken(token) {
  const secret = config.authentication.secret.secretKey;
  return new Promise((resolve, reject) => {
    try {
      // Get segments
      const segments = token.split('.');

      // Invalid token format
      if (segments.length !== 3) return reject(4001);

      const payloadSeg = helperService.base64urlUnEscape(segments[1]);
      const payload = JSON.parse(new Buffer(payloadSeg, 'base64').toString());

      if (payload.token_type !== 'bearer') {
        // Provided token is not access token
        return reject(401);
      }

      const current = timestamp.now();
      if (payload.expires < current) {
        // Token expired
        return reject(401);
      }

      const decoded = jwt.decode(token, secret + payload.user_id);

      return resolve(decoded.user_id);
    } catch (err) {
      // Invalid token
      return reject(401);
    }
  });
}

/**
 * Get access token for an user id and a secret key
 *
 * @param {String} userID The user's id
 * @param {String} secretKey The secret key
 * @returns {Promise}
 */
function getAccessToken(userID, secretKey) {
  function makeAccessToken() {
    const expires = timestamp.now(config.authentication.accessTokenExpireTime);
    const payload = {
      token_type: 'bearer',
      expires,
      user_id: userID,
    };

    const secret = secretKey + userID;

    return jwt.encode(payload, secret);
  }

  return makeAccessToken();
}

module.exports = {
  validateAccessToken,
  getAccessToken,
};
